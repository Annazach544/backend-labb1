const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3000;

const db = new sqlite3.Database("./database/cv.db");

app.use(express.static("public"));
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

// Start application
app.listen(port, () => {
    console.log("Server is started on port: " + port);
});
