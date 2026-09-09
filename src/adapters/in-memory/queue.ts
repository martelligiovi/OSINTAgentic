import type { QueuePort } from '../../application/ports.js';
import type { QueueItem, Result } from '../../domain/contracts.js';

const copyQueueItem = (item: QueueItem): QueueItem => ({
  ...item,
  seed: { ...item.seed },
  proposal: { ...item.proposal },
  provenanceIds: [...item.provenanceIds],
});

export class InMemoryQueue implements QueuePort {
  private readonly items: QueueItem[] = [];

  public constructor(private readonly failWrites = false) {}

  public enqueueAtomic(item: QueueItem): Result<void, { code: 'QUEUE_WRITE_FAILED' }> {
    if (this.failWrites) {
      return { ok: false, error: { code: 'QUEUE_WRITE_FAILED' } };
    }

    this.items.push(copyQueueItem(item));
    return { ok: true, value: undefined };
  }

  public snapshot(): readonly QueueItem[] {
    return this.items.map(copyQueueItem);
  }
}
