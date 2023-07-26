require('dotenv').config()
const app = require('./src/main')

app(process.env.PORT, process.env.HOST)
