const express = require("express")
const app = express()
const port = 8080
const premade = require("./routes/premade")
const api = require("./routes/api").router
const session = require("express-session")
const { totalPoints, checkCurrentPath }  = require("./routes/api")
const methodOverride = require('method-override')
let questions = require("./questions.json")

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded( { extended: true} ))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}))
app.use("/premade-quiz", premade)
app.use("/api", api)

app.get("/", function (req, res) {
    res.render("home")
})

app.get("/results/premade-quiz", checkCurrentPath, function (req, res) {
    let rightAnswers = req.session.rightAnswers.filter(element => {
        return typeof element == "string"
    })
    let i = 0

    while (i < Object.keys(questions).length) {
        if (req.session.rightAnswers[i] == questions[i + 1].answers[questions[i + 1].correctIndex]) {
            questions[i + 1]["userGuessedCorrectly"] = true
        }
        i++
    }
    res.render("results", {
        quiz: {
            score: req.session.points || 0,
            totalQuizPoints: totalPoints(),
            questions: questions,
            rightAnswers: rightAnswers,
        }
    })
})

app.delete("/result", function (req, res) {
    if (req.session) {
        for (let key in questions) {
            questions[key]["userGuessedCorrectly"] = false
        }
        req.session.destroy((err) => {
            if (err) {
                console.log(err)
                return
            } else {
                req.session = null
            }
        })
        res.redirect("/")
    }
})

app.all("*", function (req, res) {
    res.redirect("/")
})

app.listen(port, function () {
    var datetime = new Date();
    var message = "Server running on Port:- " + port + " Started at :- " + datetime;
    console.log(message);
})