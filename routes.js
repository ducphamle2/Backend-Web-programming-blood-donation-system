module.exports = (server) => {
  server.use("/api/auth/", require("./controllers/auth/index.js"));

  server.use("/api/event/", require("./controllers/blood_event/index.js"));

  //server.use("/api/", require("./controllers/test/index.js"));

  server.use("*", (req, res) => {
    console.log(req.originalUrl)
    res.status(404).json({ message: "Whoops, what are you looking for?" });
  });
};
