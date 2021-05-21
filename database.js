const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const DBSOURCE = "db.sqlite";

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    db.run(
      `CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            email text UNIQUE,
            password text,
            CONSTRAINT email_unique UNIQUE (email)
            );
            `,
      async (err) => {
        if (err) {
          // do nothing, table created
        } else {
          // Table just created, add some user
          const password1 = await bcrypt.hash("admin123456", 10);
          const password2 = await bcrypt.hash("admin123456", 10);
          const insert =
            "INSERT INTO user (name, email, password) VALUES (?,?,?)";
          db.run(insert, ["admin", "admin@example.com", password1]);
          db.run(insert, ["user", "user@example.com", password2]);
        }
      }
    );
  }
});

db.run(`CREATE TABLE IF NOT EXISTS task (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name text,
    file_path text,
    is_deleted INTEGER,
    delete_date text
)`);

db.run(`CREATE TABLE IF NOT EXISTS user_task (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    task_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES user(id),
    FOREIGN KEY(task_id) REFERENCES task(id),
    UNIQUE(user_id, task_id)
)`);

module.exports = db;
