module.exports = (req, res, next, cb) => {
  try {
    let sql =
      "select blood_id from blood where red_cross_id = ? and donor_id in (select donor_id from donor where blood_type = ?) and status = ? order by donate_date limit ?";

    let values = [
      constants.active,
      req.params.id,
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
        result.array.forEach((element) => {
          req.blood_id = element.blood_id;
          cb(req, res);
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
