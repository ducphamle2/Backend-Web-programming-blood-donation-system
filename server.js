const express = require("express");
const cors = require("cors");
const winston = require("winston");
const expressWinston = require("express-winston");

const server = express();
const http = require("http").Server(server);
const io = require("socket.io")(http);

const db = require("./models");

require("dotenv").config();

server.use(cors());
server.use(express.urlencoded({ extended: false }));
server.use(express.json({ limit: "5mb" }));

server.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp(),
    winston.format.colorize()
  )
}));

require("./routes.js")(server);

server.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp(),
    winston.format.colorize()
  )
}));

db.sequelize.sync().then(() => {
  console.log("Connection has been established successfully.");
}).catch(err => {
  console.error("Unable to connect to the database:", err);
});

let port = process.env.PORT;
if (port == null || port === "") {
  port = 3000;
}

const listen = http.listen(port, () => {
  console.log("server is running on port", listen.address().port);
});
