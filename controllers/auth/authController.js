const winston = require("winston");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator/check");

const db = require("../../database/index");
const userId = require("../../utils/utils").generateId
const constants = require("../../utils/constants")
const checkRole = require("../../utils/utils").checkRole

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
      return res.status(422).json({ error: errors.array() });
    } else {
      if (!checkRole(req.body.role)) {
        return res.status(400).json({ error: "Wrong role when login" })
      }
      let email = req.body.email
      let role = req.body.role
      // role is used to select from correct table. Client will send the role
      let sql = 'SELECT * from ?? where email = ?'
      db.query(sql, [role, email], async function (err, user) {
        console.log("user: ", user)
        if (err) {
          return res.status(500).json({
            error: "Error querying" + err,
          });
        } else if (user.length === 0) {
          return res.status(204).json({
            message: "Cannot find the correct user"
          })
        } else {
          let result = await bcrypt.compare(req.body.password, user[0].password)
          if (!result || result.length === 0) {
            res.status(422).json({
              error: "Auth failed!"
            });
            logger.info("Wrong password");
          } else {
            // generate a token for the account to use in other api
            jwt.sign({
              email: user[0].email,
              // check id type based on role to sign the correct one
              id: role === constants.role.donor ?
                user[0].donor_id :
                role === constants.role.red_cross ?
                  user[0].redcross_id : role === constants.role.organizer ?
                    user[0].organizer_id : user[0].hospital_id,
              role: role
            }, process.env.SECRET_KEY, { algorithm: "HS512" }, (err, token) => {
              if (err) {
                return res.status(422).json({
                  error: "Auth failed",
                });
              } else {
                return res.status(200).json({
                  message: "Logged in successfully",
                  token,
                  user
                });
              }
            });
          }
        }
      });
    }
  },

  register: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array() });
    } else {
      // if it's not among four roles then return error
      if (!checkRole(req.body.role)) {
        return res.status(400).json({ error: "Wrong role when registering" })
      }
      // hash the password for protection in case db is exposed
      let password = generateHash(req.body.password)
      let sql = "select name, email from ?? where name = ? or email = ?"
      // check if name has been used or not, since this will be used to query in other api
      db.query(sql, [req.body.role, req.body.name, req.body.email], function (err, result) {
        // if the name has been used then we return error
        console.log("result: ", result)
        if (result === undefined || result.length > 0) {
          return res.status(409).json({
            error: "The name or email has already been used",
          });
        } else if (err) {
          return res.status(500).json({
            error: "There is something wrong when querying: " + err,
          });
        } else {
          let values =
            req.body.role === constants.role.hospital ?
              [
                // insert into three values, id which is 32 characters, email and password
                [userId(), req.body.red_cross_id, req.body.email, password, req.body.name]
              ] :
              [
                // insert into three values, id which is 32 characters, email and password
                [userId(), req.body.email, password, req.body.name]
              ]
          // role id is used to distinguish from tables
          let role_id = req.body.role + "_id"
          let sql =
            req.body.role === constants.role.hospital ?
              'insert into ?? (' + role_id + ', red_cross_id, email, password, name) values ?' :
              'insert into ?? (' + role_id + ', email, password, name) values ?'
          db.query(sql, [req.body.role, values], function (err, user) {
            if (err) {
              return res.status(500).json({
                error: "Error querying: " + err,
              });
            } else {
              console.log("USER: ", user)
              res.status(200).json({
                message: "Registered successfully"
              });
            }
          })
        }
      })
    }
  }
};

