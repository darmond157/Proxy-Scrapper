const { grpcInit, addToIpBlacklist } = require('./iprepGrpc.js')
let client = grpcInit()

function formatProxy (array,proxies) {
  array.forEach(element => {
    if (element.type === 'http') element.type = 'HTTP'
    addToIpBlacklist(client, element.ip)
    proxies.set(element.ip, {
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

function splitProxy (array, type,proxies) {
  array.forEach(element => {
    let splitted = element.split(':')
    addToIpBlacklist(client, splitted[0])
    proxies.set(splitted[0], {
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

function formatPuppProxy (array) {
  array.forEach(element => {
    let el = element.split('\t')
    addToIpBlacklist(client, el[0])
    proxies.set(el[0], {
      _id: el[0],
      ip: el[0],
      port: el[1],
      country: el[3],
      anonymity: el[4],
      type: el[6] === 'yes' ? 'HTTPS' : '',
      code: el[2]
    })
  })
}

module.exports = {
  formatProxy,
  splitProxy,
  formatPuppProxy,
}
