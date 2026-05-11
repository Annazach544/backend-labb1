// Importera paket
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

// Skapa Express-applikation
const app = express();
const port = 3000;

// Anslut till SQLite-databasen
const db = new sqlite3.Database("./database/cv.db");

// Använd public-mappen för CSS och andra statiska filer
app.use(express.static("public"));

// Hantera formulärdata från POST-förfrågningar
app.use(express.urlencoded({ extended: true }));

// Använd EJS som view engine
app.set("view engine", "ejs");


// Routing för startsidan och visning av kurser
app.get("/", (req, res) => {

    // Hämta alla kurser från databasen
    db.all("SELECT * FROM courses ORDER BY id DESC", [], (err, rows) => {

        if (err) {
            console.error(err.message);
            return res.send("Fel vid hämtning av kurser.");
        }

        // Skicka kurser till index-sidan
        res.render("index", {
            courses: rows
        });

    });

});


// Routing för formulärsidan
app.get("/add", (req, res) => {
    res.render("add", { errors: [] });
});


// Routing för att spara nya kurser
app.post("/add", (req, res) => {

    // Hämta formulärdata
    const { coursecode, coursename, syllabus, progression } = req.body;

    let errors = [];

    // Validering av formulärfält
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

    // Visa felmeddelanden om något saknas
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

            // Skicka tillbaka användaren till startsidan
            res.redirect("/");
        }
    );

});


// Routing för about-sidan
app.get("/about", (req, res) => {
    res.render("about");
});


// Routing för att radera en kurs
app.get("/delete/:id", (req, res) => {

    // Hämta id från URL
    const id = req.params.id;

    // Radera kurs från databasen
    db.run("DELETE FROM courses WHERE id = ?", [id], (err) => {

        if (err) {
            console.error(err.message);
            return res.send("Fel vid radering.");
        }

        // Uppdatera startsidan efter radering
        res.redirect("/");
    });

});


// Starta servern
app.listen(port, () => {
    console.log("Server is started on port: " + port);
});
