---
name: domain-testing-feature-workflow
description: Coordinate, resume, or audit a feature-level Domain Testing workflow from specification through closure. Use when deciding the next valid testing step, enforcing review gates, checking artifact completeness, or closing one feature; do not use as a substitute for executing specialized analysis or automation when a narrower skill applies.
---

# Domain Testing Feature Workflow

Guide one feature through a traceable seven-step workflow while preserving evidence and review boundaries.

## Start by establishing context

1. Identify the feature ID, assigned platform, repository boundary, project conventions, and required submission artifacts.
2. Inspect existing artifacts and their declared states. Do not infer that a numbered file is complete merely because it exists.
3. Read the assignment, plan, scope, environment notes, and relevant source documentation before deciding the next step.
4. Report the current stage, satisfied gates, missing inputs, and the single next useful action.

Read [references/artifact-contract.md](references/artifact-contract.md) when creating, reviewing, or closing workflow artifacts.

## Workflow and gates

Use this order unless the assignment explicitly defines another one:

1. Specification and test oracle.
2. Domain model.
3. Equivalence partitions and Boundary Value Analysis.
4. Test-case design and review.
5. Execution and evidence collection.
6. Defect reporting and gap analysis.
7. Traceability, report integration, residual risk, and feature closure.

Do not advance across an unsatisfied gate:

- Step 2 requires a reviewed specification/oracle.
- Step 3 requires a reviewed domain model.
- Step 4 requires reviewed partitions and boundaries.
- Step 5 requires reviewed executable test cases and a documented environment.
- Step 6 requires internally consistent execution results and evidence.
- Step 7 requires reviewed defects/gaps and complete trace links for all designed cases.

If the user explicitly accepts or delegates a review decision, record the form of review truthfully. Never label an AI-delegated review as independent human review.

## State semantics

Use project-defined states when present. Otherwise use:

- `DRAFT`: being authored and not ready for review.
- `PENDING HUMAN REVIEW`: complete enough to inspect, but not accepted.
- `REVIEWED`: checked against stated sources and accepted by the reviewer.
- `BLOCKED`: cannot proceed because a named prerequisite or external condition is absent.
- `CLOSED`: workflow artifacts are finalized; this does not mean the SUT passed.

Keep workflow completion distinct from product quality. A feature may be closed with failed or blocked tests if results, limitations, residual risk, and rerun conditions are documented honestly.

## Invariants

- Preserve expected results derived from approved requirements; never rewrite them to match current SUT behavior.
- Treat observed implementation as evidence, not automatically as the business oracle.
- Distinguish SUT defects, requirement gaps, implementation gaps, testability gaps, and environment limitations.
- Preserve user changes and repository boundaries. Do not modify instructor-provided source unless explicitly authorized.
- Keep identifiers stable and traceable. Do not silently renumber reviewed requirements, boundaries, or test cases.
- Do not claim execution, review, coverage, or rendering that was not actually performed.
- Apply any project AI-disclosure and prompt-log policy when artifacts are created or materially changed.
- Commit only when requested, using the repository's commit policy and excluding runtime/build artifacts.

## Completion report

At each handoff, state:

- current step and artifact status;
- checks performed and evidence used;
- coverage or counts that can be supported;
- blockers, residual risk, and rerun conditions;
- files created or changed;
- next action and whether a commit is appropriate.
