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

app.get("/todos", (_req, res) => {
  console.log("handle GET /todos");
  getCallback = function(err, getResponse) {
    if (err) {
      console.log('GRPC TodoBackend.getRPC error:', err);
      return;
    }
    console.log('GRPC TodoBackend.getRPC returned:', getResponse);
  }
  getRequest = {item: req.body.todo};
  client.GetRPC(getRequest, getCallback);
  res.json({ todos: ["boodschappen doen", "koken", "eten", "afwassen"] });
});

app.get("*", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log("Server listening on", PORT);
});
