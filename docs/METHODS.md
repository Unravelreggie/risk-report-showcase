# Methods: synthetic risk-report preflight

## Public demonstration boundary

This independently authored browser-only demonstration uses fabricated identifiers, product labels, events, regions, dates and counts with a `SYN-` prefix. It includes no source records, private workflow, regulated report, licensed template, production endpoint or language-model call.

## Capability model represented

The interaction represents preflight before a human-review safety-report outline.

1. Inputs map to a selected synthetic product, region, period and net-dose denominator.
2. Product identity requires an exact approved alias. Similar strings, prefixes and suffixes are rejected; no substring matching is used.
3. A Form02 event is counted only when its Form01 identifier belongs to an exact selected-product Form01 case.
4. An unrelated product case or orphan/other-product Form02 event blocks readiness as mixed ownership.
5. The denominator is scoped to product, region and period as a synthetic net-sales dose count. Missing, zero, negative and non-finite values stop the workflow.
6. A ready preflight produces a local plain-text outline for human review. It is not a regulated report.

In an operational design, a language model would receive aggregates only after this gate. This demo makes no model call and produces no Word/PDF output.

## Interpretation limits

Passing this synthetic gate does not validate clinical methods, reporting completeness, production implementation, regulatory compliance or security controls.
