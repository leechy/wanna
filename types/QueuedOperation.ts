export interface QueuedOperation {
  id: string;
  timestamp: number;
  event: string;
  data: any;
}
