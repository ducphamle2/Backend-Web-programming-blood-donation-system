module.exports = (req, res, next) => {
  try {
    let blood_type_array = [
      "A+",
      "B+",
      "O+",
      "Rh+",
      "AB+",
      "A-",
      "B-",
      "O-",
      "Rh-",
      "AB-",
    ];
    let index = Math.floor(Math.random() * blood_type_array.length);
    req.blood_type = blood_type_array[index];
    console.log("req blood type: ", req.blood_type);
    next();
  } catch (error) {
    console.log("error", error);
    res.status(401).json({
      message: "Test failed",
    });
  }
};
