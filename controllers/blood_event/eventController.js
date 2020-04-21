const db = require("../../database/index");
const eventId = require("../../utils/utils").generateId
const constants = require("../../utils/constants")

module.exports = {
  createEvent: (req, res) => {
    console.log("request user data: ", req.userData)
    // only organizer can create event
    if (req.userData.role !== "organizer") {
      return res.status(403).json({
        message: "Forbidden !! You are not allowed to call this function"
      })
    } else {
      // need to find the id of the red cross since user can only remember name 
      let sql = "select red_cross_id from red_cross where name = ?"
      let values = [[req.body.red_cross_name]]
      db.query(sql, [values], function (err, result) {
        console.log("result after querying: ", result[0].red_cross_id)
        if (result.length === 0) {
          return res.status(404).json({
            message: "Cannot find the red cross name",
          });
        } else if (err) {
          return res.status(503).json({
            message: "There is something wrong when querying",
          });
        } else {

          let event_id = eventId()
          let values =
            req.body.role =
            [
              [
                event_id,
                result[0].red_cross_id,
                req.userData.id, // id of the organizer when using token
                req.body.date,
                req.body.name,
                req.body.location,
                constants.pending
              ]
            ]
          let sql = "insert into event values ?"
          db.query(sql, [values], function (err, user) {
            if (err || user.length === 0) {
              return res.status(400).json({
                message: "Error querying: " + err,
              });
            } else {
              console.log("USER: ", user)
              return res.status(200).json({
                message: "Your event has been created successfully",
                event_id: event_id
              });
            }
          })
        }
      })
    }
  },

  updateEvent: (req, res) => {

  },
  deleteEvent: (req, res) => {

  }
};
