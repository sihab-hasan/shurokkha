# GitHub Configuration

Repository collaboration, security and automation live here.

## Workflows

- `workflows/ci.yml` — architecture, formatting, lint, typecheck and build checks for `main` and pull requests.
- `workflows/pr-title.yml` — conventional pull-request title validation.
- CodeQL uses GitHub **Default setup** from repository settings; no `workflows/codeql.yml` is committed.

There is intentionally no deployment workflow until real hosting targets and deployment requirements exist.

## Automation and policy

- `actions/setup-node-pnpm/action.yml` — shared Node/pnpm setup with pnpm cache and frozen lockfile installation.
- `dependabot.yml` — weekly dependency and GitHub Actions updates.
- `CODEOWNERS` — current repository review owner.
- `SECURITY.md` — vulnerability reporting policy.
- `copilot-instructions.md` — repository boundaries for GitHub Copilot.
- `ISSUE_TEMPLATE/` — structured bug/feature forms and security routing.
- `PULL_REQUEST_TEMPLATE.md` — required PR context and validation evidence.

## After first push

File-based configuration cannot enable repository settings by itself. Follow [`docs/github-repository.md`](../docs/github-repository.md) to configure the `main` ruleset, required checks, Dependabot/security features, secret scanning and private vulnerability reporting.

## Updating Actions

Dependabot tracks GitHub Actions versions. Keep Actions on supported major versions and review automated updates like normal code changes.
