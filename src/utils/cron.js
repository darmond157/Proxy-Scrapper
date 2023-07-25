function register (fastify) {
  return new Promise((res, rej) => {
    fastify
      .register(require('fastify-cron'), {
        jobs: [
          {
            cronTime: process.env.CRON_TIME,
            onTick: () => {
              //   scrapAndSave()
            }
          }
        ]
      })
      .after(err => {
        if (err) return rej(err)
        console.log('Cron Registered Successfully!')
        res()
      })
  })
}

module.exports = register
