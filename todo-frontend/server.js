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
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
// The protoDescriptor object has the full package hierarchy
var todobackend = protoDescriptor.todobackend;
var client = new todobackend.TodoBackend('todo-backend:8080',
                                       grpc.credentials.createInsecure());


const path = require("path");
const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.resolve(__dirname, "client/build")));
app.use(express.json());

app.post("/todo", (req, res) => {
  console.log("handle POST /todo", req.body);
  // TODO: make a GRPC here to the todo-backend
  res.send('OK')
})

app.get("/todos", (_req, res) => {
  console.log("handle GET /todos");
  // TODO: make a GRPC here to the todo-backend
  res.json({ todos: ["boodschappen doen", "koken", "eten", "afwassen"] });
});

app.get("*", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log("Server listening on", PORT);
});
