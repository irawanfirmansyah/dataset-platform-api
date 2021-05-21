const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncMiddlware = require("../middleware/async-middleware");
const db = require("../../database");
const { response } = require("../../app");

/**
 * User Controllers
 *
 */

exports.get_all_user_task = asyncMiddlware(async (_, res) => {
  let sql = `SELECT * FROM user_task`;
  db.all(sql, function (err, rows) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json({
      user_tasks: rows,
    });
  });
});

exports.book_task = asyncMiddlware(async (req, res) => {
  db.get(
    "SELECT * FROM user WHERE id = ?",
    [req.body.user_id],
    function (err, row) {
      if (!row) {
        res.status(400).send({ message: "User doesn't exist." });
        return;
      }
      if (err) {
        res.status(500).send({ message: "Internal server error." });
        return;
      }
      let sqlGetTaskID = `SELECT id FROM task WHERE id = ?`;
      db.get(sqlGetTaskID, [req.body.task_id], function (err, row) {
        let taskId = null;
        if (!row) {
          res.status(400).send({ message: "Task doesn't exist." });
          return;
        }
        if (err) {
          res.status(500).send({ message: "Internal server error." });
          return;
        }
        taskId = row.id;
        let sqlInsertUserTask = `INSERT into user_task(user_id,task_id) VALUES(?,?)`;
        db.run(sqlInsertUserTask, [req.body.user_id, taskId], function (err) {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          res.status(200).json({
            message: "Task successfully booked",
          });
        });
      });
    }
  );
});

exports.revoke_task = asyncMiddlware(async (req, res) => {
  let sql = `
    DELETE FROM user_task
    WHERE user_id = ? AND task_id = ?;`;
  db.run(sql, [req.body.user_id, req.body.task_id], function (err) {
    if (err) {
      res.status(500).send({ message: "Internal server error." });
      return;
    }
    res.status(200).json({
      message: "Task successfully revoked",
    });
  });
});
