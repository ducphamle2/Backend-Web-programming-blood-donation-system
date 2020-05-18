const db = require("../../database/index");
const bloodOrderId = require("../../utils/utils").generateId;
const constants = require("../../utils/constants");
const { validationResult } = require("express-validator/check");

module.exports = {
  createOrder: (req, res) => {
    //TODO: Fix function complication
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      console.log("request user data: ", req.userData);
      //only hospital can create blood order
      if (req.userData.role !== constants.role.hospital) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function",
        });
      } else {
        //get hospital - red cross info
        db.query(
          "select * from hospital where hospital_id = ?",
          [req.userData.id],
          function (err, result) {
            if (err) return res.status(500).json({ error: err });
            //let date = Date.now();
            let order_id = bloodOrderId();
            let values = [
              [
                order_id,
                req.userData.id,
                null,
                Math.round(new Date().getTime() / 1000),
                req.body.amount,
                req.body.blood_type,
                constants.pending,
              ],
            ];

            db.query("insert into blood_order values ?", [values], function (
              err,
              result
            ) {
              if (err) return res.status(500).json({ error: err });

              return res.status(200).json({
                message: "Your order has been created successfully",
                order_id: order_id,
              });
            });
          }
        );
      }
    }
  },

  updateOrderInfo: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      if (req.userData.role !== constants.role.hospital) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function",
        });
      } else {
        db.query(
          "select * from blood_order where order_id = ?",
          [req.body.order_id],
          function (err, result) {
            if (result.length === 0) {
              return res.status(404).json({
                error: "Cannot find the order",
              });
            } else if (err) {
              return res.status(500).json({ error: err });
            } else {
              let values = {
                order_date: req.body.date,
                amount: req.body.amount,
                blood_type: req.body.blood_type,
              };
              db.query(
                "update blood_order set ? where order_id = ?",
                [values, req.body.order_id],
                function (err, result) {
                  if (err) {
                    return res.status(500).json({ error: err });
                  } else if (result.affectedRows === 0) {
                    return res.status(404).json({
                      error: "Cannot find order id",
                    });
                  } else {
                    return res.status(200).json({
                      message: "Updated successfully",
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  },

  updateOrderStatus: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      if (req.userData.role !== constants.role.red_cross) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function",
        });
      } else {
        db.query(
          "select * from blood_order where order_id = ?",
          [req.body.order_id],
          function (err, result) {
            if (result.length === 0) {
              return res.status(404).json({
                error: "Cannot find the order",
              });
            } else if (err) {
              return res.status(500).json({ error: err });
            } else {
              let values = {
                order_date: req.body.date,
                amount: req.body.amount,
                blood_type: req.body.blood_type,
              };
              db.query(
                "update blood_order set ? where order_id = ?",
                [values, req.body.order_id],
                function (err, result) {
                  if (err) {
                    return res.status(500).json({ error: err });
                  } else if (result.affectedRows === 0) {
                    return res.status(404).json({
                      error: "Cannot find order id",
                    });
                  } else {
                    return res.status(200).json({
                      message: "Updated successfully",
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  },

  deleteOrder: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      if (req.userData.role !== constants.role.hospital) {
        return res.status(403).json({
          error: "Forbidden !! You are not allowed to call this function!",
        });
      } else {
        db.query(
          "select * from blood_order where order_id = ?",
          [req.body.order_id],
          function (err, result) {
            if (result.length === 0) {
              return res.status(404).json({
                error: "Cannot find the order",
              });
            } else if (err) {
              return res.status(500).json({
                error: err,
              });
            } else {
              db.query(
                "delete from blood_order where order_id = ?",
                [req.body.order_id],
                function (err, result) {
                  if (err) {
                    return res.status(500).json({ error: err });
                  } else if (result.affectedRows === 0) {
                    return res.status(404).json({ error: err });
                  } else return res.status(200).json({ message: "Deleted" });
                }
              );
            }
          }
        );
      }
    }
  },

  searchOrderWithDate: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      db.query(
        "select * from blood_order where order_date = ?",
        [req.body.order_date],
        function (err, result) {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            return res.status(200).json({
              message: "Query successful",
              data: result,
            });
          }
        }
      );
    }
  },

  //TODO: limit, offset (pagnitation)
  getAllOrders: (req, res) => {
    if (req.userData.role === constants.role.hospital) {
      let sql = "select * from blood_order where hospital_id = ?";
    } else if (req.userData.role === constants.role.red_cross) {
      let sql = "select * from blood_order where red_cross_id = ?";
    }
    db.query(sql, [req.userData.id], function (err, result) {
      if (err) return res.status(500).json({ error: err });
      return res.status(200).json({ message: "success", data: result });
    });
  },
};
