const express = require("express");
const app = express();

const PORT = 3000;

app.use(express.static('public'))

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(PORT, function() {
  console.log("Server working on port " + PORT);
});
