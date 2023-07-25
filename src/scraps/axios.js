const axios = require('axios')
const urls = require('../data/axiosUrls')
const { formatProxy, splitProxy } = require('../utils/formatters.js')

async function axiosReqs () {
  axios
    .get('https://sunny9577.github.io/proxy-scraper/proxies.json')
    .then(res => {
      formatProxy(res.data)
    })
    .catch(e => {
      console.log(e)
    })

  urls.forEach(el => {
    axios
      .get(el.url)
      .then(res => {
        splitProxy(res.data.split('\n'), el.type)
      })
      .catch(e => {
        console.log(e)
      })
  })
}

module.exports = axiosReqs
