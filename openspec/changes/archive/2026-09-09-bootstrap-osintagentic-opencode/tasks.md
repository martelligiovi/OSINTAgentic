# Tasks: Bootstrap OSINTAgentic with a Deterministic OpenCode Core

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 520–650 authored, plus generated lockfile |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | Foundation → catalog boundary → queue orchestration |
| Delivery strategy | exception-ok (`size:exception` accepted) |
| Chain strategy | not applicable |

Decision needed before apply: No
Chained PRs recommended: Yes (forecast only; maintainer accepted a single-PR size exception)
Chain strategy: not applicable
400-line budget risk: High

### Work Unit

| Unit | Goal | Delivery | Focused test command | Runtime harness | Rollback boundary |
|---|---|---|---|---|---|---|
| bootstrap-single-pr | Establish the toolchain, generic catalog, and atomic queue flow | Single PR, accepted `size:exception` | `pnpm vitest run tests/action-catalog.test.ts tests/process-seed.test.ts` | N/A — library-only package has no executable, API, or external runtime boundary | Remove the workspace/config files, lockfile, `src/`, and `tests/` added by this change; restore `.gitignore` |

No branch or PR action is authorized by this change. The accepted exception applies only to this single implementation work unit.

## Phase 1: Workspace and Contracts

- [x] 1.1 Create `package.json`, `pnpm-workspace.yaml`, and generated `pnpm-lock.yaml` with pinned TypeScript, Vitest, ESLint, and Prettier dependencies plus `typecheck`, `test`, `lint`, `format:check`, and workspace-wide `quality` scripts; run `pnpm install`.
- [x] 1.2 Create strict no-emit `tsconfig.json`, flat `eslint.config.js`, and `.prettierrc.json`; update `.gitignore` for `node_modules` and coverage while retaining `.atl/`.
- [x] 1.3 Define immutable seed, action, proposal, queue-item, deterministic result/error, identifiers, and provenance contracts in `src/domain/contracts.ts`; define catalog and atomic queue ports in `src/application/ports.ts`.

## Phase 2: Generic Catalog Boundary

- [x] 2.1 Implement `src/adapters/in-memory/action-catalog.ts` with registered-versus-allowed distinction, only the no-op `generic` action, and deterministic `UNKNOWN_ACTION`/`ACTION_DISALLOWED` results without seed-kind mappings or external effects.
- [x] 2.2 Create `tests/action-catalog.test.ts` with parameterized coverage for eight catalog-local scenarios: allowed/unlisted selection, differing and category-shaped seeds, repeated success/failure, and side-effect/category-neutral invocation.

## Phase 3: Atomic Queue Orchestration

- [x] 3.1 Implement `src/adapters/in-memory/queue.ts` with copied snapshots and all-or-nothing append, including deterministic non-mutating write failure.
- [x] 3.2 Implement `src/application/process-seed.ts`: reject only zero-length raw values, authorize before invoking/building, preserve caller values/IDs, enqueue once last, and propagate all four typed failures.
- [x] 3.3 Extend `tests/action-catalog.test.ts` with parameterized unknown/disallowed no-proposal and unchanged-queue cases, completing all 10 catalog scenarios.
- [x] 3.4 Create `tests/process-seed.test.ts` with parameterized coverage of all 10 queue scenarios: value preservation/empty rejection, exact-one/deterministic queueing, complete/distinct lineage, both authorization failures, category safety, and sole local mutation; also prove non-mutating queue-write failure.
- [x] 3.5 Export supported contracts, ports, adapters, and orchestration from `src/index.ts` without providers or seed-specific tools.

## Phase 4: Verification

- [x] 4.1 Run focused Vitest files and `pnpm run quality` from `package.json` (read-only); confirm all 20 normative scenarios use only synthetic/consenting fixtures and pass typecheck, lint, format, and tests.
