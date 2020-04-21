const crypto = require('crypto');

module.exports = {
  generateId: () => crypto.randomBytes(16).toString("hex")
}