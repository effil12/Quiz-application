const btn = document.querySelector("#btn");
const footer = document.querySelector("#footer")
const divNode = document.createElement("div")
let param = Number(document.querySelector("#param").innerText);
let answers = document.getElementById("options");
let scoreDiv = document.getElementById('score')
let score = Number(scoreDiv.innerText)
let rightAnswer = null

async function failure(wrongAnswer, correctValue) {
  for (let element of answers.children) {
    element.style.cursor = "auto"
    if (element === wrongAnswer){
      element.id = "wrong-answer"
    } else if (element.innerText == correctValue) {
      element.id = "right-answer"
      element.removeEventListener("click", onClick)
    } else {
      element.setAttribute("Disabled", "")
    }
  }
}
async function success(correctAnswer, points) {
  const textNode = document.createTextNode(`+${points}`)
  rightAnswer = correctAnswer.innerText

  for (let element of answers.children) {
    if (element != correctAnswer) {
      element.setAttribute("Disabled", "")
    }
  }
  correctAnswer.id = "right-answer";
  
  score += points
  divNode.id = "points-anim"
  divNode.appendChild(textNode)
  footer.insertBefore(divNode, footer.children[1])
  setTimeout(() => {
    divNode.style.display = "none"
  }, 2000) 
  scoreDiv.innerText = score
  
}

async function onClick(e) {
    const eventTrigger = e.target;

    btn.removeAttribute("disabled")
    btn.style.cursor = "pointer"

    try {
      let response = await fetch(`/api/premade-quiz/${param}`);
      if (response.ok) {
        let data = await response.json();
        let points = data.points
        let correctIndex = data.correctIndex;
        let correctAnswer = data.answers[correctIndex];
        

        if (correctAnswer != eventTrigger.innerText) {
          failure(eventTrigger, correctAnswer);
          return
        } else {
          console.log(eventTrigger.innerText)
          success(eventTrigger, points);
          return
        }
      }
    } catch (err) {
      console.log(err);
    }
    finally {
      eventTrigger.removeEventListener("click", onClick)
    }
}

for (let elem of answers.children) {
  elem.addEventListener("click", onClick);
}

btn.addEventListener("click", async () => {
  await Promise.all([
    fetch("/api/current-page", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
          currentPath: `/premade-quiz/${param + 1}`
      }),
      headers: {
          'Content-Type': 'application/json'
      }
    }),
    fetch(`/premade-quiz/stats`, {
      method: "POST",
      body: JSON.stringify({
        score: score,
        rightAnswer: rightAnswer,
      }),
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      }
    })
  ])
  window.location.pathname = `/premade-quiz/${param + 1}`;
});
