// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('Test_SocorroExpress_logout', function() {
  this.timeout(30000)
  let driver
  let vars
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
  })
  afterEach(async function() {
    await driver.quit();
  })
  it('Test_SocorroExpress_logout', async function() {
    await driver.get("http://127.0.0.1:5500/Front-end/html/perfil.html")
    await driver.manage().window().setRect({ width: 1086, height: 816 })
    await driver.findElement(By.id("logout")).click()
  })
})
