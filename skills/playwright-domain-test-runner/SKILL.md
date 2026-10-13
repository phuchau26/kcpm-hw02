---
name: playwright-domain-test-runner
description: Implement or review reproducible Playwright automation for approved domain test cases, including isolated fixtures, service orchestration, evidence, machine-readable results, and execution summaries. Use when running browser/API domain tests; do not change SUT source or expected results to make tests pass.
---

# Playwright Domain Test Runner

Automate approved domain test cases without weakening their oracle. Produce enough evidence for another reviewer to reproduce and audit each result.

## Establish the execution contract

Before writing code:

1. Read the reviewed specification, domain/BVA artifacts, test cases, environment notes, and relevant source in read-only mode.
2. Identify repository boundaries and the permitted automation/evidence directories.
3. Record service commands, URLs, ports, credentials, database technology, platform, and prerequisite state from real project sources.
4. Map every approved test ID to an automation path or a concrete blocked condition.

Read [references/execution-contract.md](references/execution-contract.md) before defining result records, evidence paths, or service lifecycle behavior.

## Automation design

- Keep automation outside the SUT source unless the project explicitly places tests there.
- Pin dependencies and provide one documented command for a clean run.
- Prefer deterministic locators (`getByRole`, label, test ID) over fragile layout selectors.
- Isolate test data with a disposable fixture, transaction, API setup, or validated database copy. Never overwrite the user's real database.
- Make stateful ordering explicit. Run sequentially only when the approved scenario or shared state requires it.
- Treat secrets and personal data as external configuration; do not record them in evidence.
- Avoid fixed sleeps when an observable readiness condition exists.

## Service lifecycle

- Detect whether required services already occupy configured ports before starting new processes.
- Start only services needed by the approved scope and capture their logs.
- Wait for an actual health/readiness signal with a bounded timeout.
- Track only processes started by the runner and stop those processes in cleanup, including after failure.
- Do not kill unrelated processes or mutate the instructor-provided source.

## Verdict rules

- `PASS`: observed behavior satisfies the unchanged expected result.
- `FAIL`: the SUT ran far enough to compare actual and expected behavior, and they differ.
- `BLOCKED`: an external condition, absent capability, inaccessible state, or prerequisite prevents a valid comparison.
- `NOT RUN`: the case was intentionally not attempted; state the reason.

Never convert FAIL to BLOCKED merely to improve statistics. Never change the expected result to match the SUT. A shared blocked condition may affect many cases, but every case still needs its own result record.

## Evidence and results

- Use stable test IDs in result records and filenames.
- Capture screenshots at the decisive state; avoid redundant images.
- Retain a Playwright trace for failures and diagnostically useful blocked cases, or one full-run trace if that is the established convention.
- Store service logs and errors without secrets.
- Write results atomically where practical so an interrupted run is not mistaken for a complete run.
- Record real timestamps only when obtained during execution; do not invent them later.
- Keep runtime databases, `node_modules`, caches, videos, temporary builds, and unrelated logs out of submission evidence and Git.

## Verification and handoff

After the run:

1. Check that every designed test ID appears exactly once and totals reconcile.
2. Confirm each PASS/FAIL/BLOCKED result is supported by actual output and appropriate evidence.
3. Verify evidence paths exist and traces can be opened.
4. Compare actual results with the approved expected results without rewriting either side.
5. Create or update the execution summary with environment, commands, statistics, blocked conditions, and rerun instructions.
6. Leave new artifacts `PENDING HUMAN REVIEW` unless the user explicitly performs or delegates review.
7. Apply project prompt-log/AI-disclosure rules, and do not commit unless requested.

Report files created, commands and checks actually run, totals, failed/blocked cases, evidence locations, SUT changes (normally none), and remaining review decisions.
