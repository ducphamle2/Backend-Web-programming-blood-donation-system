const db = require("../../database/index");
const eventId = require("../../utils/utils").generateId;
const utils = require("../../utils/utils");
const constants = require("../../utils/constants");
const { validationResult } = require("express-validator/check");
//const io = require('../socket/socket.js').getIo();

module.exports = {
  createEvent: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      console.log("request user data: ", req.userData);
      // only organizer can create event
      if (req.userData.role !== constants.role.organizer) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function",
        });
      } else {
        // need to find the id of the red cross since user can only remember name
        let sql = "select organizer_id from organizer where organizer_id = ?";
        let values = [[req.userData.id]];
        db.query(sql, [values], function (err, result) {
          if (result.length === 0) {
            return res.status(404).json({
              error: "Cannot find the organizer",
            });
          } else if (err) {
            return res.status(500).json({
              error: "There is something wrong when querying",
            });
          } else {
            // check to see if the event name has been created or not
            let sql = "select name from event where name = ?";
            let values = [[req.body.name]];
            db.query(sql, [values], function (err, result) {
              console.log("sss", result);
              if (result.length) {
                return res.status(409).json({
                  error: "This event has been created already !!",
                });
              } else if (err) {
                return res.status(500).json({
                  error: "There is something wrong when querying",
                });
              } else {
                let event_id = eventId();
                let values = [
                  [
                    event_id,
                    null,
                    req.userData.id, // id of the organizer when using token
                    req.body.date,
                    req.body.name,
                    req.body.location,
                    constants.pending,
                  ],
                ];
                let sql = "insert into event values ?";
                db.query(sql, [values], function (err, user) {
                  if (err || user.length === 0) {
                    return res.status(500).json({
                      error: "Error querying: " + err,
                    });
                  } else {
                    console.log("USER: ", user);
                    return res.status(200).json({
                      message: "Your event has been created successfully",
                      event_id: event_id,
                    });
                  }
                });
              }
            });
          }
        });
      }
    }
  },

  updateEvent: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      if (req.userData.role !== constants.role.organizer) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function",
        });
      } else {
        let sql = "select organizer_id from organizer where organizer_id = ?";
        let values = [[req.userData.id]];
        db.query(sql, [values], function (err, result) {
          if (result.length === 0) {
            return res.status(404).json({
              error: "Cannot find the organizer",
            });
          } else if (err) {
            return res.status(500).json({
              error: "There is something wrong when querying",
            });
          } else {
            let val = {
              event_date: req.body.date,
              name: req.body.name,
              location: req.body.location,
              status: constants.pending,
              event_id: req.params.id,
            };
            let sql = "update event set ? where event_id = ?";
            db.query(sql, [val, req.params.id], function (err, result) {
              if (err) {
                return res.status(500).json({
                  error: "Error querying: " + err,
                });
              } else if (result.affectedRows === 0) {
                return res.status(404).json({
                  error: "Cannot find the correct event id to update",
                });
              } else {
                return res.status(200).json({
                  message: "Update successfully",
                });
              }
            });
          }
        });
      }
    }
  },
  deleteEvents: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      if (req.userData.role !== constants.role.organizer) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function",
        });
      } else {
        // need to find the id of the organizer because if not hacker can use old account
        let sql = "select organizer_id from organizer where organizer_id = ?";
        let values = [[req.userData.id]];
        db.query(sql, [values], function (err, result) {
          if (result.length === 0) {
            return res.status(404).json({
              error: "Cannot find the organizer",
            });
          } else if (err) {
            return res.status(500).json({
              error: "There is something wrong when querying",
            });
          } else {
            let sql = "delete from event where event_id in (?)";
            let values = [];
            for (let i = 0; i < req.body.ids.length; i++) {
              values.push(req.body.ids[i].id);
            }
            db.query(sql, [values], function (err, result) {
              console.log("result: ", result);
              if (err) {
                return res.status(500).json({
                  error: "There is something wrong with the database",
                });
                // if the deletion affects no rows then cannot find the given event id
              } else if (result.affectedRows === 0) {
                return res
                  .status(404)
                  .json({ error: "Error cannot find the given event id" });
              } else {
                return res
                  .status(200)
                  .json({ message: "Delete the event successfully" });
              }
            });
          }
        });
      }
    }
  },
  searchEventWithName: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array() });
    } else {
      let sql = "select * from event where name = ?";
      let values = [[req.query.name]];
      db.query(sql, [values], function (err, result) {
        if (err) {
          return res.status(500).json({
            error: "Error querying: " + err,
          });
        } else {
          return res.status(200).json({
            message: "Query successful",
            data: result,
          });
        }
      });
    }
  },
  searchEventWithDate: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      let sql = "select * from event where event_date = ?";
      let values = [[req.body.date]];
      db.query(sql, [values], function (err, result) {
        if (err) {
          return res.status(500).json({
            error: "Error querying: " + err,
          });
        } else {
          // Apply each element to the Date function
          return res.status(200).json({
            message: "Query successful",
            data: result,
          });
        }
      });
    }
  },
  // needs to use limit and offset (pagnitation here)
  getAllEvents: (req, res) => {
    db.query("select * from event", function (err, result) {
      if (err) {
        return res
          .status(500)
          .json({ error: "there is something wrong with the database" });
      } else {
        return res.status(200).json({ message: "success", data: result });
      }
    });
  },
  searchEventWithId: (req, res) => {
    db.query(
      "select e.event_id, r.name as red_cross_name, o.name as organizer_name, e.name as name, e.event_date, e.location, e.status from event as e inner join organizer as o on e.organizer_id = o.organizer_id left join red_cross as r on e.red_cross_id = r.red_cross_id where e.event_id = ?",
      [req.params.id],
      function (err, result) {
        if (err) {
          console.log("ERROR: ", err);
          return res
            .status(500)
            .json({ error: "there is something wrong with the database" });
        } else {
          //io.to("ABCD").emit("test", "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG")
          if (result[0].red_cross_name === null)
            result[0].red_cross_name = "None";
          return res.status(200).json({ message: "success", data: result[0] });
        }
      }
    );
  },
};
