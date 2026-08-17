# GitHub Repository Setup

The repository contains push-ready GitHub configuration under `.github/`. File-based automation is committed; a few repository settings must still be enabled in GitHub after the first push.

## First push

For a new GitHub repository:

```bash
git init
git add .
git commit -m "chore: initialize repository"
git branch -M main
git remote add origin git@github.com:sihab-hasan/Shurokkha.git
git push -u origin main
```

If the remote already exists, do not run `git init` or add the remote again; commit the changes and push the existing branch instead.

## Committed workflows

### CI — `.github/workflows/ci.yml`

Runs on pushes and pull requests to `main`:

1. frozen pnpm install;
2. repository architecture checks;
3. Prettier check;
4. ESLint;
5. TypeScript checks;
6. production workspace build.

The workflow uses the Node major from `.node-version` and the pnpm version pinned by the repository.

### PR Title — `.github/workflows/pr-title.yml`

Requires conventional pull-request title types such as `feat`, `fix`, `docs`, `refactor`, `ci` and `chore`.

### CodeQL — GitHub Default setup

CodeQL is intentionally managed with GitHub **Default setup** instead of a committed `.github/workflows/codeql.yml`. This keeps the repository on GitHub-managed CodeQL configuration and avoids maintaining a duplicate Advanced setup workflow.

After the first push, open **Settings → Advanced Security → Code scanning**, choose **Set up → Default**, review the detected languages and scan events, then enable CodeQL.

## Dependency automation

`.github/dependabot.yml` checks:

- npm/pnpm workspace dependencies weekly;
- GitHub Actions versions weekly.

Dependency PRs are grouped to reduce noise.

## Recommended GitHub settings after first push

### General

- Default branch: `main`.
- Disable force pushes and branch deletion for `main`.
- Prefer squash merging unless the team chooses a different history policy.
- Automatically delete head branches after merge.

### Branch protection / ruleset for `main`

Require pull requests and require these checks before merge:

- `Quality` (from the CI workflow)
- `Build` (from the CI workflow)
- `Conventional title` (from the PR Title workflow)

Also require the branch to be up to date when appropriate for the team's merge volume. Enable required CODEOWNERS review only after ownership reflects real collaborators/teams.

### Security

Enable, where available:

- Dependabot alerts;
- Dependabot security updates;
- Secret scanning;
- push protection;
- private vulnerability reporting;
- Code scanning / CodeQL alerts using **Default setup**.

Do not add repository or environment secrets until a real integration needs them.

## Deployment

There is intentionally **no deployment workflow** yet. Add one only after hosting providers, project identifiers, environments, secret ownership, approval rules and rollback behavior are defined. A workflow that only pretends to deploy is more misleading than no workflow.

## Ownership

`.github/CODEOWNERS` currently assigns repository-wide ownership to the repository owner. Replace or extend it with real GitHub teams when collaboration expands; never reference teams that do not exist.
