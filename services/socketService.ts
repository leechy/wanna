// utils
import { io, Socket } from 'socket.io-client';
import NetInfo from '@react-native-community/netinfo';

// state
import { observe } from '@legendapp/state';
import { queue$ as _queue$, user$ as _user$, lists$ as _lists$, connectionStatus$ } from '@/state/state';
import { queueOperation } from '@/state/actions-queue';
import { updateUser } from '@/state/actions-user';
import { updateList } from '@/state/actions-lists';

// types
import { QueuedOperation } from '@/types/QueuedOperation';

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

    // Set up list update listeners
    this.setupListListeners();
  }

  setupListListeners() {
    const lists = Object.keys(_lists$.get());
    lists.forEach((listId) => {
      this.socket?.on(`list:${listId}`, this.handleListUpdate);
    });
  }

  handleConnect = async () => {
    console.log('Connected to WebSocket server');
    connectionStatus$.isConnected.set(true);
    connectionStatus$.lastConnected.set(new Date().toISOString());
    this.reconnectAttempts = 0;

    if (_user$.auth.get()) {
      // Sync user data if there is user already
      queueOperation('auth', { auth: _user$.auth.get() });
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

  handleDataError = (data: Error) => {
    console.error('WebSocket data error:', data);
    connectionStatus$.errors.push(data.message);
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
  };

  handleListUpdate = (message: any) => {
    const {
      data: { listId, ...changes },
    } = message;
    updateList(listId, changes, true);
  };

  subscribeToList(listId: string) {
    this.socket?.emit('subscribe', { listId });
    this.socket?.on(`list:${listId}`, this.handleListUpdate);
  }

  unsubscribeFromList(listId: string) {
    this.socket?.emit('unsubscribe', { listId });
    this.socket?.off(`list:${listId}`);
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
