// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('Test_SocorroExpress_cadastro', function() {
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
  it('Test_SocorroExpress_cadastro', async function() {
    await driver.get("http://127.0.0.1:5500/Front-end/html/perfil.html/Front-end/html/cadastro.html")
    await driver.manage().window().setRect({ width: 1084, height: 816 })
    await driver.findElement(By.id("nome")).click()
    await driver.findElement(By.id("nome")).sendKeys("João Pedro")
    await driver.findElement(By.id("email")).click()
    await driver.findElement(By.id("email")).sendKeys("joao.pedro1@gmail.com")
    await driver.findElement(By.id("senha")).click()
    await driver.findElement(By.id("senha")).sendKeys("Joao12345")
    await driver.findElement(By.id("confirmarSenha")).click()
    await driver.findElement(By.id("confirmarSenha")).sendKeys("Joao12345")
    await driver.findElement(By.id("registerButton")).click()
  })
})