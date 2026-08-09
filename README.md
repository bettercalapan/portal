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
```

**Don't have pnpm?** See the [installation](https://pnpm.io/installation).

## Performance Checks

`pnpm benchmark` builds the site, serves it locally, and opens the interactive mobile Unlighthouse dashboard at `http://localhost:5678`. Use `pnpm benchmark:desktop` for the desktop dashboard.

`pnpm benchmark:ci` reads every route from the generated `/sitemap.xml`, runs both viewports, and fails if any page's category score drops below the budget:

- Mobile: 90
- Desktop: 70

Budgets apply to all four Lighthouse categories (performance, accessibility, best-practices, SEO). Reports are written to `.unlighthouse/` locally. CI runs each viewport on a separate runner for every push to `main` and publishes compact Markdown job summaries instead of report artifacts.

The XML sitemap is generated from static `+page.svelte` and `+page.svx` routes. New static pages are included automatically; parameterized routes must provide concrete URLs before they can be added.

<!-- TODO: add automated accessibility checks here once implemented. -->

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
