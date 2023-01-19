const techButton = document.getElementById("btn")
const customButton = document.getElementById("btn-custom")
const container = document.querySelector(".container")

techButton.addEventListener("click", async () => {
    await fetch("/api/current-page", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
            currentPath: "/premade-quiz/1"
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    window.location.pathname = "/premade-quiz/1"
})

customButton.addEventListener("click", (e) => {
    container.innerHTML = `
    <form action="/api/createCustomQuiz" method="post">
    <label for="title">Title</label>
    <input id="title" type="text" placeholder="Question" name="title" Required>
    <div class="wrong-div">
        <label for="wrong-answers">Wrong Answers</label>
        <input type="text" id="wrong-answers" placeholder="Wrong Answer" name="wrongAnswer" Required>
        <input type="text" id="wrong-answers" placeholder="Wrong Answer" name="wrongAnswer">
        <input type="text" id="wrong-answers" placeholder="Wrong Answer" name="wrongAnswer">
        <input type="text" id="wrong-answers" placeholder="Wrong Answer" name="wrongAnswer">
    </div>
    <div class="correct-div">
        <label for="correct-answer">Correct Answer</label>
        <input type="text" id="correct-answer" placeholder="The Correct Answer" name="correctAnswer" Required>
    </div>
    <label for="poinst">Points</label>
    <input type="number" id="points" name="points" Required>
    <input type="submit" id="points">
</form>
<button type="button" value="button" id="btn">Next</button>
    `
})