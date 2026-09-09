# Design: Bootstrap OSINTAgentic with a Deterministic OpenCode Core

## Technical Approach

Create one strict TypeScript package with domain contracts, an application orchestrator, and injected in-memory catalog/queue adapters. The flow implements both delta specs without framework, provider, persistence, or seed-category behavior and keeps the implementation compact enough for one review slice.

## Architecture Decisions

| Option | Tradeoff | Decision and rationale |
|---|---|---|
| Domain/application/adapters in one package | More files than a single module, but explicit dependency direction | Use hexagonal folders; this preserves replaceable boundaries without workspace-package ceremony. |
| Caller-supplied identifiers | Callers must provide IDs, but no generator policy is invented | Require investigation, seed, proposal, queue-item, and provenance IDs in the command; preserve them verbatim and never use randomness or timestamps. |
| Typed synchronous results | Slightly more types than exceptions | Return discriminated results so every failure is deterministic and directly testable. |
| One atomic queue operation after authorization | Queue adapters must guarantee all-or-nothing append | Construct nothing queueable before successful catalog selection, then append exactly one complete item. |
| Registered action plus allow-list | Distinguishes unknown from known-but-disallowed | Register only the side-effect-free `generic` action; no seed-kind mappings or other tools exist. |

## Data Flow

```text
ProcessSeed command -> validate rawValue -> catalog.select(seed, requestedName)
                                           | failure -> return error; queue unchanged
                                           v
                                  invoke generic (no-op)
                                           v
                         build proposal + complete queue item
                                           v
                                  queue.enqueueAtomic(item)
```

Validation precedes catalog access. Authorization precedes proposal construction and action invocation. Queue mutation is the final operation.

## File Changes

| File | Action | Responsibility |
|---|---|---|
| `package.json` | Create | Pin scripts and dev dependencies for typecheck, test, lint, and format checks. |
| `pnpm-workspace.yaml` | Create | Declare the repository root package as the minimal workspace. |
| `pnpm-lock.yaml` | Generate | Lock resolved tool versions reproducibly. |
| `tsconfig.json` | Create | Enable strict, no-emit TypeScript checking. |
| `eslint.config.js` | Create | Configure flat ESLint rules for TypeScript and tests. |
| `.prettierrc.json` | Create | Define deterministic formatting. |
| `.gitignore` | Modify | Ignore `node_modules` and coverage output while retaining `.atl/`. |
| `src/domain/contracts.ts` | Create | Define seed, action, proposal, queue-item, result, and error types. |
| `src/application/ports.ts` | Create | Define catalog and atomic queue ports. |
| `src/application/process-seed.ts` | Create | Validate, authorize, invoke, construct, and enqueue in fixed order. |
| `src/adapters/in-memory/action-catalog.ts` | Create | Provide registered/allow-listed `generic` selection and its no-op action. |
| `src/adapters/in-memory/queue.ts` | Create | Append complete items atomically and expose snapshots for tests. |
| `src/index.ts` | Create | Export the package's supported contracts and composition pieces. |
| `tests/action-catalog.test.ts` | Create | Verify catalog and generic-action scenarios. |
| `tests/process-seed.test.ts` | Create | Verify the complete flow with both in-memory adapters. |

## Interfaces / Contracts

```ts
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
interface Seed { id: string; kind: string; rawValue: string; normalizedValue: string; dataBasis: "synthetic" | "consenting"; }
interface Action { name: "generic"; invoke(seed: Seed): void; }
interface ActionProposal { id: string; seedId: string; actionName: "generic"; }
interface QueueItem { id: string; investigationId: string; seed: Seed; proposal: ActionProposal; provenanceIds: readonly string[]; }
interface ActionCatalogPort { select(seed: Seed, requestedName: string): Result<Action, CatalogError>; }
interface QueuePort { enqueueAtomic(item: QueueItem): Result<void, QueueError>; }
```

`processSeed` receives all identifiers, provenance IDs, seed, and requested action name. Empty means `rawValue.length === 0`; whitespace is preserved. Failures are `EMPTY_RAW_SEED`, `UNKNOWN_ACTION`, `ACTION_DISALLOWED`, or `QUEUE_WRITE_FAILED`. Failures return no proposal/item; queue write failure is also non-mutating. Arrays and values are copied without normalization, deduplication, substitution, time, or random input.

## Testing Strategy

| Layer | What to test | Approach |
|---|---|---|
| Unit | All 10 catalog scenarios | Parameterize seed shapes/kinds, repeated success, repeated unknown/disallowed failures, and no-op invocation; assert only `generic` and no collaborators/effects. |
| Integration-style | All 10 seed-queue scenarios | Compose the service with fresh in-memory adapters; parameterize preservation, category-shaped values, and catalog failures; compare deterministic snapshots, full/distinct lineage, exact one-item writes, and unchanged queues on every failure. |
| Quality | Strict compile, lint, formatting, deterministic Vitest | Run package scripts with synthetic/consenting fixtures only. |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration required. Deliver as one compact review slice; split only if the implementation forecast exceeds 400 changed lines.

## Open Questions

None.
