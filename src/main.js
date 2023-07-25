function init (port, host) {
  const fastify = require('fastify')({ logger: process.env.LOGGER })
  const cronProps = require('./utils/cronProps')

  require('./utils/cron.js')(fastify, cronProps)
    .then(() => {
      return require('./utils/mongodb.js')(fastify)
    })
    .then(() => {
      require('./routes/routes.js')(fastify)
    })
    .catch(e => {
      console.log(e)
    })

  fastify.listen({ port: port, host: host }, err => {
    if (err) {
      console.log(e)
      process.exit(1)
    }
    fastify.cron.startAllJobs()
  })
}
module.exports = init
