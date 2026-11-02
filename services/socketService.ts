// utils
import { io, Socket } from 'socket.io-client';
import NetInfo from '@react-native-community/netinfo';

// state
import { observe } from '@legendapp/state';
import { queue$ as _queue$, user$ as _user$, connectionStatus$, pendingShare$ } from '@/state/state';
import { queueOperation } from '@/state/actions-queue';
import { updateUser } from '@/state/actions-user';
import { updateList } from '@/state/actions-lists';

// types
import { QueuedOperation } from '@/types/QueuedOperation';

// replies to the commands, not the list updates
const LIST_COMMANDS = ['list:join', 'list:leave', 'list:view'];

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private netInfoUnsubscribe: (() => void) | null = null;
  private queueObserver: any = null;

  initialize() {
    if (this.socket) return;

    const user = _user$.get();
    if (!user) return;

    this.socket = io(process.env.EXPO_PUBLIC_API_URL, {
      auth: {
        Authorization: user?.auth || '',
      },
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    this.setupEventHandlers();
    this.setupNetworkListener();
    this.setupQueueObserver();
  }

  setupNetworkListener() {
    // Clean up any existing listener
    if (this.netInfoUnsubscribe) {
      this.netInfoUnsubscribe();
    }

    // Subscribe to network state updates
    this.netInfoUnsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        // Network is back - attempt reconnection if socket is disconnected
        if (!this.socket?.connected) {
          this.reconnect();
        }
      } else {
        // Network is gone - update UI state
        connectionStatus$.isConnected.set(false);
      }
    });
  }

  reconnect() {
    // Cleanup existing socket if needed
    if (this.socket) {
      if (this.socket.connected) {
        return; // Already connected
      }

      // If disconnected but exists, try to reconnect
      this.socket.connect();
    } else {
      // Socket doesn't exist, reinitialize
      this.initialize();
    }
  }

  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', this.handleConnect);
    this.socket.on('disconnect', this.handleDisconnect);
    this.socket.on('connect_error', this.handleError);

    this.socket.on('error', this.handleDataError);

    this.socket.on('auth', this.handleAuthUpdate);
    this.socket.on('list:join', this.handleListJoin);

    // the server sends the updates of every list the user is in as `list:<listId>`,
    // including the lists created or joined after the connection
    this.socket.onAny((event: string, message: any) => {
      if (event.startsWith('list:') && !LIST_COMMANDS.includes(event)) {
        this.handleListUpdate(message);
      }
    });
  }

  handleConnect = async () => {
    console.log('Connected to WebSocket server');
    connectionStatus$.isConnected.set(true);
    connectionStatus$.lastConnected.set(new Date().toISOString());
    this.reconnectAttempts = 0;

    const { uid, auth, names } = _user$.get() || {};
    if (auth) {
      // Sync user data if there is user already, the server signs up
      // the user with uid + names when it doesn't know the token yet
      queueOperation('auth', { uid, auth, names });
    }

    // and process queue
    await this.processQueue();
  };

  handleDisconnect = () => {
    console.log('Disconnected from WebSocket server');
    connectionStatus$.isConnected.set(false);
  };

  handleError = (error: Error) => {
    console.warn('WebSocket connection error:', error);

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('Max reconnect attempts reached');
    }
  };

  // the server reports the failed messages as { event, error }
  handleDataError = (data: { event?: string; error?: string }) => {
    console.warn('WebSocket data error:', data);
    if (data?.event === 'list:join') {
      pendingShare$.error.set(data.error ?? 'Could not join the list');
    }
    connectionStatus$.errors.push(data?.error ?? 'Unknown error');
  };

  handleAuthUpdate = (message: any) => {
    // console.log('Auth update:', JSON.stringify(message, null, 2));

    const { uid, names, notifyOnItemStateUpdate, notifyOnListItemsUpdate, notifyOnListShared, lists } =
      message?.userData || message?.newUser || {};
    if (!uid || !names) {
      console.error('Invalid user data:', message);
      return;
    }

    // update user state
    updateUser({
      names,
      notifyOnItemStateUpdate,
      notifyOnListItemsUpdate,
      notifyOnListShared,
    });

    if (lists?.length) {
      lists.forEach((list: any) => {
        updateList(list.listId, list, true);
      });
    }

    // the token may be new since the last time, or the server may have lost it
    const expo_push_token = _user$.expo_push_token?.get();
    if (expo_push_token) {
      queueOperation('user:update', { expo_push_token });
    }
  };

  handleListUpdate = (message: any) => {
    const {
      data: { listId, ...changes },
    } = message;
    updateList(listId, changes, true);
  };

  handleListJoin = (message: any) => {
    const { joinedList } = message || {};
    if (joinedList?.listId) {
      updateList(joinedList.listId, joinedList, true);
    }
  };

  /**
   * Sends right away, or not at all when offline:
   * for the messages that make no sense later, like heartbeats
   */
  sendNow(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  emit(event: string, data: any) {
    if (!this.socket || !connectionStatus$.isConnected.get()) {
      // Queue the operation if offline
      queueOperation(event, data);
      return false;
    }

    this.socket.emit(event, data);
    return true;
  }

  setupQueueObserver() {
    // Clean up previous observer if it exists
    if (this.queueObserver) {
      this.queueObserver();
    }

    // Create a new observer that runs whenever the queue changes
    this.queueObserver = observe(_queue$, (queue) => {
      // Only process if there are items in the queue AND we're connected
      if ((queue.value?.length || 0) > 0 && connectionStatus$.isConnected.get() && this.socket?.connected) {
        // console.log(`Queue changed - processing ${queue.value?.length || 0} operations`);
        this.processQueue();
      }
    });
  }

  processQueue() {
    try {
      const queue = _queue$.get();
      if (queue.length === 0) return;

      const remainingOperations: QueuedOperation[] = [];

      // Process each operation
      for (const operation of queue) {
        if (!operation?.event || !operation?.data) {
          console.warn('Invalid operation:', operation);
          continue;
        }
        if (!this.socket) {
          console.warn('Socket not initialized:', operation);
          break;
        }
        const success = this.socket.emit(operation.event, operation.data);

        if (!success) {
          console.log('Operation failed:', operation);
          remainingOperations.push(operation);
        }
      }

      // Update the queue with remaining operations
      _queue$.set(remainingOperations);
    } catch (error) {
      console.error('Error processing offline queue:', error);
    }
  }

  dispose() {
    // Clean up the queue observer
    if (this.queueObserver) {
      this.queueObserver();
      this.queueObserver = null;
    }

    // Clean up network observer
    if (this.netInfoUnsubscribe) {
      this.netInfoUnsubscribe();
      this.netInfoUnsubscribe = null;
    }

    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
