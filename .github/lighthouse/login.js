// Runs before each audited URL. Passes the storefront password page if needed, then selects the
// review theme for this browser session (Shopify keeps the choice in a cookie) and confirms it, so
// audits load plain URLs without the preview redirect and can never measure the wrong theme.
module.exports = async (browser) => {
  const host = `https://${process.env.SHOP_STORE}`;
  const themeId = process.env.REVIEW_THEME_ID;
  const currentTheme = () => page.evaluate(() => String(window.Shopify?.theme?.id));
  const page = await browser.newPage();

  await page.goto(`${host}/`, { waitUntil: 'networkidle2' });
  if (new URL(page.url()).pathname === '/password') {
    await page.type('input[name="password"]', process.env.STOREFRONT_PASSWORD || '');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.keyboard.press('Enter'),
    ]);
    if (new URL(page.url()).pathname === '/password') throw new Error('Storefront password was rejected.');
  }

  if ((await currentTheme()) !== themeId) {
    await page.goto(`${host}/?preview_theme_id=${themeId}&_fd=0&pb=0`, { waitUntil: 'networkidle2' });
    const shown = await currentTheme();
    if (shown !== themeId) throw new Error(`Expected review theme ${themeId}, but the storefront shows ${shown}.`);
  }
  // disableStorageReset keeps the HTTP cache along with the cookies, and the navigation above fills
  // it; clear it so every audit is a cold load, as page budgets assume.
  const session = await page.createCDPSession();
  await session.send('Network.clearBrowserCache');
  await page.close();
};
