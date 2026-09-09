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
  provenanceIds: ['origin-1'],
  ...overrides,
});

describe('InMemoryActionCatalog', () => {
  it('selects the allow-listed generic action', () => {
    const result = new InMemoryActionCatalog().select(seed(), 'generic');

    expect(result).toMatchObject({ ok: true, value: { name: 'generic' } });
  });

  it('rejects an unlisted action request', () => {
    const result = new InMemoryActionCatalog().select(seed(), 'unregistered');

    expect(result).toEqual({ ok: false, error: { code: 'UNKNOWN_ACTION' } });
  });

  it.each([
    ['email', 'synthetic@example.test'],
    ['phone', '+1-555-0100'],
    ['username', 'synthetic-user'],
  ])('resolves %s-shaped seeds only as generic', (kind, rawValue) => {
    const result = new InMemoryActionCatalog().select(seed({ kind, rawValue }), 'generic');

    expect(result).toMatchObject({ ok: true, value: { name: 'generic' } });
  });

  it.each(['user@example.test', '+1-555-0100', 'example.test', '192.0.2.1'])(
    'keeps category-shaped value %s generic',
    (rawValue) => {
      const result = new InMemoryActionCatalog().select(seed({ rawValue }), 'generic');

      expect(result).toMatchObject({ ok: true, value: { name: 'generic' } });
    },
  );

  it('repeats successful selection deterministically', () => {
    const catalog = new InMemoryActionCatalog();

    expect(catalog.select(seed(), 'generic')).toEqual(catalog.select(seed(), 'generic'));
  });

  it('repeats rejected selection deterministically', () => {
    const catalog = new InMemoryActionCatalog();

    expect(catalog.select(seed(), 'unknown')).toEqual(catalog.select(seed(), 'unknown'));
  });

  it('invokes generic as a side-effect-free no-op', () => {
    const result = new InMemoryActionCatalog().select(seed(), 'generic');

    if (!result.ok) {
      throw new Error('expected generic action');
    }

    expect(result.value.invoke(seed())).toBeUndefined();
  });

  it('does not create a proposal or mutate the queue for unknown requests', () => {
    const queue = new InMemoryQueue();
    const result = processSeed(
      command({ requestedActionName: 'unknown' }),
      new InMemoryActionCatalog(),
      queue,
    );

    expect(result).toEqual({ ok: false, error: { code: 'UNKNOWN_ACTION' } });
    expect(queue.snapshot()).toEqual([]);
  });

  it('does not create a proposal or mutate the queue for disallowed requests', () => {
    const queue = new InMemoryQueue();
    const result = processSeed(command(), new InMemoryActionCatalog([]), queue);

    expect(result).toEqual({ ok: false, error: { code: 'ACTION_DISALLOWED' } });
    expect(queue.snapshot()).toEqual([]);
  });
});
