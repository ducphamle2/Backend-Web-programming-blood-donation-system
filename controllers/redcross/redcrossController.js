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
          constants.pending,
          req.params.id,
        ];
        db.query(sql, values, function (err) {
          if (err)
            return res.status(500).json({
              err: err,
            });
          else {
            let sql =
              "select blood_type from donor d,blood b where d.donor_id=b.donor_id and blood_id = ? ";
            let values = [[req.params.id]];
            console.log("res", values);
            db.query(sql, [values], function (err, result) {
              if (err)
                return res.status(500).json({
                  err: err,
                });
              else {
                let sql =
                  "select bloodType from blood_store where bloodType = ? and red_cross_id = ?";
                let values = [result[0].blood_type, req.userData.id];
                console.log("res2", result);
                db.query(sql, values, function (err, resp) {
                  console.log("res3", resp);
                  if (err)
                    return res.status(500).json({
                      err: err,
                    });
                  else if (resp.length === 0) {
                    let store_id = storeId();
                    let sql =
                      "insert into blood_store (store_id,red_cross_id,bloodType,amount) values ? ";
                    let values = [
                      [
                        store_id,
                        req.userData.id,
                        result[0].blood_type,
                        constants.standard_blood_donation_amount,
                      ],
                    ];
                    db.query(sql, [values], function (err, resp1) {
                      console.log("res4", resp1);
                      if (err)
                        return res.status(500).json({
                          err: err,
                        });
                      else
                        return res.status(200).json({
                          message: "stored blood",
                          data: resp1,
                        });
                    });
                  } else {
                    let sql =
                      "update blood_store set amount=amount+? where bloodType = ? and red_cross_id = ?";
                    let values = [
                      constants.standard_blood_donation_amount,
                      result[0].blood_type,
                      req.userData.id,
                    ];
                    db.query(sql, values, function (err, resp2) {
                      console.log("res6", resp2);
                      if (err)
                        return res.status(500).json({
                          err: err,
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
        let values = [[constants.pending]];
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
        db.query(sql, values, function (err, result) {
          console.log(result);
          if (err)
            return res.status(500).json({
              err: err,
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
        let sql =
          "select h.name,o.* from blood_order o, hospital h where o.hospital_id=h.hospital_id and o.status=?";
        let values = [[constants.pending]];
        db.query(sql, [values], function (err, result) {
          if (err)
            return res.status(500).json({
              err: err,
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
  acceptOrders: (req, res) => {
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
          "update blood_order set status = ? where status = ? and order_id = ?";
        let values = [constants.approved, constants.pending, req.params.id];
        db.query(sql, values, function (err, result) {
          if (err)
            return res.status(500).json({
              err: "There is something wrong when querying",
            });
          else
            return res.status(200).json({
              message: "approved order",
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
        let values = [constants.approved, constants.pending, req.params.id];
        db.query(sql, values, function (err, result) {
          if (err)
            return res.status(500).json({
              err: err,
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
        let values = [constants.rejected, constants.pending, req.params.id];
        db.query(sql, values, function (err, result) {
          if (err)
            return res.status(500).json({
              err: "There is something wrong when querying",
            });
          else
            return res.status(200).json({
              message: "rejected event",
              data: result,
            });
        });
      }
    }
  },
  rejectOrders: (req, res) => {
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
          "update blood_order set status = ? where status = ? and order_id = ?";
        let values = [constants.rejected, constants.pending, req.params.id];
        db.query(sql, values, function (err, result) {
          if (err)
            return res.status(500).json({
              err: "There is something wrong when querying",
            });
          else
            return res.status(200).json({
              message: "rejected order",
              data: result,
            });
        });
      }
    }
  },
  rejectDonation: (req, res) => {
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
          "update blood set status = ? where status = ? and blood_id = ?";
        let values = [constants.rejected, constants.pending, req.params.id];
        db.query(sql, values, function (err, result) {
          if (err)
            return res.status(500).json({
              err: "There is something wrong when querying",
            });
          else
            return res.status(200).json({
              message: "rejected donation",
              data: result,
            });
        });
      }
    }
  },
};
