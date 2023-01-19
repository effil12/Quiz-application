const express = require("express")
const fs = require("fs")
let questions = require("../questions.json")
var router = express.Router()

router.get("/premade-quiz/:question", (req, res) => {
    const question = req.params.question
    res.send(questions[question])
})

router.post("/current-page", function (req, res) {
    req.session.currentPath = req.body.currentPath

    res.status(201).send()
})

router.post("/createCustomQuiz", async function (req, res) {
    try {
        await new Promise((resolve, reject) => {
            fs.readFile("text.json", "utf-8", (err, data) => {
                if (err) {
                    console.log(`An error has occured : ${err.message}`)
                    reject("Error in fs.readFile")
                } else {
                    if (data) {
                        console.log(typeof data, data)
                        const savedQuestions = JSON.parse(data)
                        savedQuestions[Object.keys(savedQuestions).length + 1] = req.body
                        console.log(savedQuestions)
    
                        fs.writeFile("text.json", JSON.stringify(savedQuestions, null, 2), (err, bytes) => {
                            if (err) {
                                console.log(err)
                                reject("Error in fs.writeFile (saved questions)")
                            } else {
                                console.log("There is saved data")
                                resolve()
                            }
                        })
                    } else {
                        const rootObj = {}
                        rootObj["1"] = req.body
                        fs.writeFile("text.json", JSON.stringify(rootObj, null, 2), (err, bytes) => {
                            console.log(typeof data, data)
                            if (err) {
                                console.log(err)
                                reject("Error in fs.writeFile (no saved questions)")
                            } else {
                                console.log("There was no saved data")
                                resolve()
                            }
                        })
                    }
                }
            })
        })
    } catch (error) {
        console.log(error)
    }
    console.log("After fs")
    res.status(201)
    res.redirect(`/premade-quiz/1`)
})

function totalPoints() {
    const pointsArr = new Array()

    for (let key in questions) {
        pointsArr.push(questions[key].points)
    }
    return pointsArr.reduce((total, value) => {
        return total + value
    })
}

function checkCurrentPath(req, res, next) {
    if (typeof req.session.currentPath == "undefined") {
        return res.redirect("/")
    }
    else if (req.session.currentPath != req.originalUrl) {
        return res.redirect(req.session.currentPath)
    } else {
        next()
    }
}

module.exports = { router: router, totalPoints: totalPoints, checkCurrentPath: checkCurrentPath }