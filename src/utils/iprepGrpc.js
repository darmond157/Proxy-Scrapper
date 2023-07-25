function grpcInit () {
  const grpc = require('@grpc/grpc-js')
  const protoLoader = require('@grpc/proto-loader')
  const packageDef = protoLoader.loadSync('../../iprep.proto')
  const grpcObj = grpc.loadPackageDefinition(packageDef).iprep
  client = new grpcObj.rep(
    process.env.GRPC_PORT,
    grpc.credentials.createInsecure()
  )
  return client
}

function addToIpBlacklist (client, ip) {
  client.SetBlocked({
    reputations: [
      {
        object: ip,
        type: 'ip'
      }
    ]
  })
}

module.exports = { grpcInit, addToIpBlacklist }
