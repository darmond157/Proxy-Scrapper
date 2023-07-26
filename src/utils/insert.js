function insertToMongo (fastify,proxies) {
  if (proxies.size != 0) {
    fastify.mongo.db.dropCollection('proxies').catch(() => {
      console.log('collection does not exist!')
    })

    fastify.mongo.db
      .collection('proxies')
      .insertMany(Array.from(proxies.values()))
      .then(() => {
        console.log('done')
      })
      .catch(e => {
        console.log('Error adding to mongodb: ', e)
      })
  } else {
    console.log('map is empty')
  }
}

module.exports = insertToMongo