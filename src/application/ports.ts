import type { Action, CatalogError, QueueItem, Result, Seed } from '../domain/contracts.js';

export interface ActionCatalogPort {
  select(seed: Seed, requestedName: string): Result<Action, CatalogError>;
}

export interface QueuePort {
  enqueueAtomic(item: QueueItem): Result<void, { code: 'QUEUE_WRITE_FAILED' }>;
}
