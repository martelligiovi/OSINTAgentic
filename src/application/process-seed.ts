import type { ActionCatalogPort, QueuePort } from './ports.js';
import type {
  ActionProposal,
  ProcessError,
  ProcessSeedCommand,
  QueueItem,
  Result,
} from '../domain/contracts.js';

export const processSeed = (
  command: ProcessSeedCommand,
  catalog: ActionCatalogPort,
  queue: QueuePort,
): Result<QueueItem, ProcessError> => {
  if (command.seed.rawValue.length === 0) {
    return { ok: false, error: { code: 'EMPTY_RAW_SEED' } };
  }

  const selection = catalog.select(command.seed, command.requestedActionName);
  if (!selection.ok) {
    return selection;
  }

  selection.value.invoke(command.seed);
  const proposal: ActionProposal = {
    id: command.proposalId,
    seedId: command.seed.id,
    actionName: selection.value.name,
  };
  const item: QueueItem = {
    id: command.queueItemId,
    investigationId: command.investigationId,
    seed: { ...command.seed },
    proposal,
    provenanceIds: [...command.provenanceIds],
  };
  const enqueueResult = queue.enqueueAtomic(item);

  if (!enqueueResult.ok) {
    return enqueueResult;
  }

  return { ok: true, value: item };
};
