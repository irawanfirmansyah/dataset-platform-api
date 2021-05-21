try {
  require("dotenv").config();
} catch {
  // do nothing
}

const http = require("http");
const fs = require("fs");
const path = require("path");
const app = require("./app");
require("./database");

const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
