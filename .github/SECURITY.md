# Security Policy

## Reporting a vulnerability

Do **not** open a public issue for suspected vulnerabilities, exposed credentials, authentication bypasses, privacy issues, or other security-sensitive findings.

Use GitHub's private vulnerability reporting / Security Advisory flow for this repository when it is available. If private reporting is not enabled, contact the repository owner through an existing private collaboration channel before sharing technical details.

Include, when safe to do so:

- the affected application, package, route, or commit;
- a concise impact assessment;
- reproducible steps or a minimal proof of concept;
- suggested mitigation, if known;
- whether any credential, personal data, or production system may be exposed.

Never include live secrets or unnecessary personal data in a report.

## Supported code

Security fixes are applied to the default branch. This project is under active development and does not currently publish versioned support releases.

## Repository safeguards

After the repository is pushed, enable GitHub Secret Scanning, push protection, Dependabot alerts, private vulnerability reporting, and branch protection for `main` in repository settings where available.
