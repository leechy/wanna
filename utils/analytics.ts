import { socketService } from '@/services/socketService';

/**
 * Records an app-side product event on the server ("client.<type>").
 * Best effort: dropped when offline.
 *
 * @param {string} type  event type, lowercase with dots and underscores
 * @param {object} context  list and shopping session the event is about
 * @param {object} props  small event details
 */
export function trackEvent(
  type: string,
  context: { listId?: string; sessionId?: string } = {},
  props?: Record<string, unknown>
) {
  socketService.sendNow('analytics:track', { type, ...context, props });
}
