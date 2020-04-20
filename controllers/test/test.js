var db = require('../../database/index')

module.exports = {
  test: (req, res) => {
    db.query("SELECT * from mydb.donor", function (err, result) {
      if (err) {
        return res.status(400).json({
          message: "Error connecting to database" + err,
        });
      }
      console.log("result query: ", result)
      return res.status(200).json({
        message: "Test successfully",
      });
    });
  },
};
