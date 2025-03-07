import { queue$ as _queue$ } from './state';

/**
 * Adds a web-socket event to the queue
 *
 * @param event
 * @param data
 * @returns
 */
export async function queueOperation(event: string, data: any) {
  try {
    // Create new operation
    const operation = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      event,
      data,
    };

    // Add to queue using Legend State (this is synchronous and avoids race conditions)
    _queue$.push(operation);
    return operation.id;
  } catch (error) {
    console.error('Error queueing operation:', error);
    return null;
  }
}

/**
 * Clears the queue
 */
export async function clearQueue() {
  _queue$.set([]);
}
