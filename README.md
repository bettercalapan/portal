![Banner](./static/og-image.png)

# Overview

BetterCalapan is an open-source community-driven platform that makes Calapan's government information and public services more accessible, transparent, and easy to navigate. This platform is focused on providing great UX, accessibility, and performance. It is a localized subset of one of BetterGov's projects, [BetterLGU](https://lgu.bettergov.ph/).

Check the portal out at [bettercalapan.org](https://bettercalapan.org/)! 🧡

> [!NOTE]  
> The platform is currently in beta. Versions >= 0.1.x are usable for the public, but 1.0.0 won't come until the codebase lives up to the platform's philosophy of great UX, accessibility, and performance. We want to make this as best as it can be!

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

# Build for production
pnpm gen
pnpm build

# Preview the build
pnpm preview

# Lint & format
pnpm lint
pnpm check

# Run tests
pnpm test

# Open the mobile performance dashboard at http://localhost:5678
pnpm benchmark

# Open the desktop performance dashboard
pnpm benchmark:desktop

# Run mobile and desktop budget checks
pnpm benchmark:ci

# Run mobile and desktop accessibility checks
pnpm pa11y

# Check external links across the site
pnpm lychee
```

**Don't have pnpm?** See the [installation](https://pnpm.io/installation).

## Report Form Configuration

The `/report` form uses Cloudflare Turnstile and the Email Sending binding configured in `wrangler.jsonc`. Before enabling it in production:

1. Enable Email Sending for `bettercalapan.org`, route `reports@bettercalapan.org` to the maintainers, and allow `website@bettercalapan.org` as a sender.
2. Create a managed Turnstile widget for `bettercalapan.org`. Local development widgets should also allow `localhost` and `127.0.0.1`.
3. Set `TURNSTILE_SITE_KEY` as a Worker variable and `TURNSTILE_SECRET` as a Worker secret.
4. Set `TURNSTILE_HOSTNAMES` to a comma-separated allowlist. Production must contain only production frontend hostnames, not local development names.

For local development, copy `.env.example` to `.env` and provide development or Cloudflare test credentials. Never commit real Turnstile secrets. The server validates every token's success status, `report` action, and hostname before sending email.

For a manual production deployment, run `pnpm deploy`. This rebuilds the generated Worker before deploying it. Wrangler preserves the Turnstile variables configured in the Cloudflare dashboard because `keep_vars` is enabled in `wrangler.jsonc`.

## Performance Checks

`pnpm benchmark` builds the site, serves it locally, and opens the interactive mobile Unlighthouse dashboard at `http://localhost:5678`. Use `pnpm benchmark:desktop` for the desktop dashboard.

`pnpm benchmark:ci` reads every route from the generated `/sitemap.xml`, runs both viewports, and fails if any page's category score drops below the budget:

- Mobile: 90
- Desktop: 70

Budgets apply to all four Lighthouse categories (performance, accessibility, best-practices, SEO). Reports are written to `.unlighthouse/` locally. CI runs each viewport on a separate runner for every push to `main` and publishes compact Markdown job summaries instead of report artifacts.

The XML sitemap is generated from static `+page.svelte` and `+page.svx` routes. New static pages are included automatically; parameterized routes must provide concrete URLs before they can be added.

## Accessibility Checks

`pnpm pa11y` builds and serves the site locally, then checks every route in `/sitemap.xml` at mobile and desktop widths using Pa11y. Use `pnpm pa11y:mobile` or `pnpm pa11y:desktop` to run one viewport.

The checks use the axe and HTML CodeSniffer runners at WCAG 2 AA and fail on any confirmed accessibility error. Axe findings that require manual review remain non-blocking warnings. Pa11y requires Node.js 20, 22, or 24; CI uses Node.js 22 and runs both viewports as separate jobs on every push.

Each CI job publishes a compact Markdown summary with route and error totals plus any failing rule codes. Full selectors, HTML context, and remediation links remain in the job log. The temporary JSON reports in `.pa11y/` are ignored by Git and are not uploaded as artifacts.

## External Link Checks

`pnpm lychee` builds and serves the site locally, reads every route from `/sitemap.xml`, and uses [Lychee](https://lychee.cli.rs/) to check external HTTP and HTTPS links found in the rendered pages. New static pages are included automatically without maintaining a route list.

Install the Lychee CLI before running the local check. The project currently tests with Lychee 0.24.2; see the [official installation options](https://github.com/lycheeverse/lychee#installation). The similarly named `lychee` npm package is unrelated.

The check fails on broken external links. BetterCalapan's local preview and canonical production origins are excluded as internal links, while email addresses are outside the HTTP link-checking scope. HTTP 403 responses are accepted because several government sites block automated clients while remaining publicly reachable. CI installs the pinned Lychee version and runs `pnpm lychee:ci` on every push.

CI publishes a Markdown job summary with one row per unique external URL, its result, and every sitemap page where it appears. Successful links, accepted 403 responses, redirects, failures, and timeouts are labeled separately. The temporary JSON report and `.lychee/summary.md` are ignored by Git and are not uploaded as artifacts.

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
