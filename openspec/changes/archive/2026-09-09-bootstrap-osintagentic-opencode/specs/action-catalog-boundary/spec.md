# Action Catalog Boundary Specification

## Purpose

Define deterministic, allow-listed action selection for the bootstrap flow without committing to providers, live sources, or seed-specific OSINT behavior.

## Requirements

### Requirement: Allow-Listed Catalog Selection

Action selection MUST occur through a supplied catalog boundary. The catalog MUST return only actions present in its allow-list and MUST reject unknown or disallowed action requests.

#### Scenario: Select an allowed action

- GIVEN a catalog whose allow-list contains `generic`
- WHEN selection is requested for an eligible seed
- THEN the catalog returns the allowed `generic` action

#### Scenario: Reject an unlisted request

- GIVEN a requested action absent from the catalog allow-list
- WHEN selection is attempted
- THEN selection fails without returning an action proposal

### Requirement: Generic-Only Bootstrap Resolution

For every non-empty synthetic or explicitly consenting test seed, the catalog MUST resolve only to the placeholder action named `generic`. It MUST NOT map seed kinds or values to any other action.

#### Scenario: Resolve different seeds identically

- GIVEN two eligible seeds with different values or declared kinds
- WHEN each seed is resolved against the bootstrap catalog
- THEN each resolution selects only `generic`

#### Scenario: Avoid semantic specialization

- GIVEN an eligible seed whose value resembles an email, phone, username, domain, or IP address
- WHEN action selection occurs
- THEN the selected action remains `generic`

### Requirement: Deterministic Catalog Outcome

Given equivalent catalog state and equivalent selection input, the catalog MUST produce the same success or failure outcome and MUST NOT depend on external providers, live sources, or nondeterministic data.

#### Scenario: Repeat successful selection

- GIVEN equivalent catalog state and the same eligible seed input
- WHEN selection is repeated
- THEN every result identifies the same `generic` action

#### Scenario: Repeat rejected selection

- GIVEN equivalent catalog state and the same unknown or disallowed request
- WHEN selection is repeated
- THEN every attempt returns the same failure outcome

### Requirement: Side-Effect-Free Generic Action

The `generic` action MUST perform no external calls and MUST define no behavior specific to email, phone, username, domain, IP, or any other seed category. It MUST NOT select live sources, collect personal data, or perform identity resolution.

#### Scenario: Invoke generic without external effects

- GIVEN the `generic` action and an eligible seed
- WHEN the action is invoked
- THEN no external system or live source is contacted

#### Scenario: Invoke generic with category-shaped input

- GIVEN the `generic` action and a seed value resembling a known identifier category
- WHEN the action is invoked
- THEN no category-specific result or behavior is produced

### Requirement: Catalog Failure Is Non-Mutating

A failed catalog selection MUST NOT yield a partial proposal or authorize downstream queue mutation.

#### Scenario: Unknown action cannot reach the queue

- GIVEN an unknown action request and an unchanged queue
- WHEN catalog selection fails
- THEN no proposal is produced and the queue remains unchanged

#### Scenario: Disallowed action cannot reach the queue

- GIVEN a known but disallowed action request and an unchanged queue
- WHEN catalog selection fails
- THEN no proposal is produced and the queue remains unchanged
