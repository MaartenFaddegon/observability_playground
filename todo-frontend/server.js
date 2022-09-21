var PROTO_PATH = __dirname + '/../todo-backend/proto/todobackend.proto';
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
// Suggested options for similarity to existing grpc.load behavior
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var todobackend = grpc.loadPackageDefinition(packageDefinition).todobackend;
var client = new todobackend.TodoBackend('todo-backend:8080', grpc.credentials.createInsecure());
const path = require("path");
const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();

function grpcGet(getRequest) {
  return new Promise((resolve, reject) => {
    getCallback = function(err, getResponse) {
      if (err) reject(err);
      else resolve(getResponse);
    }
    client.GetRPC(getRequest, getCallback);
  });
}

app.use(express.static(path.resolve(__dirname, "client/build")));
app.use(express.json());

app.post("/todo", (req, res) => {
  console.log("handle POST /todo", req.body.todo);
  addCallback = function(err, addResponse) {
    if (err) {
      console.log('GRPC TodoBackend.addRPC error:', err);
      return;
    }
    console.log('GRPC TodoBackend.addRPC returned:', addResponse);
  }
  addRequest = {item: req.body.todo};
  client.AddRPC(addRequest, addCallback);
  res.send('OK')
})

app.get("/todos", async (_req, res) => {
  console.log("handle GET /todos");
  getRequest = {};
  getResponse = await grpcGet(getRequest);
  console.log('GRPC TodoBackend.getRPC returned:', getResponse);
  res.json({ todos: getResponse.items });
});

app.get("*", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log("Server listening on", PORT);
});
