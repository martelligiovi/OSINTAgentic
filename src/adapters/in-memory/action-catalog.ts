import type { Action, CatalogError, Result, Seed } from '../../domain/contracts.js';
import type { ActionCatalogPort } from '../../application/ports.js';

const genericAction: Action = Object.freeze({
  name: 'generic' as const,
  invoke: (_seed: Seed): void => undefined,
});

export class InMemoryActionCatalog implements ActionCatalogPort {
  private readonly registeredActions = new Map<string, Action>([['generic', genericAction]]);
  private readonly allowedActionNames: ReadonlySet<string>;

  public constructor(allowedActionNames: readonly string[] = ['generic']) {
    this.allowedActionNames = new Set(allowedActionNames);
  }

  public select(seed: Seed, requestedName: string): Result<Action, CatalogError> {
    void seed;
    const action = this.registeredActions.get(requestedName);

    if (action === undefined) {
      return { ok: false, error: { code: 'UNKNOWN_ACTION' } };
    }

    if (!this.allowedActionNames.has(requestedName)) {
      return { ok: false, error: { code: 'ACTION_DISALLOWED' } };
    }

    return { ok: true, value: action };
  }
}
