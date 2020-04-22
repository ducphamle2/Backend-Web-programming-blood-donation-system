const crypto = require('crypto');
const constants = require('../utils/constants')

module.exports = {
  generateId: () => crypto.randomBytes(16).toString("hex"),
  checkRole: (role) => {
    if (role === constants.role.donor)
      return true;
    else if (role === constants.role.hospital)
      return true;
    else if (role === constants.role.organizer)
      return true;
    else if (role === constants.role.red_cross)
      return true
    else
      return false
  }
}