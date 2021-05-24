const db = require("../../database");
const asyncMiddlware = require("../middleware/async-middleware");
const path = require("path");
const jwt = require("jsonwebtoken");

/**
 * Task Controllers
 *
 */

exports.get_all_task = asyncMiddlware(async (_, res) => {
  let sql = `SELECT * FROM task`;
  db.all(sql, function (err, rows) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json({
      tasks: rows,
    });
  });
});

exports.task_upload = asyncMiddlware(async (req, res) => {
  let file = req.files.dataset;
  let zipFormats = ["application/x-zip-compressed", "application/zip"]
  if (!zipFormats.includes(file.mimetype)) {
    res.status(500).send({
      error:
        "Can't upload file type : " +
        file.mimetype +
        ". Please upload zip file",
    });
    return;
  }

  const insert =
    "INSERT INTO task (name, file_path, is_deleted, delete_date) VALUES(?,?,?,?)";
  db.run(
    insert,
    [req.body.name, "uploads/" + file.name, 0, null],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      let uploadPath = path.join(__dirname, "../../uploads", file.name);
      file.mv(uploadPath, function (err) {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(201).json({
          message: "File successfully uploaded",
        });
      });
    }
  );
});

exports.delete_task = asyncMiddlware(async function (req, res) {
  let sql = `
    UPDATE task
    SET is_deleted = 1, delete_date = datetime('now')
    WHERE id = ?
    `;
  db.run(sql, [req.params.id], function (err) {
    if (err) {
      response.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json({
      message: "Task successfully deleted",
    });
  });
});

exports.download_task = asyncMiddlware(async function (req, res) {
  let sql = `SELECT file_path FROM task WHERE id = ?;`;
  db.get(sql, [req.query.task_id], function (err, row) {
    if (err) {
      res.status(500).send({ message: "Internal server error" });
      return;
    }
    if (!row) {
      res.status(400).json({
        message: "Task doesn't exist.",
      });
      return;
    }
    const filePath = path.join(__dirname, "../../", row.file_path);
    res.download(filePath);
  });
});

exports.get_booked_task = asyncMiddlware(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  var decoded = jwt.verify(token, process.env.JWT_KEY);
  let sql = `
  SELECT t.id as task_id, ut.user_id as user_id, t.name, t.file_path, t.is_deleted
  FROM task t
  LEFT JOIN user_task ut
  ON t.id = ut.task_id AND ut.user_id = ${decoded.id}
  WHERE t.is_deleted = 0;
  `;

  db.all(sql, [req.query.user_id], function (err, rows) {
    if (err) {
      res.status(500).send({ message: "Internal server error." });
      return;
    }
    res.status(200).json({
      result: rows,
    });
  });
});
