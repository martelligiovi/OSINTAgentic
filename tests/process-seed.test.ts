import { describe, expect, it } from 'vitest';
import { InMemoryActionCatalog, InMemoryQueue, processSeed } from '../src/index.js';
import type { ProcessSeedCommand, Seed } from '../src/index.js';

const seed = (overrides: Partial<Seed> = {}): Seed => ({
  id: 'seed-1',
  kind: 'generic',
  rawValue: 'synthetic value',
  normalizedValue: 'synthetic value',
  dataBasis: 'synthetic',
  ...overrides,
});

const command = (overrides: Partial<ProcessSeedCommand> = {}): ProcessSeedCommand => ({
  investigationId: 'investigation-1',
  seed: seed(),
  requestedActionName: 'generic',
  proposalId: 'proposal-1',
  queueItemId: 'queue-item-1',
  provenanceIds: ['origin-1', 'origin-2'],
  ...overrides,
});

describe('processSeed', () => {
  it('preserves distinct raw and normalized seed values', () => {
    const queue = new InMemoryQueue();
    const input = seed({ rawValue: ' Example ', normalizedValue: 'Example' });

    const result = processSeed(command({ seed: input }), new InMemoryActionCatalog(), queue);

    expect(result).toMatchObject({
      ok: true,
      value: { seed: { rawValue: ' Example ', normalizedValue: 'Example' } },
    });
    expect(queue.snapshot()[0]?.seed).toEqual(input);
  });

  it('rejects only zero-length raw values without queue mutation', () => {
    const queue = new InMemoryQueue();
    const result = processSeed(
      command({ seed: seed({ rawValue: '', normalizedValue: 'preserved' }) }),
      new InMemoryActionCatalog(),
      queue,
    );

    expect(result).toEqual({ ok: false, error: { code: 'EMPTY_RAW_SEED' } });
    expect(queue.snapshot()).toEqual([]);
  });

  it('queues exactly one generic proposal for an eligible seed', () => {
    const queue = new InMemoryQueue();
    const result = processSeed(command(), new InMemoryActionCatalog(), queue);

    expect(result).toMatchObject({ ok: true, value: { proposal: { actionName: 'generic' } } });
    expect(queue.snapshot()).toHaveLength(1);
  });

  it('produces equivalent snapshots for equivalent fresh inputs', () => {
    const first = new InMemoryQueue();
    const second = new InMemoryQueue();
    const input = command();

    processSeed(input, new InMemoryActionCatalog(), first);
    processSeed(input, new InMemoryActionCatalog(), second);

    expect(first.snapshot()).toEqual(second.snapshot());
  });

  it('preserves complete investigation, seed, proposal, and provenance lineage', () => {
    const queue = new InMemoryQueue();
    const input = command({
      investigationId: 'investigation-42',
      seed: seed({ id: 'seed-42', rawValue: ' Raw ', normalizedValue: 'Raw' }),
      proposalId: 'proposal-42',
      queueItemId: 'queue-item-42',
      provenanceIds: ['origin-a', 'origin-b'],
    });

    processSeed(input, new InMemoryActionCatalog(), queue);

    expect(queue.snapshot()).toEqual([
      {
        id: 'queue-item-42',
        investigationId: 'investigation-42',
        seed: input.seed,
        proposal: { id: 'proposal-42', seedId: 'seed-42', actionName: 'generic' },
        provenanceIds: ['origin-a', 'origin-b'],
      },
    ]);
  });

  it('keeps provenance distinct for otherwise equal seeds', () => {
    const first = new InMemoryQueue();
    const second = new InMemoryQueue();

    processSeed(command({ provenanceIds: ['origin-a'] }), new InMemoryActionCatalog(), first);
    processSeed(command({ provenanceIds: ['origin-b'] }), new InMemoryActionCatalog(), second);

    expect(first.snapshot()[0]?.provenanceIds).toEqual(['origin-a']);
    expect(second.snapshot()[0]?.provenanceIds).toEqual(['origin-b']);
  });

  it.each([
    ['unknown', new InMemoryActionCatalog(), 'UNKNOWN_ACTION'],
    ['generic', new InMemoryActionCatalog([]), 'ACTION_DISALLOWED'],
  ] as const)(
    'propagates %s authorization failure without a substitute',
    (requestedActionName, catalog, code) => {
      const queue = new InMemoryQueue();
      const result = processSeed(command({ requestedActionName }), catalog, queue);

      expect(result).toEqual({ ok: false, error: { code } });
      expect(queue.snapshot()).toEqual([]);
    },
  );

  it.each(['user@example.test', '+1-555-0100', 'safe-user', 'example.test', '192.0.2.1'])(
    'processes category-shaped value %s as generic only',
    (rawValue) => {
      const queue = new InMemoryQueue();
      const result = processSeed(
        command({ seed: seed({ rawValue }) }),
        new InMemoryActionCatalog(),
        queue,
      );

      expect(result).toMatchObject({ ok: true, value: { proposal: { actionName: 'generic' } } });
      expect(queue.snapshot()).toHaveLength(1);
    },
  );

  it('adds exactly one local queue item and no other observable state', () => {
    const queue = new InMemoryQueue();

    processSeed(command(), new InMemoryActionCatalog(), queue);

    expect(queue.snapshot()).toHaveLength(1);
  });

  it('keeps the queue unchanged when its atomic write fails', () => {
    const queue = new InMemoryQueue(true);
    const result = processSeed(command(), new InMemoryActionCatalog(), queue);

    expect(result).toEqual({ ok: false, error: { code: 'QUEUE_WRITE_FAILED' } });
    expect(queue.snapshot()).toEqual([]);
  });

  it('returns copied snapshots that cannot mutate queue state', () => {
    const queue = new InMemoryQueue();
    processSeed(command(), new InMemoryActionCatalog(), queue);
    const snapshot = queue.snapshot();

    (snapshot[0]?.provenanceIds as string[]).push('outside-change');

    expect(queue.snapshot()[0]?.provenanceIds).toEqual(['origin-1', 'origin-2']);
  });
});
