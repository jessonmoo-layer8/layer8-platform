const { Builder, By, until } = require('selenium-webdriver');

async function executeWithSelenium(plan, userContext) {
  if (process.env.SKIP_BROWSER === 'true') {
    return { status: 'skipped' };
  }
  const driver = new Builder().forBrowser('chrome').build();
  let result = {};
  try {
    for (const step of plan.steps) {
      switch (step.action) {
        case 'open_browser':
          // Already handled by creating driver
          break;
        case 'navigate':
          await driver.get(step.url);
          break;
        case 'login':
          await driver.findElement(By.name('username')).sendKeys(step.username);
          await driver.findElement(By.name('password')).sendKeys(userContext.password);
          await driver.findElement(By.css('button[type="submit"]')).click();
          break;
        case 'reset_password':
          await driver.findElement(By.id('reset-password')).click();
          break;
        case 'confirm':
          result.confirmation = await driver.findElement(By.id('confirmation')).getText();
          break;
        default:
          throw new Error(`Unknown step: ${step.action}`);
      }
    }
    await driver.quit();
    return { status: 'success', ...result };
  } catch (err) {
    await driver.quit();
    return { status: 'failure', error: err.message };
  }
}

module.exports = { executeWithSelenium };
