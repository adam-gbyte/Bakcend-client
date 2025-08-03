const db = require("../config/db");

exports.findByUsername = async (username) => {
  const [rows] = await db.query("SELECT * FROM admin WHERE username = ?", [username]);
  return rows[0];
};

exports.createUser = async (username, password, role) => {
  const [result] = await db.query(
    "INSERT INTO admin (username, password) VALUES (?, ?)",
    [username, password, role]
  );
  return result.insertId;
};
