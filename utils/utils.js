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
  },

  // CHANGE KEY TO RETURN ONLY ID FOR CLIENT, CLIENT DOES NOT HAVE TO CHECK ID TYPE
  checkUserId: (role, user) => {
    console.log("utils | role: " + role + " | user: " + user);
    let new_key = "userId"
    let old_key = ""
    if (role === constants.role.donor)
      old_key = "donor_id";
    else if (role === constants.role.hospital)
      old_key = "hospital_id";
    else if (role === constants.role.organizer)
      old_key = "organizer_id";
    else if (role === constants.role.red_cross)
      old_key = "red_cross_id"

    // REMOVE OLD KEY TO ADD NEW KEY
    Object.defineProperty(user, new_key,
      Object.getOwnPropertyDescriptor(user, old_key));
    delete user[old_key];

    return user
  }
}