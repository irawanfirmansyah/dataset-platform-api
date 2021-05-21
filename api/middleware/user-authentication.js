const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //Get token from header
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY);
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not Authorized",
    });
  }
};
