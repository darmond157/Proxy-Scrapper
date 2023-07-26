const puppeteer = require('puppeteer')
const urls = require('../data/puppeteerUrls')
const { formatPuppProxy} = require('../utils/formatters.js')
const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox']
})
const page = await browser.newPage()

async function puppeteerReqs () {

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
    formatPuppProxy(proxies)
  })

  await browser.close()
}

module.exports = puppeteerReqs
