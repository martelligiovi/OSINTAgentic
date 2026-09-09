# Exploration: bootstrap-osintagentic-opencode

## Current State

The authoritative repository remains a minimal Git bootstrap on `main`. Its
implemented surface is `README.md`, `LICENSE`, `.gitignore`, SDD/OpenSpec
configuration, and empty OpenSpec specification directories. `README.md`
contains only the project title. CodeGraph is initialized, but the bounded
query found no application symbols; there are no application entry points,
project manifests, dependencies, tests, or workspace test command to extend.

The prior blocked change, `openspec/changes/bootstrap-osintagentic/`, is
preserved unchanged and is used only as contextual input. Its exploration
identified a provider-free, domain-first bootstrap as the smallest coherent
starting point for the planned OSINT product. This phase did not inspect the
external Obsidian vault, and no external documentation or research result is
claimed here.

### Formal research status

Formal `sdd-research` is **unselected** for this change. This exploration is
based on the repository state, the prior exploration artifact, and explicit
user decisions only. Any later manual documentation consultation may inform a
user-confirmed decision, but must not be represented as a formal research
result.

## Affected Areas

- `openspec/config.yaml` — confirms that no application stack, project root,
  or test command is currently established.
- `openspec/changes/bootstrap-osintagentic/exploration.md` — prior blocked
  exploration reused as context only; it must remain byte-for-byte unchanged.
- `openspec/changes/bootstrap-osintagentic-opencode/exploration.md` — the only
  artifact created by this phase.
- `README.md` — remains a title-only placeholder and is not modified.
- `openspec/specs/` — contains no domain specifications beyond `.gitkeep`.

## Approaches

1. **Domain-first deterministic bootstrap** — establish the smallest supported
   workspace and domain/application boundary with in-memory ports and synthetic
   or consenting fixtures. The first slice would preserve a generic seed,
   propose only catalog-defined actions, and retain seed-or-finding provenance
   on queued proposals.
   - Pros: validates product invariants before infrastructure or provider
     commitments; keeps the core independent of UI, databases, agents, and
     connectors; fits the 400-line review budget.
   - Cons: requires confirmation of the TypeScript/pnpm baseline and selection
     of a test runner; does not provide live OSINT retrieval or a web UI.
   - Effort: Medium

2. **Infrastructure-first application scaffold** — establish the planned
   multi-service/web stack and expose an end-to-end route before stabilizing
   domain behavior.
   - Pros: makes deployment seams visible early and exercises integration
     boundaries sooner.
   - Cons: commits to unconfirmed technologies and persistence choices; risks
     a behavior-light scaffold, privacy mistakes, and exceeding the review
     budget.
   - Effort: High

## Recommendation

Continue with the **domain-first deterministic bootstrap**. It is the only
approach that adds executable product value while the repository has no
established technology or testing baseline. Keep the first change provider-free
and limited to:

- establishing the smallest supported workspace and test command;
- defining domain/application contracts for an investigation, seed, catalog
  action, action proposal, branch/origin, and queue item;
- preserving raw seed input while allowing normalization at the boundary;
- creating proposals only from an injected allow-listed catalog; and
- retaining provenance when proposals enter the queue, proven with deterministic
  in-memory adapters and synthetic or consenting data.

Defer the web UI/API, agent orchestration, PostgreSQL, Neo4j, Playwright, live
connectors, authentication, files and images, facial recognition, ambiguity
scoring, confidence formulas, queue priority/concurrency, reports, metrics,
and participant evaluation. These deferrals prevent the bootstrap from making
unreviewed product, vendor, or privacy commitments.

### Privacy and safety constraints

- Bootstrap fixtures MUST be synthetic or explicitly consenting data only.
- Live sources, scraping, sensitive identifiers, images, facial recognition,
  and identity-resolution behavior are out of scope until consent, source
  terms, retention/deletion, credential handling, and data access decisions are
  explicit.
- A workflow/checkpoint mechanism MUST NOT be treated as the business record;
  catalog, queue, audit, evidence, and domain rules remain separate concerns.
- Concrete source selection, ambiguity criteria, confidence semantics, queue
  policy, and retry behavior MUST remain deferred rather than inferred.

### Decisions requiring user confirmation before proposal

1. Adopt the planned TypeScript/pnpm baseline and hexagonal layout now, rather
   than first producing a technology-neutral specification.
2. Confirm the provider-free first slice:
   `generic seed -> catalog-defined mock action -> provenance-preserving queue item`.
3. Select the test runner and minimum quality tools to establish with the
   baseline; none currently exist.
4. Confirm synthetic/consenting fixtures only for bootstrap work, with live and
   sensitive inputs deferred.
5. Confirm that deferred infrastructure and product decisions become separate
   later SDD changes instead of being bundled into this bootstrap.

## Risks

- Treating the prior exploration or uninspected external documentation as
  verified implementation or formal research would create false evidence.
- Choosing a concrete source, ambiguity algorithm, queue policy, or sensitive
  input type now would create unreviewed product and privacy commitments.
- An infrastructure-first scaffold can exceed the 400-line review budget and
  make rollback difficult before domain behavior is validated.
- Even a small domain slice can encode accidental semantics if seed shape,
  provenance, branch state, or action authorization are not explicitly agreed.
- The current repository has no test tooling, so proposal readiness cannot
  imply existing quality verification.

## Ready for Proposal

No. The repository is sufficiently understood, and formal research is
explicitly unselected. Proposal readiness depends only on explicit user
confirmation of the five decisions above, especially the TypeScript/pnpm
baseline, test tooling, and provider-free first slice. After confirmation,
continue with `sdd-propose` for `bootstrap-osintagentic-opencode`; do not create
`research.md`, copy `state.yaml`, modify the blocked change, or change
application code or `README.md` in this phase.
