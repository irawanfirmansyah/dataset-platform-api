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

const port = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(port);

server.on("close", () => {
  // remove database
  const dbPath = path.join(__dirname, "db.sqlite");
  fs.unlink(dbPath, (err) => {
    if (err) throw err;
  });
});
