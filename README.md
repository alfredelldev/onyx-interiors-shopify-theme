# Onyx Interiors Shopify theme

Shopify theme for Onyx, an Australian bathroomware retailer, built on [Horizon](https://github.com/Shopify/horizon). Onyx's design direction, specs and design-phase status live in the sibling design repository.

**Status:** unmodified Horizon 4.2.0 baseline. No Onyx customisation, store connection or deployment yet. Current state: `HANDOFF.md` once theme work starts; until then [../onyx-shopify/HANDOFF.md](../onyx-shopify/HANDOFF.md).

## Repository layout

Both repositories are expected as sibling checkouts:

```
onyx-interiors/
├── onyx-shopify/                    design repository: rules, strategies, specs, HTML prototypes
└── onyx-interiors-shopify-theme/    this repository: the Shopify theme
```

| Concern | Owner |
|---|---|
| Shared rules, private information, licensing, scope | [../onyx-shopify/AGENTS.md](../onyx-shopify/AGENTS.md) |
| Theme rules and development procedure | [AGENTS.md](AGENTS.md) |
| Design decisions and specs | [../onyx-shopify/docs/design/MASTER.md](../onyx-shopify/docs/design/MASTER.md) |
| Build plan (slices agents execute) | [docs/BUILD_PLAN.md](docs/BUILD_PLAN.md) |
| Client estimates (WBS) | [../onyx-shopify/docs/ai/THEME_DEVELOPMENT_WBS.md](../onyx-shopify/docs/ai/THEME_DEVELOPMENT_WBS.md) |
| Commands, targets, upstream process | This README |
| Horizon architecture facts and Onyx component owners | [docs/HORIZON_AUDIT.md](docs/HORIZON_AUDIT.md) |
| CI: Theme Check and Lighthouse | [.github/workflows/](.github/workflows/) |
| Theme implementation state | `HANDOFF.md` (when theme work starts) |

## Requirements

- Git with access to this private repository.
- [Shopify CLI](https://shopify.dev/docs/storefronts/themes/tools/cli); commands below checked against 4.8.5.
- A staff or collaborator account on the development store.

## Store, themes and release source

**Release source: Shopify GitHub integration** (decided 2026-10-08). Each connected branch syncs with one theme:

- A push to a connected branch updates its theme straight away, so pushing is deploying to that theme.
- Edits on a connected theme (theme editor, code editor, theme apps) are committed back to its branch by Shopify; this cannot be disabled. They mostly touch `config/settings_data.json` and template and section-group JSON, so pull before editing those files.
- Only theme-structure folders sync; `.github/`, README files and other folders are ignored.

Branch mapping, set up by the developer:

| Branch | Connected theme | Use |
|---|---|---|
| `main` | Unpublished review theme | Client review of finished slices |
| `production` (created for launch) | Live theme | Changes arrive only through an approved release merge |

Never connect the branch that day-to-day work lands on to the live theme. Rollback: revert the release merge on `production` or republish the previous theme; `horizon-4.2.0-base` tags the untouched baseline.

| Target | Value | Use |
|---|---|---|
| Development store | `onyx-interiors-hwel88qa.myshopify.com` (test store with products and images; storefront password-protected) | `theme dev` and review |
| Development theme ID | _created by `theme dev`_ | Local live-reload preview |
| Review theme ID | `167404044450` (unpublished, connected to `main`) | Shareable review builds |
| Live theme | _to record (connected to `production` at launch)_ | Publication only with explicit approval |
| Release and rollback owner | _to confirm_ | Publication and rollback |

## Local development

```sh
shopify theme check                         # validate the theme
shopify theme dev --store <store>           # development theme with live reload
shopify theme list --store <store>          # theme IDs and roles
```

Review builds reach the review theme when the developer pushes `main`; agents never push. `theme dev` and `theme push` can overwrite `config/settings_data.json` and `templates/*.json` in either direction. Live-theme flags, publishing and deletion are release-only; see [AGENTS.md](AGENTS.md#merchant-configuration-and-store-safety).

## Theme Check baseline

Recorded 2026-10-08 on unmodified Horizon 4.2.0 with Shopify CLI 4.8.5: **0 errors, 6 warnings**.

- `sections/header.liquid`: ExcessiveSettingsCount (42 settings, limit 40).
- `snippets/divider.liquid`: five UnusedDocParam warnings.

CI runs Theme Check on every push and pull request and fails when errors or warnings exceed `MAX_ERRORS`/`MAX_WARNINGS` in the workflow. When offences are fixed, lower those values and update this section; raise them only for a deliberately accepted offence, listed above with its reason. Re-record the baseline after each Horizon update.

## Lighthouse CI

`.github/workflows/lighthouse.yml` audits the review theme (not a fresh upload). **Automatic runs are off until theme development finishes** (re-enable the push trigger described at the top of the workflow in slice 9); it runs only manually (**Actions → Lighthouse → Run workflow**). On push-triggered runs it waits two minutes for the GitHub integration to sync. It logs in through the storefront password page, selects and confirms the review theme for the browser session (so audited URLs carry no preview redirect), clears the HTTP cache while keeping those cookies so every run is a cold load, runs Lighthouse three times on the home page, a collection and a product (mobile profile), and uses the median run.

- **Setup:** repository secret `STOREFRONT_PASSWORD`; repository variable `LHCI_PRODUCT_HANDLE` (a representative product with options and images); optional variable `LHCI_COLLECTION_HANDLE` (default `all`). No Shopify app or store write is involved.
- **Results:** a score table in the run summary and the full HTML reports as the `lighthouse-reports` artifact (private to the repository).
- **Assertions** (`.github/lighthouse/lighthouserc.js`): accessibility below 85 fails (the stock-Horizon floor on the sample product page); performance, best practices and SEO below 90 warn. They are provisional until slice 0 records page budgets; 90 remains the target. SEO scores on a password-protected store can understate launch SEO, because the storefront is not crawlable before launch.

## Updating from Horizon

Run by the developer, not by agents. `upstream` points to `https://github.com/Shopify/horizon.git`.

```sh
git fetch upstream
git switch -c horizon-update-<version>
git merge upstream/main
```

Resolve conflicts with care in `config/settings_data.json`, `templates/*.json` and Onyx-edited Horizon files. Then run Theme Check, review the development preview and the theme editor, check [release-notes.md](release-notes.md) for breaking changes, update the Horizon version noted above, re-record the Theme Check baseline and re-verify `docs/HORIZON_AUDIT.md`.

## Licence

Horizon is © Shopify Inc. under [LICENSE.md](LICENSE.md). This derived theme is delivered only to the Onyx merchant for its own store and must not be redistributed, listed or resold. Third-party components added beyond Horizon are recorded in `THIRD_PARTY_NOTICES.md`.

## Other documents

- [README.horizon.md](README.horizon.md): Horizon's original README, kept unchanged for reference.
- [release-notes.md](release-notes.md): Horizon's release notes.
