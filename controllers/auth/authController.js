const winston = require("winston");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator/check");

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

    }
  },

  register: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`Validation error: ${JSON.stringify(errors.array())}`);
      res.status(422).json({ errors: errors.array() });
    } else {

    }
  }
};
