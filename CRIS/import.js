const fs = require("fs");
const csv = require("csv-parser");
const sqlite3 = require("sqlite3").verbose();

// Connect to database
const db = new sqlite3.Database("./services.db");

// Read CSV file
fs.createReadStream("services.csv")
  .pipe(csv())
  .on("data", (row) => {
    // Insert each row into database
    db.run(
      `INSERT INTO services (name, description, category, contact, address, website)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        row.name,
        row.description,
        row.category,
        row.contact,
        row.address,
        row.website
      ],
      (err) => {
        if (err) {
          console.error("❌ Error inserting row:", err.message);
        }
      }
    );
  })
  .on("end", () => {
    console.log("✅ Data imported successfully!");
    db.close();
  });