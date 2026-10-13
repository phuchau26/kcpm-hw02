# Domain Testing artifact contract

Use project-specific names if they already exist. Otherwise, a feature may use this logical set:

| Step | Artifact | Minimum content |
|---|---|---|
| 1 | `01_spec_and_oracle.md` | scope, sources, requirements, oracle, assumptions/gaps, review state |
| 2 | `02_domain_model.md` | variables, types, units, constraints, dependencies, source links |
| 3 | `03_boundary_value_analysis.md` | partitions, boundaries, selected values, rationale, coverage |
| 4 | `04_test_cases.md` | IDs, trace links, preconditions, data, steps, expected results |
| 5 | `05_execution_results.md` plus machine-readable results/evidence | actual results, status, timestamps if real, evidence paths, environment |
| 6 | bug report and gap analysis | root-cause grouping, classification, impact, source/evidence links |
| 7 | traceability matrix and closure | end-to-end links, statistics, residual risk, rerun conditions, sign-off |

## Traceability requirements

Every designed test must be traceable through the artifacts that apply to it:

```text
requirement/oracle -> partition -> boundary (when applicable) -> test case
-> execution status -> defect/gap (when applicable) -> evidence
```

Use `N/A` with a reason when a link genuinely does not apply. Do not leave ambiguous empty cells.

## Status consistency checks

- Designed = PASS + FAIL + BLOCKED + NOT RUN when each designed case has exactly one final execution status.
- Executed normally means PASS + FAIL; document a different convention explicitly.
- A blocked case is not a confirmed defect without evidence that the SUT violated an applicable oracle.
- Multiple failed cases may map to one defect when they share one root cause.
- Closure must list every unverified behavior and the condition needed to test it later.
