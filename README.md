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
| Theme Check CI | [.github/workflows/theme-check.yml](.github/workflows/theme-check.yml) |
| Theme implementation state | `HANDOFF.md` (when theme work starts) |

## Requirements

- Git with access to this private repository.
- [Shopify CLI](https://shopify.dev/docs/storefronts/themes/tools/cli); commands below checked against 4.8.5.
- A staff or collaborator account on the development store.

## Store and theme targets

Confirm before any connected preview or remote write (WBS 1.6). Theme IDs come from `shopify theme list --store <store>`.

| Target | Value | Use |
|---|---|---|
| Development store | _exists (owner's test store with products and images); domain to record_ | `theme dev` and unpublished previews |
| Development theme ID | _created by `theme dev`_ | Local live-reload preview |
| Unpublished review theme ID | _to confirm_ | Shareable review builds |
| Live theme | _to confirm_ | Never pushed from a local checkout without an authorised release |
| Release and rollback owner | _to confirm_ | Publication and rollback |

## Local development

```sh
shopify theme check                         # validate the theme
shopify theme dev --store <store>           # development theme with live reload
shopify theme list --store <store>          # theme IDs and roles
```

Pushing to the unpublished review theme, only after reviewing the diff:

```sh
shopify theme push --store <store> --theme <unpublished-theme-id>
```

`theme dev` and `theme push` can overwrite `config/settings_data.json` and `templates/*.json` in either direction. Live-theme flags, publishing and deletion are release-only; see [AGENTS.md](AGENTS.md#merchant-configuration-and-store-safety).

## Theme Check baseline

Recorded 2026-10-08 on unmodified Horizon 4.2.0 with Shopify CLI 4.8.5: **0 errors, 6 warnings**.

- `sections/header.liquid`: ExcessiveSettingsCount (42 settings, limit 40).
- `snippets/divider.liquid`: five UnusedDocParam warnings.

CI runs Theme Check on every push and pull request and fails when errors or warnings exceed `MAX_ERRORS`/`MAX_WARNINGS` in the workflow. When offences are fixed, lower those values and update this section; raise them only for a deliberately accepted offence, listed above with its reason. Re-record the baseline after each Horizon update.

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
