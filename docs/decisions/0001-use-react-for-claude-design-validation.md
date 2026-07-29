# ADR-0001: Use React for Claude Design Component Validation

**Status:** Proposed for ratification with the repository design specification

**Date:** 2026-07-28

## Context

The original repository architecture was framework-neutral. It proposed JSON tokens, generated CSS, semantic HTML/CSS examples, and a static canonical page. React and Storybook were rejected because choosing a framework before a production website existed appeared to create avoidable maintenance.

Subsequent Claude Design onboarding evidence clarified the `/design-sync` workflow. The command accepts GitHub repositories, local codebases, design files, and raw token uploads. React is therefore not required to ingest a design system.

The relevant benefit is narrower: when real React components are present, Claude Design can build with those components and validate generated output against the implemented component contract before presenting it. Static examples and raw tokens communicate appearance and rules but do not provide equivalent component-level behavior.

## Decision

Use React and TypeScript for the public component implementation.

Version `0.1.0` implements Button, Link, Card, and SectionShell. Version `0.2.0` adds FormControl, Disclosure, Header, and Footer. The end-state public contract remains exactly eight primitives.

Keep styling framework-independent through semantic HTML, CSS custom properties, and co-located CSS. Do not introduce Tailwind, CSS-in-JS, a proprietary styling runtime, Storybook, or a third-party component framework.

Treat the package export and peer-dependency contract as forward-looking. Do not publish to npm or invest in registry automation and multi-format packaging during `0.1.0`.

## Rationale

React is accepted for one primary reason: component-level validation in Claude Design. It allows synchronized designs to use the same public properties, states, DOM semantics, and accessibility behavior as the reference implementation.

The decision does not claim that React is necessary for `/design-sync`, Figma generation, token distribution, or the future Ridgeframe website.

## Costs

- React and TypeScript dependency maintenance
- Vite, test-runner, and DOM-test-environment maintenance
- Component API and peer-dependency compatibility work
- Dependency security and upgrade review
- Additional build and CI time
- Risk that a future website uses a different framework
- More implementation effort than static HTML/CSS examples

The staged release limits those costs by shipping only four primitives in `0.1.0`.

## Consequences

- Claude Design receives real tokens and real React components.
- Static consumers can continue using generated CSS tokens and `DESIGN_SYSTEM.md`.
- The future Figma library can be generated from the same repository without treating React as a Figma requirement.
- A future non-React website may reuse tokens and rules while implementing separate components.
- Publishing to npm requires a later decision and is not implied by the local package structure.

## Reconsideration Triggers

Revisit this decision if:

- Claude Design provides equivalent component-level validation for framework-neutral Web Components or semantic HTML/CSS.
- Ridgeframe selects a non-React production stack before `0.2.0`.
- React maintenance exceeds the value of Claude Design component validation.
- The repository becomes a token-and-guidance source without component consumers.
