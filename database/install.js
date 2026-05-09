const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/cv.db");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            coursecode TEXT NOT NULL,
            coursename TEXT NOT NULL,
            syllabus TEXT NOT NULL,
            progression TEXT NOT NULL,
            created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        )
    `);

    console.log("Databasen och tabellen courses är skapad.");
});

db.close();