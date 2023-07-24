require('dotenv').config()

// const puppeteer = require('puppeteer')
const axios = require('axios')
const fastify = require('fastify')({ logger: process.env.LOGGER })

const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const PROTO_PATH = './iprep.proto'
const packageDef = protoLoader.loadSync(PROTO_PATH)
const grpcObj = grpc.loadPackageDefinition(packageDef).iprep
const client = new grpcObj.rep(
  '127.0.0.1:9091',
  grpc.credentials.createInsecure()
)

let myMap = new Map()

fastify.register(require('@fastify/mongodb'), {
  forceClose: true,
  url: process.env.MONGODB_URL
})

fastify.register(require('fastify-cron'), {
  jobs: [
    {
      cronTime: process.env.CRON_TIME,
      onTick: () => {
        scrapAndSave()
      }
    }
  ]
})

fastify.get('/', (request, reply) => {
  fastify.mongo.db
    .collection('proxies')
    .find()
    .toArray((err, result) => {
      console.log(result)
    })
})

fastify.get('/save', (requset, reply) => {
  scrapAndSave()
})

async function scrapAndSave (request, reply) {
  // PUPPETEER CODE SECTION //

  // const browser = await puppeteer.launch({
  //   headless: 'new',
  //   args: ['--no-sandbox']
  // })
  // const page = await browser.newPage()

  // await page.goto('https://www.us-proxy.org/')
  // const usProxy = await page
  //   .evaluate(() => {
  //     const tds = Array.from(document.querySelectorAll('table tbody tr'))
  //     return tds.map(td => td.innerText)
  //   })
  //   .catch(() => {
  //     console.log('failed to get data from us-proxy')
  //   })

  // await page.goto('https://www.sslproxies.org/')
  // const sslproxies = await page
  //   .evaluate(() => {
  //     const tds = Array.from(document.querySelectorAll('table tbody tr'))
  //     return tds.map(td => td.innerText)
  //   })
  //   .catch(() => {
  //     console.log('failed to get data from ssl-proxy')
  //   })

  // await page.goto('https://www.socks-proxy.net/')
  // const socks = await page
  //   .evaluate(() => {
  //     const tds = Array.from(document.querySelectorAll('table tbody tr'))
  //     return tds.map(td => td.innerText)
  //   })
  //   .catch(() => {
  //     console.log('failed to get data from socks-proxy')
  //   })

  // await browser.close()

  // formatSocksProxy(socks)
  // formatUsSslProxy(sslproxies)
  // formatUsSslProxy(usProxy)

  // PUPPETEER CODE SECTION //

  await axios
    .get('https://sunny9577.github.io/proxy-scraper/proxies.json')
    .then(res => {
      formatProxy(res.data)
    })
    .catch(() => {
      console.log('failed to get data from sunny9577-proxy')
    })
  await axios
    .get(
      'https://raw.githubusercontent.com/UptimerBot/proxy-list/main/proxies/http.txt'
    )
    .then(res => {
      splitProxy(res.data.split('\n'), '')
    })
    .catch(() => {
      console.log('failed to get data from uptimerbot-proxy')
    })
  await axios
    .get('https://raw.githubusercontent.com/almroot/proxylist/master/list.txt')
    .then(res => {
      splitProxy(res.data.split('\n'), '')
    })
    .catch(() => {
      console.log('failed to get data from almroot-proxy')
    })
  await axios
    .get('https://api.proxylist.to/http?key=PROXY-93FB7948-LIST-6695075D-TO')
    .then(res => {
      splitProxy(res.data.split('\n'), 'HTTP')
    })
    .catch(() => {
      console.log('failed to get data from api1-proxy')
    })
  await axios
    .get('https://api.proxylist.to/socks4?key=PROXY-93FB7948-LIST-6695075D-TO')
    .then(res => {
      splitProxy(res.data.split('\n'), 'Socks4')
    })
    .catch(() => {
      console.log('failed to get data from api2-proxy')
    })
  await axios
    .get('https://api.proxylist.to/socks5?key=PROXY-93FB7948-LIST-6695075D-TO')
    .then(res => {
      splitProxy(res.data.split('\n'), 'Socks5')
    })
    .catch(() => {
      console.log('failed to get data from api3-proxy')
    })

  insertToMongo()
}

function formatProxy (array) {
  array.forEach(element => {
    if (element.type === 'http') element.type = 'HTTP'
    client.SetBlocked({
      reputations: [
        {
          object: element.ip,
          type: 'ip'
        }
      ]
    })
    myMap.set(element.ip, {
      _id: element.ip,
      ip: element.ip,
      port: element.port,
      country: element.country,
      anonymity: element.anonymity,
      type: element.type,
      code: element.code ? element.code : ''
    })
  })
}

function splitProxy (array, type) {
  array.forEach(element => {
    let splitted = element.split(':')
    client.SetBlocked({
      reputations: [
        {
          object: splitted[0],
          type: 'ip'
        }
      ]
    })
    myMap.set(splitted[0], {
      _id: splitted[0],
      ip: splitted[0],
      port: splitted[1],
      country: '',
      anonymity: '',
      type: type,
      code: ''
    })
  })
}

// function formatSocksProxy (array) {
//   array.forEach(element => {
//     let el = element.split('\t')
//     myMap.set(el[0], {
//       _id: el[0],
//       ip: el[0],
//       port: el[1],
//       country: el[3],
//       anonymity: el[5],
//       type: el[4],
//       code: el[2]
//     })
//   })
// }

// function formatUsSslProxy (array) {
//   array.forEach(element => {
//     let el = element.split('\t')
//     myMap.set(el[0], {
//       _id: el[0],
//       ip: el[0],
//       port: el[1],
//       country: el[3],
//       anonymity: el[4],
//       type: el[6] === 'yes' ? 'Https' : '',
//       code: el[2]
//     })
//   })
// }

async function insertToMongo () {
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

fastify.listen({ port: process.env.PORT, host: '0.0.0.0' }, () => {
  fastify.cron.startAllJobs()
})
