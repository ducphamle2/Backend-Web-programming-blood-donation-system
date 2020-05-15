const db = require("../../database/index");
const storeId = require("../../utils/utils").generateId;
const constants = require("../../utils/constants");
const { validationResult } = require("express-validator/check");

module.exports = {
  getacceptedOrders: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      console.log("request user data: ", req.userData);
      if (req.userData.role !== constants.role.red_cross) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function",
        });
      } else {
        let sql = "select * from order where status=?";
        let values = [[constants.approved]];
        db.query(sql, [values], function (err, result) {
          if (err)
            return res.status(500).json({
              err: "There is something wrong when querying",
            });
          else
            return res.status(200).json({
              message: "Fetched accepted orders",
              data: result,
            });
        });
      }
    }
  },
  getrejectedOrders: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      console.log("request user data: ", req.userData);
      if (req.userData.role !== constants.role.red_cross) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function",
        });
      } else {
        let sql = "select * from order where status=?";
        let values = [[constants.rejected]];
        db.query(sql, [values], function (err, result) {
          if (err)
            return res.status(500).json({
              err: "There is something wrong when querying",
            });
          else
            return res.status(200).json({
              message: "Fetched rejected orders",
              data: result,
            });
        });
      }
    }
  },
  getacceptedEvents: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      console.log("request user data: ", req.userData);
      if (req.userData.role !== constants.role.red_cross) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function",
        });
      } else {
        let sql = "select * from event where status=?";
        let values = [[constants.approved]];
        db.query(sql, [values], function (err, result) {
          if (err)
            return res.status(500).json({
              err: "There is something wrong when querying",
            });
          else
            return res.status(200).json({
              message: "Fetched accepted events",
              data: result,
            });
        });
      }
    }
  },
  getclosedEvents: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      console.log("request user data: ", req.userData);
      if (req.userData.role !== constants.role.red_cross) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function",
        });
      } else {
        let sql = "select * from event where status=?";
        let values = [[constants.closed]];
        db.query(sql, [values], function (err, result) {
          if (err)
            return res.status(500).json({
              err: "There is something wrong when querying",
            });
          else
            return res.status(200).json({
              message: "Fetched closed events",
              data: result,
            });
        });
      }
    }
  },
  getoneclosedEventDonors: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      console.log("request user data: ", req.userData);
      if (req.userData.role !== constants.role.red_cross) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function",
        });
      } else {
        let sql =
          "select (name,email,address) from donor d,blood b where d.donor_id=b.donor_id and b.event_id = ? ";
        let values = [[req.params.id]];
        db.query(sql, [values], function (err, result) {
          if (err)
            return res.status(500).json({
              err: "There is something wrong when querying",
            });
          else
            return res.status(200).json({
              message: "Fetched a closed event donors",
              data: result,
            });
        });
      }
    }
  },
  getrejectedEvents: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      console.log("request user data: ", req.userData);
      if (req.userData.role !== constants.role.red_cross) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function",
        });
      } else {
        let sql = "select * from event where status=?";
        let values = [[constants.rejected]];
        db.query(sql, [values], function (err, result) {
          if (err)
            return res.status(500).json({
              err: "There is something wrong when querying",
            });
          else
            return res.status(200).json({
              message: "Fetched rejected events",
              data: result,
            });
        });
      }
    }
  },
  getDonors: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      console.log("request user data: ", req.userData);
      if (req.userData.role !== constants.role.red_cross) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function",
        });
      } else {
        let sql = "select * from donor";
        db.query(sql, function (err, result) {
          if (err)
            return res.status(500).json({
              err: "There is something wrong when querying",
            });
          else
            return res.status(200).json({
              message: "Fetched pending orders",
              data: result,
            });
        });
      }
    }
  },
  store: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      console.log("request user data: ", req.userData);
      if (req.userData.role !== constants.role.red_cross) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function",
        });
      } else {
        let sql = "update blood set ? where status = ? and blood_id = ?";
        let values = [
          {
            status: constants.stored,
            amount: constants.standard_blood_donation_amount,
          },
          [constants.approved, req.params.id],
        ];
        db.query(sql, [values], function (err) {
          if (err)
            return res.status(500).json({
              err: "There is something wrong when querying",
            });
          else {
            let sql =
              "select blood_type from donor d,blood b where d.donor_id=b.donor_id and blood_id = ? ";
            let values = [[req.params.id]];
            db.query(sql, [values], function (err, result) {
              if (err)
                return res.status(500).json({
                  err: "There is something wrong when querying",
                });
              else {
                let sql =
                  "select bloodType from blood_store where bloodType = ? ";
                let values = [[result[0].blood_type]];
                db.query(sql, [values], function (err, resp) {
                  if (err)
                    return res.status(500).json({
                      err: "There is something wrong when querying",
                    });
                  else if (resp == null) {
                    let store_id = red_cross();
                    let sql = "insert into blood_store values = ? ";
                    let values = [
                      [
                        store_id,
                        req.userData.id,
                        result.blood_type,
                        constants.standard_blood_donation_amount,
                      ],
                    ];
                    db.query(sql, [values], function (err, resp1) {
                      if (err)
                        return res.status(500).json({
                          err: "There is something wrong when querying",
                        });
                      else
                        return res.status(200).json({
                          message: "stored blood",
                          data: resp1,
                        });
                    });
                  } else {
                    let sql =
                      "update blood_store set amount=amount+? where bloodType = ?";
                    let values = [
                      [
                        constants.standard_blood_donation_amount,
                        result[0].blood_type,
                      ],
                    ];
                    db.query(sql, [values], function (err, resp2) {
                      if (err)
                        return res.status(500).json({
                          err: "There is something wrong when querying",
                        });
                      else
                        return res.status(200).json({
                          message: "stored blood",
                          data: resp2,
                        });
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
  getbloodDonation: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      console.log("request user data: ", req.userData);
      // only organizer can create event
      if (req.userData.role !== constants.role.red_cross) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function",
        });
      } else {
        let sql = "select * from blood where status = ?";
        let values = [[constants.approved]];
        db.query(sql, [values], function (err, result) {
          if (err)
            return res.status(500).json({
              err: "There is something wrong when querying",
            });
          else
            return res.status(200).json({
              message: "Fetched blood donation",
              data: result,
            });
        });
      }
    }
  },
  getStore: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      console.log("request user data: ", req.userData);
      // only organizer can create event
      if (req.userData.role !== constants.role.red_cross) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function",
        });
      } else {
        let sql = "select * from blood_store where red_cross_id = ?";
        let values = [[req.userData.id]];
        db.query(sql, [values], function (err, result) {
          if (err)
            return res.status(500).json({
              err: "There is something wrong when querying",
            });
          else
            return res.status(200).json({
              message: "Fetched blood store",
              data: result,
            });
        });
      }
    }
  },
  getpendingEvents: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      console.log("request user data: ", req.userData);
      // only organizer can create event
      if (req.userData.role !== constants.role.red_cross) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function",
        });
      } else {
        let sql = "select * from event where status=?";
        let values = [[constants.pending]];
        db.query(sql, [values], function (err, result) {
          if (err)
            return res.status(500).json({
              err: "There is something wrong when querying",
            });
          else
            return res.status(200).json({
              message: "Fetched pending events",
              data: result,
            });
        });
      }
    }
  },
  getpendingOrders: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      console.log("request user data: ", req.userData);
      // only organizer can create event
      if (req.userData.role !== constants.role.red_cross) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function",
        });
      } else {
        let sql = "select * from order where status=?";
        let values = [[constants.pending]];
        db.query(sql, [values], function (err, result) {
          if (err)
            return res.status(500).json({
              err: "There is something wrong when querying",
            });
          else
            return res.status(200).json({
              message: "Fetched pending orders",
              data: result,
            });
        });
      }
    }
  },
  acceptEvents: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      console.log("request user data: ", req.userData);
      // only organizer can create event
      if (req.userData.role !== constants.role.red_cross) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function",
        });
      } else {
        let sql =
          "update event set status = ? where status = ? and event_id = ?";
        let values = [[constants.approved, constants.pending, req.params.id]];
        db.query(sql, [values], function (err, result) {
          if (err)
            return res.status(500).json({
              err: "There is something wrong when querying",
            });
          else
            return res.status(200).json({
              message: "approved event",
              data: result,
            });
        });
      }
    }
  },
  rejectEvents: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      console.log("request user data: ", req.userData);
      // only organizer can create event
      if (req.userData.role !== constants.role.red_cross) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function",
        });
      } else {
        let sql =
          "update event set status = ? where status = ? and event_id = ?";
        let values = [[constants.rejected, constants.pending, req.params.id]];
        db.query(sql, [values], function (err, result) {
          if (err)
            return res.status(500).json({
              err: "There is something wrong when querying",
            });
          else
            return res.status(200).json({
              message: "approved event",
              data: result,
            });
        });
      }
    }
  },
};
