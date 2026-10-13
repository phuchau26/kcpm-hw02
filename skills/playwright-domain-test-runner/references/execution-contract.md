# Playwright execution contract

## Minimum result record

Each designed test case should have one record containing at least:

- test ID and title;
- requirement/partition/boundary links when available;
- final status: `PASS`, `FAIL`, `BLOCKED`, or `NOT RUN`;
- expected result copied or referenced from the approved test case;
- actual result or blocking reason;
- evidence paths;
- error/diagnostic detail when applicable;
- duration and timestamp only if captured by the runner.

Store run-level metadata separately: environment, base URLs, revision/baseline, start/end time, totals, and runner version/command.

## Reconciliation invariants

```text
designed = pass + fail + blocked + not_run
attempted = pass + fail + blocked
executed = pass + fail
```

If the assignment defines `attempted` or `executed` differently, document that convention explicitly rather than silently changing the formula.

## Suggested evidence layout

```text
evidence/<pool-or-feature>/execution/
|-- results.json
|-- service-logs.txt
|-- screenshots/
|   `-- <TEST-ID>.png
`-- traces/
    `-- <TEST-ID-or-run>.zip
```

Use paths relative to the submission root in Markdown and machine-readable results.

## Blocked conditions

A blocked record must name:

1. the missing condition or inaccessible state;
2. why the oracle cannot be evaluated reliably;
3. evidence supporting the block;
4. the change needed before rerun.

Do not file a SUT defect for a blocked case unless separate evidence establishes an actual requirement violation.

## Safe fixture properties

- created from a known baseline;
- isolated from user or production data;
- resettable and idempotent;
- schema-compatible with the tested revision;
- explicit about seeded identities and state;
- cleaned up without deleting files outside the automation workspace.
