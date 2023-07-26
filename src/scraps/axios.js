const axios = require('axios')
const urls = require('../data/axiosUrls')
const { formatProxy, splitProxy } = require('../utils/formatters.js')

let allPromises = []

function axiosReqs (proxies) {
  allPromises.push(
    axios
      .get('https://sunny9577.github.io/proxy-scraper/proxies.json')
      .then(res => {
        formatProxy(res.data,proxies)
      })
      .catch(e => {
        console.log(e)
      })
  )

  urls.forEach(el => {
    allPromises.push(
      axios
        .get(el.url)
        .then(res => {
          splitProxy(res.data.split('\n'), el.type,proxies)
        })
        .catch(e => {
          console.log(e)
        })
    )
  })
  return allPromises
}

module.exports = axiosReqs
