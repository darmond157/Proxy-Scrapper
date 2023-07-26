const axiosReqs = require('../scraps/axios.js')
const { insertToMongo } = require('./insert.js')

function cronProps (fastify) {
  return {
    jobs: [
      {
        cronTime: process.env.CRON_TIME,
        onTick: () => {
          let allPromises = axiosReqs()
          Promise.all(allPromises).then(() => {
            insertToMongo(fastify)
          })
        }
      }
    ]
  }
}
module.exports = cronProps
