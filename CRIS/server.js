const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend files (index.html + admin.html)
app.use(express.static("public"));

// DATABASE
const db = new sqlite3.Database("./services.db");

// CREATE TABLE (runs automatically if not exists)
db.run(`
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  description TEXT,
  category TEXT,
  contact TEXT,
  address TEXT,
  website TEXT
)
`);

// =========================
// GET ALL SERVICES
// =========================
app.get("/services", (req, res) => {
  db.all("SELECT * FROM services", [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database error");
    }
    res.json(rows);
  });
});

// =========================
// CREATE NEW SERVICE (ADMIN)
// =========================
app.post("/services", (req, res) => {
  const { name, description, category, contact, address, website } = req.body;

  db.run(
    `INSERT INTO services (name, description, category, contact, address, website)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description, category, contact, address, website],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send("Insert error");
      }
      res.json({ id: this.lastID });
    }
  );
});

// =========================
// UPDATE SERVICE (ADMIN EDIT)
// =========================
app.put("/services/:id", (req, res) => {
  const { name, description, category, contact, address, website } = req.body;

  db.run(
    `UPDATE services 
     SET name=?, description=?, category=?, contact=?, address=?, website=? 
     WHERE id=?`,
    [name, description, category, contact, address, website, req.params.id],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send("Update error");
      }
      res.send("Service updated successfully");
    }
  );
});

// =========================
// DELETE SERVICE (ADMIN)
// =========================
app.delete("/services/:id", (req, res) => {
  db.run("DELETE FROM services WHERE id=?", [req.params.id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send("Delete error");
    }
    res.send("Service deleted successfully");
  });
});

// =========================
// START SERVER
// =========================
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});