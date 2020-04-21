const winston = require("winston");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator/check");
const crypto = require('crypto');

const db = require("../../database/index");

const generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.colorize()
  )
});

module.exports = {
  login: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`Validation error: ${JSON.stringify(errors.array())}`);
      res.status(422).json({ errors: errors.array() });
    } else {
      let email = req.body.email
      let role = req.body.role
      // role is used to select from correct table. Client will send the role
      let sql = 'SELECT * from ?? where email = ?'
      db.query(sql, [role, email], async function (err, user) {
        if (err) {
          res.status(400).json({
            message: "Error connecting to database" + err,
          });
        }
        let result = await bcrypt.compare(req.body.password, user[0].password)
        if (!result || result.length === 0) {
          res.status(422).json({
            message: "Auth failed!"
          });
          logger.info("Wrong password");
        } else {
          // generate a token for the account to use in other api
          jwt.sign({
            username: user.username,
            //userId: user.id
          }, process.env.SECRET_KEY, { algorithm: "HS512" }, (err, token) => {
            if (err) {
              res.status(422).json({
                message: "Auth failed",
              });
              logger.error("Cannot create token");
            } else {
              res.status(200).json({
                message: "Logged in successfully",
                token,
                user
              });
            }
          });
        }
      });
    }
  },

  register: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`Validation error: ${JSON.stringify(errors.array())}`);
      res.status(422).json({ errors: errors.array() });
    } else {
      // hash the password for protection in case db is exposed
      let password = generateHash(req.body.password)
      console.log("Password: ", password)
      let values =
        req.body.role === "hospital" ?
          [
            // insert into three values, id which is 32 characters, email and password
            [crypto.randomBytes(16).toString("hex"), req.body.redcross_id, req.body.email, password]
          ] :
          [
            // insert into three values, id which is 32 characters, email and password
            [crypto.randomBytes(16).toString("hex"), req.body.email, password]
          ]
      // role id is used to distinguish from tables
      let sql =
        req.body.role === "hospital" ?
          'insert into ?? (' + req.body.role_id + ', redcross_id, email, password) values ?' :
          'insert into ?? (' + req.body.role_id + ', email, password) values ?'
      db.query(sql, [req.body.role, values], function (err, user) {
        if (err) {
          res.status(400).json({
            message: "Error connecting to database" + err,
          });
        }
        console.log("USER: ", user)
        res.status(200).json({
          message: "Registered successfully",
          body: password
        });
      })
    }
  }
};

