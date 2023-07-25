const puppeteer = require('puppeteer')
const urls = require('../data/puppeteerUrls')
const { formatUsSslProxy, formatSocksProxy } = require('../utils/formatters.js')
const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox']
})
const page = await browser.newPage()

async function puppeteerReqs () {
  await page.goto('https://www.socks-proxy.net/')
  const socks = await page
    .evaluate(() => {
      const tds = Array.from(document.querySelectorAll('table tbody tr'))
      return tds.map(td => td.innerText)
    })
    .catch(() => {
      console.log('failed to get data from us-proxy')
    })
  formatSocksProxy(socks)

  urls.forEach(async el => {
    await page.goto(el)
    const proxies = await page
      .evaluate(() => {
        const tds = Array.from(document.querySelectorAll('table tbody tr'))
        return tds.map(td => td.innerText)
      })
      .catch(() => {
        console.log('failed to get data from ssl-proxy')
      })
    formatUsSslProxy(proxies)
  })

  await browser.close()
}

module.exports = puppeteerReqs
