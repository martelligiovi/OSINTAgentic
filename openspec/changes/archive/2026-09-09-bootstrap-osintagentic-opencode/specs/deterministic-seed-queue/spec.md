# Deterministic Seed Queue Specification

## Purpose

Define a provider-free flow that accepts an eligible seed, selects an authorized placeholder action, and atomically queues a proposal while preserving seed values and provenance.

## Requirements

### Requirement: Explicit Seed Representation

The system MUST reject an empty raw seed value. For accepted input, it MUST preserve the supplied raw value and a separately supplied normalized value exactly as provided, and MUST NOT infer or prescribe a normalization policy.

#### Scenario: Preserve distinct seed values

- GIVEN a non-empty eligible seed with raw value ` Example ` and normalized value `Example`
- WHEN the seed enters the queue flow
- THEN both values are retained unchanged as distinct fields

#### Scenario: Reject empty input

- GIVEN an empty raw seed value and an unchanged queue
- WHEN the seed enters the queue flow
- THEN processing fails and the queue remains unchanged

### Requirement: Deterministic Proposal Queueing

For every eligible synthetic or explicitly consenting seed, the system MUST obtain the allow-listed `generic` action and enqueue exactly one corresponding proposal.

#### Scenario: Queue the generic proposal

- GIVEN an eligible seed and a catalog that allows `generic`
- WHEN the seed is processed
- THEN exactly one proposal for `generic` is added to the queue

#### Scenario: Repeat equivalent processing

- GIVEN two fresh equivalent queues and identical investigation, seed, origin, and catalog inputs
- WHEN each input is processed once
- THEN the resulting queue items are equivalent and contain no nondeterministic variation

### Requirement: Provenance-Preserving Queue Item

Each queued item MUST retain the investigation identifier, seed identifier and values, action proposal identifier and action name, and every supplied origin or provenance identifier without loss or substitution.

#### Scenario: Preserve complete lineage

- GIVEN identified investigation, seed, proposal, and multiple origin identifiers
- WHEN the proposal is queued
- THEN one queue item contains every supplied identifier and the original seed values

#### Scenario: Keep provenance distinct

- GIVEN two otherwise equal seeds with different origin identifiers
- WHEN each seed is processed in a fresh queue
- THEN each queue item retains only its corresponding origin identifiers

### Requirement: Atomic Authorization Failure

The system MUST propagate failure when the catalog rejects an unknown or disallowed action request, MUST NOT enqueue a substitute, and MUST leave the queue unchanged.

#### Scenario: Reject unknown action

- GIVEN an unchanged queue and an unknown action request
- WHEN processing requests catalog selection
- THEN processing fails and no queue item is added

#### Scenario: Reject disallowed action

- GIVEN an unchanged queue and an action request not present in the allow-list
- WHEN processing requests catalog selection
- THEN processing fails and the queue remains unchanged

### Requirement: Provider-Free Processing

Processing the `generic` proposal MUST NOT call external systems, inspect live sources, or introduce behavior specialized for email, phone, username, domain, IP, or any other seed category.

#### Scenario: Process a seed-shaped value safely

- GIVEN an eligible seed whose text resembles a recognized identifier category
- WHEN the `generic` flow processes it
- THEN the proposal remains generic and no category-specific behavior occurs

#### Scenario: Complete without external effects

- GIVEN an eligible seed and the allowed `generic` action
- WHEN processing completes
- THEN the only observable state change is the single local queue addition
