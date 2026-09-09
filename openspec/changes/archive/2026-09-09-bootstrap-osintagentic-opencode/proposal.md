# Proposal: Bootstrap OSINTAgentic with a Deterministic OpenCode Core

## Intent

Create the smallest executable OSINTAgentic baseline: a strict TypeScript/pnpm
workspace whose domain flow proves seed handling, catalog authorization, and
provenance-preserving queueing without committing to live providers or product
infrastructure.

## Scope

### In Scope
- Establish a minimal TypeScript + pnpm workspace with strict typechecking,
  Vitest, ESLint, and Prettier.
- Define hexagonal domain/application contracts for investigations, seeds,
  catalog actions, proposals, origins, and queue items.
- Implement deterministic in-memory adapters for `generic seed -> injected
  catalog action -> provenance-preserving queue item`.
- Expose a placeholder catalog action named `generic` for every deterministic
  test seed; it proves the flow only and performs no concrete OSINT behavior.
- Use synthetic or explicitly consenting fixtures exclusively.

### Out of Scope
- Concrete per-seed tools or behavior, including email-specific actions.
- UI, API, LangGraph, databases, live connectors, authentication, facial
  recognition, reports, metrics, source selection, retries, or queue policy.
- Live OSINT sources, real personal data, scraping, images, or identity
  resolution.

## Capabilities

### New Capabilities
- `deterministic-seed-queue`: Process a generic seed through an injected action
  catalog and enqueue a proposal while retaining origin/provenance.
- `action-catalog-boundary`: Allow-list action selection behind a port; this
  change MUST NOT define concrete per-seed tool behavior. The `generic` action
  is the only bootstrap placeholder.

### Modified Capabilities
- None.

## Approach

Build domain-first contracts independent of frameworks, connect them through
application services, and use in-memory adapters plus deterministic tests to
prove invariants. Keep mapping from seed kinds to actions behind the catalog
port so future changes can add explicitly specified actions without changing
the core domain.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `package.json`, `pnpm-workspace.yaml`, `tsconfig.json` (planned) | New | Workspace and strict quality commands. |
| `src/domain/`, `src/application/` (planned) | New | Domain model, ports, and deterministic flow. |
| `src/adapters/in-memory/` (planned) | New | Test-safe catalog and queue adapters. |
| `tests/` and tool configs (planned) | New | Synthetic fixtures and quality checks. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Placeholder semantics become accidental product commitments | Med | Normative specs forbid per-seed behavior and live providers. |
| Domain contracts encode ambiguous future policy | Med | Defer source, confidence, retry, and queue decisions explicitly. |

## Rollback Plan

Remove the planned workspace, source, test, and tool-configuration files from
this change; leave the prior blocked change and existing repository artifacts
unchanged.

## Dependencies

- Confirmed decisions and `exploration.md`; no formal research evidence.
- pnpm and a supported Node.js runtime available to execute the quality commands.

## Success Criteria

- [ ] `pnpm install`, strict typecheck, lint, format check, and Vitest pass.
- [ ] Deterministic tests demonstrate generic seed input, injected `generic`
      catalog action, and queue output retaining origin/provenance.
- [ ] No implementation or test uses live sources, real personal data, or
      concrete per-seed tool behavior.
