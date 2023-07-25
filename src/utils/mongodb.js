function register (fastify) {
  return new Promise((res, rej) => {
    fastify
      .register(require('@fastify/mongodb'), {
        forceClose: true,
        url: process.env.MONGODB_URL
      })
      .after(err => {
        if (err) return rej(err)
        console.log('Connected to mongodb Successfully!')
        res()
      })
  })
}

module.exports = register
