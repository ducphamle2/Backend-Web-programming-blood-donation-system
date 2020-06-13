const db = require("../../database/index");
const storeId = require("../../utils/utils").generateId;
const constants = require("../../utils/constants");
const { validationResult } = require("express-validator/check");

module.exports = {
  getAllApprovedEvents: (req, res) => {
    db.query(
      "select * from event where status = ?",
      [constants.approved],
      function (err, result) {
        if (err) {
          return res
            .status(500)
            .json({ error: "there is something wrong with the database" });
        } else {
          return res.status(200).json({ message: "success", data: result });
        }
      }
    );
  },
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
        let sql =
          "select o.*,h.name as hospital_name from blood_order o, hospital h where o.hospital_id=h.hospital_id";
        db.query(sql, function (err, result) {
          if (err)
            return res.status(500).json({
              err: err,
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
        let sql = "select * from event";
        db.query(sql, function (err, result) {
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
              message: "Fetched Donors",
              data: result,
            });
        });
      }
    }
  },
  getOrganizers: (req, res) => {
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
        let sql = "select * from organizer";
        db.query(sql, function (err, result) {
          if (err)
            return res.status(500).json({
              err: err,
            });
          else
            return res.status(200).json({
              message: "Fetched Organizers",
              data: result,
            });
        });
      }
    }
  },
  getHospitals: (req, res) => {
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
        let sql = "select * from hospital";
        db.query(sql, function (err, result) {
          if (err)
            return res.status(500).json({
              err: "There is something wrong when querying",
            });
          else
            return res.status(200).json({
              message: "Fetched Hospitals",
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
        let sql = "select blood_type from blood where blood_id = ? ";
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
                  if (err)
                    return res.status(500).json({
                      err: err,
                    });
                  else return store(req, res);
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
                  if (err)
                    return res.status(500).json({
                      err: err,
                    });
                  else return store(req, res);
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
        let values = [[constants.active]];
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
  getstoredbloodDonation: (req, res) => {
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
          "select b.*,d.name as donor_name,d.blood_type,e.name as event_name from blood b, donor d, event e where b.donor_id=d.donor_id and b.event_id=e.event_id";
        db.query(sql, function (err, result) {
          console.log("result", result);
          if (err)
            return res.status(500).json({
              err: err,
            });
          else
            return res.status(200).json({
              message: "Fetched stored blood donation",
              data: result,
            });
        });
      }
    }
  },
  getUntestedBloodDonation: (req, res) => {
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
              err: err,
            });
          else
            return res.status(200).json({
              message: "Fetched untested blood donation",
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
        let sql =
          "select d.blood_type,sum(b.amount) from blood b,donor d where b.donor_id=d.donor_id and red_cross_id = ? and b.status = ? group by d.blood_type";
        let values = [req.userData.id, constants.stored];
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
        let values = [constants.pending];
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
  acceptOrders: (req, res, next) => {
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
          "select amount,blood_type from blood_order where order_id = ?";
        let values = [req.params.id];
        db.query(sql, values, function (err, resp) {
          if (err)
            return res.status(500).json({
              err: err,
            });
          else {
            let sql =
              "select sum(b.amount) as amount from blood b, donor d where b.donor_id=d.donor_id and b.red_cross_id = ? and d.blood_type = ? and b.status = ? group by d.blood_type";
            let values = [
              req.userData.id,
              resp[0].blood_type,
              constants.stored,
            ];
            db.query(sql, values, function (err, result) {
              if (err) {
                console.log("err", err);
                return res.status(500).json({
                  err: err,
                });
              } else {
                console.log("blood_type", result);
                if (result.length === 0) {
                  return res.status(500).json({
                    err:
                      "there is no blood of type " +
                      resp[0].blood_type +
                      " in store",
                  });
                }
                let subAmount = result[0].amount - resp[0].amount;
                if (subAmount < 0)
                  return res.status(500).json({
                    err: "not enough blood of this type",
                  });
                else {
                  // let sql =
                  //   "select b.*,d.name as donor_name,e.name as event_name,e.location,e.event_date from blood b,donor d,event e where b.donor_id = d.donor_id and b.event_id=e.event_id and b.red_cross_id = ? and d.blood_type = ? and b.status = ? order by donate_date";
                  // let values = [
                  //   req.userData.id,
                  //   resp[0].blood_type,
                  //   constants.stored,
                  // ];
                  // db.query(sql, values, function (err, result) {
                  //   if (err)
                  //     return res.status(500).json({
                  //       err: err,
                  //     });
                  //   else {
                  //     return res.status(200).json({
                  //       message: "Accepted Order",
                  //       data: result,
                  //       number: Math.ceil(
                  //         req.body.amount /
                  //           constants.standard_blood_donation_amount
                  //       ),
                  //     });
                  //   }
                  // });
                  let sql =
                    "update blood_order set status=?,red_cross_id=? where order_id=?";
                  let values = [
                    constants.approved,
                    req.userData.id,
                    req.params.id,
                  ];
                  db.query(sql, values, function (err, resp2) {
                    if (err)
                      return res.status(500).json({
                        err: err,
                      });
                    else {
                      if (process.env.ENVIRONMENT !== "PRODUCTION") {
                        req.amount = resp[0].amount;
                        req.blood_type = resp[0].blood_type;
                        next();
                      } else
                        return res.status(200).json({
                          message: "Accepted Order",
                          data: result,
                        });
                    }
                  });
                }
              }
            });
          }
        });
      }
    }
  },
  // let sql =
  //   "update blood set status=?,order_id=? where red_cross_id = ? and blood_type = ? and status = ? order by donate_date limit ?";
  // let values = [
  //   constants.active,
  //   req.params.id,
  //   req.userData.id,
  //   resp[0].blood_type,
  //   constants.stored,
  //   Math.ceil(
  //     resp[0].amount / constants.standard_blood_donation_amount
  //   ),
  // ];
  // db.query(sql, values, function (err, result) {
  //   if (err)
  //     return res.status(500).json({
  //       err: err,
  //     });
  //   else {
  //     let sql =
  //       "update blood_order set status = ? where status = ? and order_id = ?";
  //     let values = [
  //       constants.approved,
  //       constants.pending,
  //       req.params.id,
  //     ];
  //     db.query(sql, values, function (err, result) {
  //       if (err)
  //         return res.status(500).json({
  //           err: err,
  //         });
  //       else
  issueDonation(req, res) {
    let sql =
      "update blood set status = ?,order_id = ? where red_cross_id = ? and blood_id = ? and status = ?";

    let values = [
      constants.active,
      req.params.id,
      req.userData.id,
      req.blood_id,
      constants.stored,
    ];
    // let sql =
    //   "select blood_id from blood where red_cross_id = ? and donor_id in (select donor_id from donor where blood_type = ?) and status = ? order by donate_date limit ?";

    // let values = [
    //   constants.active,
    //   req.params.id,
    //   req.userData.id,
    //   resp[0].blood_type,
    //   constants.stored,
    //   Math.ceil(req.body.amount / constants.standard_blood_donation_amount),
    // ];
    db.query(sql, values, function (err, result) {
      if (err)
        return res.status(500).json({
          err: err,
        });
      else {
        return res.status(200).json({
          message: "Accepted Order",
          data: result,
        });
      }
    });
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
        let values = [constants.rejected, constants.approved, req.params.id];
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
  bannedAccount: (req, res) => {
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
        const role_id = req.body.role + "_id";
        let sql = "update ?? set status = ? where status = ? and ??  = ?";
        let values = [
          req.body.role,
          constants.rejected,
          constants.active,
          role_id,
          req.params.id,
        ];
        db.query(sql, values, function (err, result) {
          if (err)
            return res.status(500).json({
              err: err,
            });
          else
            return res.status(200).json({
              message: "rejected donor",
              data: result,
            });
        });
      }
    }
  },
  reactivateAccount: (req, res) => {
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
        const role_id = req.body.role + "_id";
        let sql = "update ?? set status = ? where status = ? and ?? = ?";
        let values = [
          req.body.role,
          constants.active,
          constants.rejected,
          role_id,
          req.params.id,
        ];
        db.query(sql, values, function (err, result) {
          if (err)
            return res.status(500).json({
              err: err,
            });
          else
            return res.status(200).json({
              message: "reactivated donor",
              data: result,
            });
        });
      }
    }
  },
  testBlood: (req, res) => {
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
        let sql = "select donor_id from blood where blood_id = ?";
        let values = [req.params.id];
        db.query(sql, values, function (err, resp) {
          if (err)
            return res.status(500).json({
              err: err,
            });
          else {
            let sql = "select blood_type from donor where donor_id = ?";
            let values = [resp[0].donor_id];
            db.query(sql, values, function (err, resp1) {
              if (err)
                return res.status(500).json({
                  err: err,
                });
              else if (resp1[0].blood_type === null) {
                let sql =
                  "update blood set status = ?,red_cross_id = ? where status = ? and blood_id = ?";
                let values = [
                  constants.stored,
                  req.userData.id,
                  constants.pending,
                  req.params.id,
                ];
                db.query(sql, values, function (err, result) {
                  if (err)
                    return res.status(500).json({
                      err: err,
                    });
                  else {
                    let sql =
                      "update donor set blood_type = ? where donor_id = ?";
                    let values = [req.blood_type, resp[0].donor_id];
                    db.query(sql, values, function (err, resp1) {
                      if (err)
                        return res.status(500).json({
                          err: err,
                        });
                      else
                        return res.status(200).json({
                          message: "tested blood",
                          data: resp1,
                        });
                    });
                  }
                });
              } else {
                let sql =
                  "update blood set status = ?,red_cross_id = ? where status = ? and blood_id = ?";
                let values = [
                  constants.stored,
                  req.userData.id,
                  constants.pending,
                  req.params.id,
                ];
                db.query(sql, values, function (err, result) {
                  if (err)
                    return res.status(500).json({
                      err: err,
                    });
                  else {
                    return res.status(200).json({
                      message: "tested and stored blood",
                      data: result,
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
  viewDonationList(req, res) {
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
          "select b.*,d.name from blood b,donor d where b.donor_id=d.donor_id and b.red_cross_id = ? and b.order_id = ? and b.status = ? order by b.donate_date";
        let values = [req.userData.id, req.params.id, constants.active];
        db.query(sql, values, function (err, result) {
          if (err)
            return res.status(500).json({
              err: err,
            });
          else {
            return res.status(200).json({
              message: "issued donations",
              data: result,
            });
          }
        });
      }
    }
  },
};
