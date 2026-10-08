// Lighthouse CI config: audits the review theme that the Shopify GitHub integration deploys from `main`.
// Assertions are provisional until build plan slice 0 records page budgets: accessibility fails
// below the stock-Horizon floor (product page 0.85, 2026-10-08); the rest warn below the 0.9 targets.
const host = `https://${process.env.SHOP_STORE}`;
// login.js selects the review theme first; pb=0 hides the preview bar.
const query = '?_fd=0&pb=0';
const median = (minScore) => ({ minScore, aggregationMethod: 'median-run' });

module.exports = {
  ci: {
    collect: {
      url: [
        `${host}/${query}`,
        `${host}/collections/${process.env.COLLECTION_HANDLE}${query}`,
        `${host}/products/${process.env.PRODUCT_HANDLE}${query}`,
      ],
      numberOfRuns: 3,
      // LHCI resolves this relative to the working directory (the repository root).
      puppeteerScript: '.github/lighthouse/login.js',
      // GitHub-hosted runners need Chrome's sandbox disabled.
      puppeteerLaunchOptions: { args: ['--no-sandbox'] },
      // Keep the storefront password cookie between runs.
      settings: { disableStorageReset: true },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', median(0.9)],
        'categories:accessibility': ['error', median(0.85)],
        'categories:best-practices': ['warn', median(0.9)],
        'categories:seo': ['warn', median(0.9)],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/reports' },
  },
};
