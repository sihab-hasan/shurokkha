# Roadmap

This roadmap distinguishes repository foundation that exists today from product/infrastructure work that still needs real requirements.

## Foundation in place

- pnpm/Turborepo monorepo with Web, Docs and Admin applications;
- shared UI primitives, reusable UI patterns and semantic icon packages;
- shared contracts, auth helpers, permissions, validation, utilities and API-client boundary packages;
- professional route-group/shell architecture for Web `(public)`, `(auth)` and `(app)` experiences;
- implemented public About, How Shurokkha Works, Contact and Public Profile experiences;
- architecture guards, formatting, lint, typecheck and production-build scripts;
- GitHub CI, PR title validation, CodeQL scanning via GitHub Default setup, Dependabot and collaboration templates.

## Milestone 1 — complete product experience

- Finalize user roles and primary disaster-relief journeys.
- Implement remaining public route designs from their heading scaffolds.
- Complete signed-in request, resource, donation, volunteer and coordination interactions.
- Add component and interaction tests for stable flows.
- Define accessibility acceptance criteria for critical journeys.

## Milestone 2 — backend and data

- Define actual API/runtime requirements before creating a service workspace.
- Select persistence and migration tooling.
- Turn `@shurokkha/api-client` into a real typed transport layer.
- Share request/response contracts through `@shurokkha/contracts` and runtime validation through `@shurokkha/validation`.
- Add backend-specific CI only after a deployable backend exists.

## Milestone 3 — identity and operations

- Integrate a production authentication/identity provider.
- Implement authorization from real role/permission requirements.
- Add audit logging for sensitive administrative actions.
- Add structured logging, error reporting and operational health checks.
- Add sanitized environment templates only for real integrations.

## Milestone 4 — delivery

- Choose hosting targets for each deployable application/service.
- Add provider-specific preview, staging and production workflows.
- Define secret ownership, deployment approvals and rollback procedures.
- Add end-to-end tests for critical relief workflows.
- Establish incident response, backup and recovery documentation for production systems.

## Definition of done

A milestone item is complete only when behavior is implemented, relevant checks pass, security/accessibility/data implications are reviewed, and developer/user documentation reflects the shipped state.
