// utils
import { io, Socket } from 'socket.io-client';

// state
import { observable } from '@legendapp/state';
import { queue$ as _queue$, user$ as _user$, lists$ as _lists$ } from '@/state/state';
import { queueOperation } from '@/state/actions-queue';

// types
import { QueuedOperation } from '@/types/QueuedOperation';
import { updateUser } from '@/state/actions-user';

type ConnectionState = {
  isConnected: boolean;
  lastConnected: string | null;
  errors: string[];
};

// Connection state observable
export const connectionStatus$ = observable<ConnectionState>({
  isConnected: false,
  lastConnected: null,
  errors: [],
});

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

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
    });

    this.setupEventHandlers();
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

    // load up the user's data
    this.emit('auth', { auth: _user$.auth.get() });
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

    // Sync data and process offline queue
    // await this.syncFromServer();
    await processOfflineQueue();
  };

  handleDisconnect = () => {
    console.log('Disconnected from WebSocket server');
    connectionStatus$.isConnected.set(false);
  };

  handleError = (error: Error) => {
    console.error('WebSocket connection error:', error);

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('Max reconnect attempts reached');
    }
  };

  handleDataError = (data: Error) => {
    console.error('WebSocket data error:', data);
    connectionStatus$.errors.push(data.message);
  };

  handleAuthUpdate = (data: any) => {
    console.log('Auth update:', data);

    const { uid, names, notifyOnItemStateUpdate, notifyOnListItemsUpdate, notifyOnListShared, lists } =
      data?.userData || data?.newUser || {};
    if (!uid || !names) {
      console.error('Invalid user data:', data);
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
      // WIP: update list state
      // TODO: do that properly
      _lists$.set(lists);
    }
  };

  handleListUpdate = (data: any) => {
    const { listId, changes } = data;
    // Update local state with server changes
    _lists$[listId].assign(changes);
  };

  async syncFromServer() {
    // Request full state from server
    return new Promise<void>((resolve, reject) => {
      if (!this.socket) {
        reject('No socket connection');
        return;
      }

      this.socket.emit('sync:request', null, (response: any) => {
        if (response.error) {
          reject(response.error);
          return;
        }

        // Update state with server data
        const { lists } = response;
        _lists$.set(lists);
        resolve();
      });
    });
  }

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

  dispose() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export function processOfflineQueue() {
  try {
    const queue = _queue$.get();
    if (queue.length === 0) return;

    const remainingOperations: QueuedOperation[] = [];

    // Process each operation
    for (const operation of queue) {
      // console.log('Processing operation:', operation);
      const success = socketService.emit(operation.event, operation.data);

      if (!success) {
        remainingOperations.push(operation);
      }
    }

    // Update the queue with remaining operations
    _queue$.set(remainingOperations);
  } catch (error) {
    console.error('Error processing offline queue:', error);
  }
}

export const socketService = new SocketService();
