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
