const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3000;

const db = new sqlite3.Database("./database/cv.db");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Routing 
app.get("/", (req, res) => {

    db.all("SELECT * FROM courses ORDER BY id DESC", [], (err, rows) => {

        if (err) {
            console.error(err.message);
            return res.send("Fel vid hämtning av kurser.");
        }

        res.render("index", {
            courses: rows
        });

    });

});

app.get("/add", (req, res) => {
    res.render("add", { errors: [] });
});

// Routing för att spara kurser
app.post("/add", (req, res) => {

    const { coursecode, coursename, syllabus, progression } = req.body;

    let errors = [];

    // Validering
    if (!coursecode) {
        errors.push("Kurskod måste fyllas i.");
    }

    if (!coursename) {
        errors.push("Kursnamn måste fyllas i.");
    }

    if (!syllabus) {
        errors.push("Kursplan måste fyllas i.");
    }

    if (!progression) {
        errors.push("Progression måste fyllas i.");
    }

    // Visa felmeddelanden 
    if (errors.length > 0) {
        return res.render("add", {
            errors: errors
        });
    }

    // Spara kursen i databasen 
    db.run(
        `INSERT INTO courses(coursecode, coursename, syllabus, progression)
         VALUES (?, ?, ?, ?)`,
        [coursecode, coursename, syllabus, progression],
        (err) => {

            if (err) {
                console.error(err.message);
                return res.send("Fel vid lagring av kurs.");
            }

            res.redirect("/");
        }
    );

});

// Starta appen
app.listen(port, () => {
    console.log("Server is started on port: " + port);
});

// Routing för att radera kurser
app.get("/delete/:id", (req, res) => {

    const id = req.params.id;

    db.run("DELETE FROM courses WHERE id = ?", [id], (err) => {

        if (err) {
            console.error(err.message);
            return res.send("Fel vid radering.");
        }

        res.redirect("/");
    });

});