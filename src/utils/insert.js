async function insertToMongo (fastify) {
  if (myMap.size != 0) {
    await fastify.mongo.db.dropCollection('proxies').catch(() => {
      console.log('collection does not exist!')
    })

    await fastify.mongo.db
      .collection('proxies')
      .insertMany(Array.from(myMap.values()))
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
