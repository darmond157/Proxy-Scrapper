const axios = require('axios')
const urls = require('../data/axiosUrls')
const { formatProxy, splitProxy } = require('../utils/formatters.js')

let allPromises = []

function axiosReqs (proxies) {
  urls.forEach(el => {
    allPromises.push(
      axios
        .get(el.url)
        .then(res => {
          splitProxy(res.data.split('\n'), el.type, proxies)
        })
        .catch(e => {
          console.log(e)
        })
    )
  })
  return allPromises
}

module.exports = axiosReqs
