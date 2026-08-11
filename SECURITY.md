# Security Policy

BetterCalapan takes the security of the platform and the safety of its users seriously. This document outlines how security issues are handled.

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

To report a vulnerability privately:

- Use GitHub's [Security Advisories](https://github.com/bettercalapan/portal/security/advisories/new) feature, or
- Email the maintainers at security@bettercalapan.org with the subject prefix `[SECURITY]`.

Please include as much of the following as possible:

- A description of the vulnerability and the affected component.
- Steps to reproduce it (including minimal setup/configuration).
- The impact and any exploit scenarios you have identified.
- Your suggested fix, if you have one.

### What to expect

- **Acknowledgment:** You will receive an acknowledgment of your report within 48 hours.
- **Status updates:** You will receive updates as the issue is triaged and a fix is prepared.
- **Resolution:** We aim to confirm or reject a report and, when valid, release a fix as soon as practical.
- **Disclosure:** Please allow us a reasonable period to fix and release the issue before you disclose it publicly. We will credit you in any public advisory unless you prefer to remain anonymous.

## Security Considerations

BetterCalapan is an open-source informational platform hosted on Cloudflare Workers. It has no user accounts or authentication. Its limited server-side functionality validates and emails website reports, which may include an optional reporter email address. Security responsibilities include:

- **No secrets in the repository:** API keys, tokens, and credentials must never be committed. Use environment variables or platform secrets (e.g., Cloudflare Secrets) instead.
- **Dependency hygiene:** Keep dependencies up to date and review dependabot/security alerts promptly.
- **Quality gates:** Run `pnpm lint` and `pnpm check` before merging changes.
- **Data integrity:** The data shown on the platform comes from public government sources. Reporters should flag any data that appears incorrect or misleading.
- **Limited personal information:** Website reports should contain only the information needed to investigate an issue. Reporters must not submit passwords, identification numbers, financial details, medical records, or other sensitive information.

## Licensing

This project is licensed under the GNU GPL v3.0 license. Security fixes are released under the same license. See the [LICENSE](LICENSE) for more details.
