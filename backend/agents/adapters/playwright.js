const { chromium } = require('playwright');

async function executeWithPlaywright(plan, userContext) {
  if (process.env.SKIP_BROWSER === 'true') {
    return { status: 'skipped' };
  }
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  let result = {};
  try {
    for (const step of plan.steps) {
      switch (step.action) {
        case 'open_browser':
          // Already handled by launching browser
          break;
        case 'navigate':
          await page.goto(step.url);
          break;
        case 'login':
          await page.fill('input[name="username"]', step.username);
          await page.fill('input[name="password"]', userContext.password);
          await page.click('button[type="submit"]');
          break;
        case 'reset_password':
          await page.click('button#reset-password');
          break;
        case 'confirm':
          // Could add a check for confirmation message
          result.confirmation = await page.textContent('#confirmation');
          break;
        default:
          throw new Error(`Unknown step: ${step.action}`);
      }
    }
    await browser.close();
    return { status: 'success', ...result };
  } catch (err) {
    await browser.close();
    return { status: 'failure', error: err.message };
  }
}

module.exports = { executeWithPlaywright };
