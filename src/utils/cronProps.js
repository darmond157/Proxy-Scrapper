const axiosReqs = require('../scraps/axios.js')
const { insertToMongo } = require('./formatters.js')

function cronProps (fastify) {
  return {
    jobs: [
      {
        cronTime: process.env.CRON_TIME,
        onTick: async () => {
          await axiosReqs()
          insertToMongo(fastify)
        }
      }
    ]
  }
}
module.exports = cronProps
