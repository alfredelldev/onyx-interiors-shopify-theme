// Runs before each audited URL: passes the storefront password page so Lighthouse sees the theme.
module.exports = async (browser) => {
  const page = await browser.newPage();
  await page.goto(`https://${process.env.SHOP_STORE}/password`, { waitUntil: 'networkidle2' });
  const field = await page.$('input[name="password"]');
  if (field) {
    await field.type(process.env.STOREFRONT_PASSWORD || '');
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), field.press('Enter')]);
    if (new URL(page.url()).pathname === '/password') throw new Error('Storefront password was rejected.');
  }
  await page.close();
};
