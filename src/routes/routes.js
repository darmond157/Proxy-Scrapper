function initRoutes (fastify) {
  fastify.get('/allProxies', (request, reply) => {
    fastify.mongo.db
      .collection('proxies')
      .find()
      .toArray((err, result) => {
        console.log(result)
      })
  })
}

module.exports = initRoutes