# Domain model and BVA output template

Adapt headings to the project rather than copying empty sections.

## Domain model table

| Variable ID | Input/state | Type/unit | Valid domain | Invalid classes | Dependencies | Oracle/source | Notes/gap |
|---|---|---|---|---|---|---|---|

## Equivalence partition table

| Partition ID | Variable(s) | Class | Definition | Representative value | Requirement/source |
|---|---|---|---|---|---|

Use `Class` values such as `VALID`, `INVALID`, or `UNRESOLVED`. An unresolved partition must identify what requirement is missing.

## Boundary table

| Boundary ID | Partition ID | Edge | Selected values | Expected classification | Rationale/source |
|---|---|---|---|---|---|

## Interaction constraints

Record cross-field, temporal, role, platform, and persistent-state constraints separately. State whether they require combination testing beyond single-variable BVA.

## Coverage and review

- List requirements with at least one partition/boundary.
- List rules for which BVA is not applicable and explain why.
- List unresolved requirements and their effect on later test design.
- Include artifact status and a concrete reviewer checklist.
