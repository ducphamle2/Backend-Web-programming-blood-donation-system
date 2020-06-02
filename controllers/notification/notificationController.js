const db = require("../../database/index");
const notiId = require("../../utils/utils").generateId
const utils = require("../../utils/utils")
const constants = require("../../utils/constants")
//const io = require('../socket/socket.js').getIo();

module.exports = {
  // ID is the ID of the sender, content is the notification content
  createNotification: (role, id, content) => {
    let notificationId = notiId()
    let notiDate = utils.timeConverter(new Date())
    let values =
      [
        [
          notificationId,
          role === constants.role.red_cross ? id : null,
          role === constants.role.organizer ? id : null,
          role === constants.role.hospital ? id : null,
          role === constants.role.donor ? id : null,
          notiDate,
          content
        ]
      ]
    let sql = "insert into notification values ?"
    db.query(sql, [values], function (err, result) {
      if (err || result.length === 0) {
        return false
      }
      return true
    })
  },

  // needs to use limit and offset (pagnitation here)
  getAllNotifications: (req, res) => {
    let role = req.query.role
    let id = req.query.id
    let idCol = role + "_" + "id"
    let query = `select ${idCol}, noti_date, content from notification where ${idCol} = ?`
    db.query(query, [[id]], function (err, result) {
      if (err) {
        return res.status(500).json({ error: "there is something wrong with the database" })
      } else {
        return res.status(200).json({ message: "success", data: result })
      }
    })
  }

  // searchEventWithId: (req, res) => {
  //   db.query("select e.event_id, r.name as red_cross_name, o.name as organizer_name, e.name as name, e.event_date, e.location, e.status from event as e inner join organizer as o on e.organizer_id = o.organizer_id left join red_cross as r on e.red_cross_id = r.red_cross_id where e.event_id = ?", [req.params.id], function (err, result) {
  //     if (err) {
  //       console.log("ERROR: ", err)
  //       return res.status(500).json({ error: "there is something wrong with the database" })
  //     } else {
  //       //io.to("ABCD").emit("test", "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG")
  //       if (result[0].red_cross_name === null)
  //         result[0].red_cross_name = "None"
  //       return res.status(200).json({ message: "success", data: result[0] })
  //     }
  //   })
  // }
};
