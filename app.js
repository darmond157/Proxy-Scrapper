require('dotenv').config()
const app = require('./src/main')

app(3000, '0.0.0.0')
