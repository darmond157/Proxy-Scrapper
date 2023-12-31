const axiosReqs = require('../scraps/axios.js')
const insertToMongo = require('./insert.js')
let proxies = new Map()

function cronProps (fastify) {
  return {
    jobs: [
      {
        cronTime: process.env.CRON_TIME,
        onTick: () => {
          let allPromises = axiosReqs(proxies)
          Promise.all(allPromises).then(() => {
            insertToMongo(fastify, proxies)
          })
        }
      }
    ]
  }
}
module.exports = cronProps
