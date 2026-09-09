# Apply Progress: Bootstrap OSINTAgentic with a Deterministic OpenCode Core

## Status

All 11 tasks are complete in Standard mode. Strict TDD is disabled by the current
OpenSpec configuration and cached testing capabilities.

## Delivery

The maintainer accepted `size:exception` for this single work unit. The prior
feature-branch chain metadata was reconciled to `exception-ok` and `not applicable`;
no branch or PR action was taken.

## Completed Tasks

- [x] 1.1 Establish the pnpm toolchain and generated lockfile.
- [x] 1.2 Configure strict TypeScript, ESLint, Prettier, and ignored output.
- [x] 1.3 Define domain contracts and application ports.
- [x] 2.1 Implement the registered and allow-listed generic catalog.
- [x] 2.2 Cover catalog-local behavior with parameterized tests.
- [x] 3.1 Implement the copying, atomic in-memory queue.
- [x] 3.2 Implement deterministic seed processing and typed failures.
- [x] 3.3 Cover authorization failures as non-mutating queue operations.
- [x] 3.4 Cover the queue flow and deterministic failure behavior.
- [x] 3.5 Export supported package composition pieces.
- [x] 4.1 Run focused tests and the complete quality command.

## Work Unit Evidence

| Evidence | Exact result |
|---|---|
| Focused test command | `pnpm vitest run tests/action-catalog.test.ts tests/process-seed.test.ts` exited 0: 2 test files passed and 30 tests passed. |
| Quality command | `pnpm run quality` exited 0: `tsc --noEmit`, `eslint .`, scoped Prettier check, and Vitest all passed; Vitest reported 2 files and 30 tests passed. |
| Runtime harness | N/A — this library-only bootstrap has no executable, API, or external runtime boundary. The focused tests compose the synchronous in-memory catalog and queue adapters, and assert the only observable mutation is one local queue item. |
| Rollback boundary | Remove this change's workspace/configuration files, `pnpm-lock.yaml`, `src/`, `tests/`, and this progress artifact; restore the two `.gitignore` output rules. This does not remove prior planning artifacts. |

## Normative Scenario Coverage

The two focused test files cover all 20 normative scenarios using only synthetic
fixtures, including consenting as an available data-basis contract value. Catalog
coverage proves allowed, unknown, disallowed, repeated, category-shaped, and no-op
behavior. Queue coverage proves exact raw/normalized preservation, zero-length
rejection, exact-one deterministic enqueueing, complete and distinct provenance,
authorization and queue-write failures, category neutrality, and sole local mutation.

## Installation Note

The first `pnpm install` could not run Vitest because pnpm 11 required an explicit
build-script decision for `esbuild`. `pnpm-workspace.yaml` now permits only
`esbuild`; the repeated `pnpm install` exited 0 and completed the `esbuild`
postinstall. No other build scripts were approved.

## Deviation from Design

None in behavior. The workspace adds pnpm 11's explicit `allowBuilds` entry for
Vitest's `esbuild` dependency, which is a reproducibility and execution requirement
of the selected package manager rather than a domain behavior change.
