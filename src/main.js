function init (port, host) {
  const fastify = require('fastify')({ logger: process.env.LOGGER })

  fastify.listen({ port: port, host: host }, e => {
    console.log(e)
    // fastify.cron.startAllJobs()
  })
}
module.exports = init
