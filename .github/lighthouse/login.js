// Runs before each audited URL. Logs in through the storefront password page only when the
// session is not already authenticated, so Lighthouse sees the theme instead of the password page.
module.exports = async (browser) => {
  const host = `https://${process.env.SHOP_STORE}`;
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
  await page.close();
};
