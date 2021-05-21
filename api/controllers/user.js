const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncMiddlware = require("../middleware/async-middleware");
const db = require("../../database");

/**
 * User Controllers
 *
 */

exports.user_login = asyncMiddlware(async (req, res) => {
  db.get(
    "SELECT * FROM user WHERE email LIKE ?;",
    [req.body.email],
    async (err, row) => {
      if (err || !row) {
        res.status(400).json({
          message: "Wrong username or password. Try again.",
        });
        return;
      }

      const match = await bcrypt.compare(req.body.password, row.password);
      if (!match) {
        res.status(400).json({
          message:
            "Login failed. The password you've entered is incorrect. Try again.",
        });
        return;
      }

      const token = jwt.sign(
        {
          email: row.email,
          id: row.id,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({
        message: "Authentication Successful",
        user: { id: row.id, name: row.name, email: row.email },
        token: token,
      });
    }
  );
});
