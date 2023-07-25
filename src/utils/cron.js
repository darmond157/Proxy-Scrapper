function register (fastify, cronProps) {
  return new Promise((res, rej) => {
    fastify.register(require('fastify-cron'), cronProps(fastify)).after(err => {
      if (err) return rej(err)
      console.log('Cron Registered Successfully!')
      res()
    })
  })
}

module.exports = register
