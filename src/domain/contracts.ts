export type DataBasis = 'synthetic' | 'consenting';

export type Seed = Readonly<{
  id: string;
  kind: string;
  rawValue: string;
  normalizedValue: string;
  dataBasis: DataBasis;
}>;

export type ActionName = 'generic';

export type Action = Readonly<{
  name: ActionName;
  invoke: (seed: Seed) => void;
}>;

export type ActionProposal = Readonly<{
  id: string;
  seedId: string;
  actionName: ActionName;
}>;

export type QueueItem = Readonly<{
  id: string;
  investigationId: string;
  seed: Seed;
  proposal: ActionProposal;
  provenanceIds: readonly string[];
}>;

export type Result<T, E> = Readonly<{ ok: true; value: T }> | Readonly<{ ok: false; error: E }>;

export type CatalogErrorCode = 'UNKNOWN_ACTION' | 'ACTION_DISALLOWED';
export type ProcessErrorCode = CatalogErrorCode | 'EMPTY_RAW_SEED' | 'QUEUE_WRITE_FAILED';

export type CatalogError = Readonly<{
  code: CatalogErrorCode;
}>;

export type ProcessError = Readonly<{
  code: ProcessErrorCode;
}>;

export type ProcessSeedCommand = Readonly<{
  investigationId: string;
  seed: Seed;
  requestedActionName: string;
  proposalId: string;
  queueItemId: string;
  provenanceIds: readonly string[];
}>;
