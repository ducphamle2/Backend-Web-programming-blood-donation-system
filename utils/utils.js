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
  },
  convertDatetime: (unixtimestamp) => {
    // Months array
    var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Convert timestamp to milliseconds
    var date = new Date(unixtimestamp * 1000);

    // Year
    var year = date.getFullYear();

    // Month
    var month = months_arr[date.getMonth()];

    // Day
    var day = date.getDate();

    // Hours
    var hours = date.getHours();

    // Minutes
    var minutes = "0" + date.getMinutes();

    // Seconds
    var seconds = "0" + date.getSeconds();

    // Display date time in MM-dd-yyyy h:m:s format
    var convdataTime = month + '-' + day + '-' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    console.log("conv data time: ", convdataTime)
    return convdataTime
  }
}