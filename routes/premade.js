const express = require("express")
const { totalPoints } = require("./api")
const { checkCurrentPath } = require("./api")
let questions = require("../questions.json")
let questionsLength = Object.keys(questions).length
var router = express.Router()

router.get("/:question", checkCurrentPath, function (req, res) {
    const question = req.params.question
    console.log("IN QUESTION")
    
    if (question <= Object.keys(questions).length) {
        res.render("quiz", {
            data: {
                question: questions[question],
                param: question,
                questionsLength: questionsLength,
                score: req.session.points || 0,
                totalPoints: totalPoints()
            }
        })
    } else {
        req.session.currentPath = "/results/premade-quiz"
        res.redirect("/results/premade-quiz")
    }
})

router.post("/stats", statistics)

function statistics(req, res) {
    const points = req.body.score
    const rightAnswer = req.body.rightAnswer

    if (!req.session.rightAnswers) {
        req.session.rightAnswers = []
    }
    if (!req.session.points) {
        req.session.points = 0
    }

    req.session.points = points
    req.session.rightAnswers.push(rightAnswer)
    res.status(201).send("Stats recieved")

}

module.exports = router