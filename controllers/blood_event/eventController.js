const db = require("../../database/index");
const eventId = require("../../utils/utils").generateId
const constants = require("../../utils/constants")
const { validationResult } = require("express-validator/check");

module.exports = {
  createEvent: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
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
          if (result.length === 0) {
            return res.status(404).json({
              message: "Cannot find the red cross name",
            });
          } else if (err) {
            return res.status(400).json({
              message: "There is something wrong when querying",
            });
          } else {
            let red_cross_id = result[0].red_cross_id
            console.log("result after querying: ", red_cross_id)
            // check to see if the event name has been created or not
            let sql = "select name from event where name = ?"
            let values = [[req.body.name]]
            db.query(sql, [values], function (err, result) {
              if (result.length > 0) {
                return res.status(409).json({
                  message: "This event has been created already !!",
                });
              } else if (err) {
                return res.status(500).json({
                  message: "There is something wrong when querying",
                });
              } else {
                let event_id = eventId()
                let values =
                  req.body.role =
                  [
                    [
                      event_id,
                      red_cross_id,
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
        })
      }
    }
  },

  updateEvent: (req, res) => {

  },
  deleteEvent: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      let sql = "delete from event where event_id = ?"
      let values = [[req.body.id]]
      db.query(sql, [values], function (err, result) {
        console.log("result: ", result)
        if (err) {
          return res.status(500).json({ error: "There is something wrong with the database" })
          // if the deletion affects no rows then cannot find the given event id
        } else if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Error cannot find the given event id" })
        } else {
          return res.status(200).json({ message: "Delete the event successfully" })
        }
      })
    }
  },
  searchEventWithName: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`Validation error: ${JSON.stringify(errors.array())}`);
      return res.status(422).json({ error: errors.array() });
    } else {
      let sql = "select * from event where name = ?"
      let values = [[req.body.name]]
      db.query(sql, [values], function (err, result) {
        if (err) {
          return res.status(500).json({
            error: "Error querying: " + err,
          });
        } else {
          return res.status(200).json({
            message: "Query successful",
            data: result
          })
        }
      })
    }
  },
  searchEventWithDate: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      let sql = "select * from event where event_date = ?"
      let values = [[req.body.date]]
      db.query(sql, [values], function (err, result) {
        if (err) {
          return res.status(500).json({
            error: "Error querying: " + err,
          });
        } else {
          // Apply each element to the Date function
          return res.status(200).json({
            message: "Query successful",
            data: result
          })
        }
      })
    }
  },
};
