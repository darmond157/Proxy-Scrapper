function init () {
  const grpc = require('@grpc/grpc-js')
  const protoLoader = require('@grpc/proto-loader')
  const packageDef = protoLoader.loadSync('./src/proto/iprep.proto')
  const grpcObj = grpc.loadPackageDefinition(packageDef).iprep
  return new grpcObj.rep('localhost:9091', grpc.credentials.createInsecure())
}
function block(client,ip){
client.SetBlocked(
  {
    reputations: [
      {
        object: ip,
        type: 'ip'
      }
    ]
  },
  (e, r) => {
    console.log(e)
    console.log(r)
  }
)
}
let client = init()
