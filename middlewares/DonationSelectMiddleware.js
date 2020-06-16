const db = require("../database/index");
const constants = require("../utils/constants");
module.exports = (req, res, next, cb) => {
  try {
    let sql =
      "select blood_id from blood where red_cross_id = ? and donor_id in (select donor_id from donor where blood_type = ?) and status = ? order by donate_date limit ?";

    let values = [
      req.userData.id,
      req.blood_type,
      constants.stored,
      Math.ceil(req.amount / constants.standard_blood_donation_amount),
    ];
    db.query(sql, values, function (err, result) {
      if (err)
        return res.status(500).json({
          err: err,
        });
      else {
        const resp = [];
        result.forEach((element) => {
          const blood_id_params = element.blood_id;
          const new_result = cb(req, res, blood_id_params);
          resp.push(new_result);
        });
        return res.status(200).json({
          message: "Accepted Order",
          data: resp,
        });
      }
    });
  } catch (error) {
    console.log("error", error);
    res.status(401).json({
      message: "Test failed",
    });
  }
};
