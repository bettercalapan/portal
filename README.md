![Banner](./static/banner.png)

# Overview

BetterCalapan is an open-source community-driven platform that makes Calapan's government information and public services more accessible, transparent, and easy to navigate. This platform is focused on providing great UX, accessibility, and performance. It is a localized subset of one of BetterGov's projects, [BetterLGU](https://lgu.bettergov.ph/).

Check the portal out at [bettercalapan.org](https://bettercalapan.org/)! 🧡

## Tech Stack

| Tool               | Purpose         |
| ------------------ | --------------- |
| SvelteKit          | Framework       |
| TypeScript         | Type Safety     |
| Vite               | Build Tool      |
| Vanilla CSS        | Styling         |
| ESLint             | Linting         |
| Prettier           | Formatting      |
| PNPM               | Package Manager |
| Cloudflare Workers | Hosting         |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/bettercalapan/portal.git
cd portal

# Install dependencies (requires pnpm)
pnpm install

# Start dev server
pnpm dev

# Run all quality checks, then preview the verified production build
pnpm verify

# Run mobile and desktop performance budget checks
pnpm benchmark

# Run mobile and desktop accessibility checks
pnpm pa11y

# Check external links across the site
pnpm lychee

# Verify manifest, installability, offline fallback, and cache behavior
pnpm test:pwa
```

**Don't have pnpm?** See the [installation](https://pnpm.io/installation).

## Performance Checks

`pnpm benchmark` checks every sitemap route against mobile and desktop Lighthouse budgets. It fails below 90 on mobile or 70 on desktop across performance, accessibility, best-practices, or SEO. CI runs both viewports on every push to `main`.

> [!NOTE]  
> The `--desktop` flag for Unlighthouse is a bit buggy. Despite the desktop version of the page being very performant as shown on manual Lighthouse tests, it shows lower scores on the benchmark. As a compromise, the budget is set to 70 until a more reliable solution is found.

## Accessibility Checks

`pnpm pa11y` checks every sitemap route at mobile and desktop widths with axe and HTML CodeSniffer against WCAG 2 AA. Use `pnpm pa11y:mobile` or `pnpm pa11y:desktop` for one viewport. Confirmed errors fail the check, while manual-review warnings remain non-blocking. CI runs both viewports on every push to `main`.

## PWA and Offline Behavior

BetterCalapan is installable in supported browsers. After installation, public pages, charts, and search work offline, while report submissions, Turnstile, email, and external links require connectivity. Uncached routes show an offline fallback. `pnpm test:pwa` checks installability, the manifest, offline behavior, responsive layout, and cache cleanup.

Before a release, manually check installation and icons in desktop Chromium, Android, and iOS.

## External Link Checks

`pnpm lychee` checks external HTTP and HTTPS links in every rendered sitemap route. Internal origins and email addresses are excluded, and HTTP 403 responses are accepted. CI runs `pnpm lychee:ci` on every push to `main`.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

**Quick ways to help:**

- Report bugs via [GitHub Issues](https://github.com/bettercalapan/portal/issues)
- Update outdated info (officials, fees, contacts)
- Add translations (Filipino, Mangyan languages)
- Submit new features via PR

## Data Sources

| Source                                                                     | Data                                     |
| -------------------------------------------------------------------------- | ---------------------------------------- |
| [cityofcalapan.gov.ph](https://cityofcalapan.gov.ph)                       | Departments, barangays, and contact info |
| [PSA](https://psa.gov.ph)                                                  | Population and census data               |
| [Bureau of Local Government Finance](https://blgf.gov.ph/lgu-fiscal-data/) | City income and fiscal data              |
| [Cities and Municipalities Competitiveness Index](https://cmci.dti.gov.ph) | Competitiveness indicators               |

Data comes from public government records and is reviewed for accuracy. Spotted something outdated or wrong? Report it via [GitHub Issues](https://github.com/bettercalapan/portal/issues).

## License

GNU GPL v3.0 License. See [LICENSE](LICENSE) for more details.
