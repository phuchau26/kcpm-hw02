---
name: domain-model-and-bva
description: Build or review a feature input-domain model, equivalence partitions, and Boundary Value Analysis from an approved specification and evidenced business rules. Use for domain variables, constraint interactions, boundary selection, and coverage checks; do not invent missing rules or design full executable test cases unless requested separately.
---

# Domain Model and BVA

Produce a reviewable bridge from approved requirements to test data. Preserve the distinction between documented rules, source-observed behavior, and unresolved gaps.

## Required inputs

- Reviewed feature scope and specification/test oracle.
- Business-rule sources cited by the specification.
- Relevant UI, API, validation, schema, or configuration source when the written rule is incomplete.
- Existing identifier and document conventions.

Stop and report the exact gap if a missing rule would materially change valid/invalid classification or an expected boundary. Continue with independent variables that remain well-founded.

## Build the domain model

For each input or relevant state variable, record:

- stable variable ID and name;
- business meaning, type, format, unit, and representation;
- valid domain and invalid classes;
- inclusivity/exclusivity of limits;
- required/optional/null/empty/whitespace behavior;
- dependencies on other fields, user state, time, database state, or platform;
- oracle and evidence source;
- uncertainty or requirement gap.

Model semantic constraints separately from storage types. For example, a database `TEXT` column does not prove that every string is valid business input.

## Derive equivalence partitions

Create disjoint, meaningful valid and invalid partitions where the oracle supports them. Include applicable categories such as:

- below range, in range, and above range;
- valid/invalid format;
- missing, `null`, empty, whitespace-only, or wrong type;
- existing/non-existing entity;
- active/expired/used state;
- matching/non-matching dependent fields;
- authorized/unauthorized platform or role.

Do not split partitions merely to inflate test counts. Mark inferred partitions and their source; unresolved behavior is a gap, not a fabricated rule.

## Apply Boundary Value Analysis

Choose the BVA variant deliberately:

- two-value BVA for each edge when only values immediately on either side matter;
- three-value BVA when the boundary value itself and both neighbors matter;
- robust BVA when invalid values just outside the valid domain are in scope;
- worst-case combinations only when interaction risk justifies the growth in cases.

For numeric or ordered domains, consider `min-1`, `min`, `min+1`, nominal, `max-1`, `max`, and `max+1` where representable and relevant. For lengths, dates, times, enumerations, and state transitions, define the predecessor/successor semantics explicitly. Do not claim BVA for a category that has no meaningful order.

Read [references/output-template.md](references/output-template.md) when creating the domain-model or BVA document.

## Validate before handoff

- Every requirement affecting input validity maps to at least one variable or explicit non-input rule.
- Every partition has a source and expected classification.
- Every selected boundary maps to a partition and named rule.
- Values are representable in the target interface/API and include units.
- Cross-field and state dependencies are visible.
- No implementation behavior has silently replaced the approved oracle.
- IDs are unique and stable, and uncovered rules/gaps are listed.

New or materially changed artifacts remain `PENDING HUMAN REVIEW` unless the user explicitly reviews or delegates the decision. Report counts of variables, partitions, boundaries, and unresolved gaps.
