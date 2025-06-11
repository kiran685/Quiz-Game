const questions = [
  {
    question: "What is the capital of France?",
    choices: ["Paris", "London", "Rome", "Berlin"],
    answer: "Paris",
    category: "Geography",
    difficulty: "Easy"
  },
  {
    question: "Which planet is known as the Red Planet?",
    choices: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
    category: "Science",
    difficulty: "Easy"
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    choices: ["William Shakespeare", "Charles Dickens", "Mark Twain", "Jane Austen"],
    answer: "William Shakespeare",
    category: "Literature",
    difficulty: "Medium"
  },
  {
    question: "Which gas do plants absorb from the atmosphere?",
    choices: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    answer: "Carbon Dioxide",
    category: "Science",
    difficulty: "Easy"
  },
  {
    question: "What is the largest ocean on Earth?",
    choices: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    answer: "Pacific Ocean",
    category: "Geography",
    difficulty: "Medium"
  },
  {
    question: "Who was the first president of the United States?",
    choices: ["George Washington", "Abraham Lincoln", "John Adams", "Thomas Jefferson"],
    answer: "George Washington",
    category: "History",
    difficulty: "Easy"
  },
  {
    question: "Which country is known as the Land of the Rising Sun?",
    choices: ["China", "Thailand", "South Korea", "Japan"],
    answer: "Japan",
    category: "Geography",
    difficulty: "Easy"
  },
  {
    question: "What is the chemical symbol for Gold?",
    choices: ["Au", "Ag", "Gd", "Go"],
    answer: "Au",
    category: "Science",
    difficulty: "Medium"
  },
  {
    question: "How many continents are there on Earth?",
    choices: ["5", "6", "7", "8"],
    answer: "7",
    category: "Geography",
    difficulty: "Easy"
  },
  {
    question: "What is the hardest natural substance on Earth?",
    choices: ["Iron", "Diamond", "Gold", "Quartz"],
    answer: "Diamond",
    category: "Science",
    difficulty: "Medium"
  }
];

let filteredQuestions = [];
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 10;

const questionElem = document.getElementById("question");
const choicesElem = document.getElementById("choices");
const timeElem = document.getElementById("time");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const scoreElem = document.getElementById("score");
const resultElem = document.getElementById("result");
const progressBar = document.getElementById("progress-bar");

document.getElementById("start-btn").addEventListener("click", () => {
  const category = document.getElementById("category").value;
  const difficulty = document.getElementById("difficulty").value;

  filteredQuestions = questions.filter(q =>
    (category === "All" || q.category === category) &&
    (difficulty === "All" || q.difficulty === difficulty)
  );

  if (filteredQuestions.length === 0) {
    alert("No matching questions.");
    return;
  }

  currentQuestion = 0;
  score = 0;
  document.getElementById("settings").style.display = "none";
  document.getElementById("question-box").style.display = "block";
  showQuestion();
});

function showQuestion() {
  const q = filteredQuestions[currentQuestion];
  questionElem.textContent = q.question;
  choicesElem.innerHTML = "";
  nextBtn.style.display = "none";
  submitBtn.style.display = "none";
  progressBar.style.width = "100%";
  progressBar.classList.remove("low-time");

  q.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => {
      clearInterval(timer);
      if (choice === q.answer) score++;
      if (currentQuestion === filteredQuestions.length - 1) {
        submitBtn.style.display = "inline-block";
      } else {
        nextBtn.style.display = "inline-block";
      }
    };
    choicesElem.appendChild(btn);
  });
  startTimer();
}

function startTimer() {
  timeLeft = 10;
  timeElem.textContent = timeLeft;

  progressBar.style.width = "100%";
  progressBar.classList.remove("low-time");

  timer = setInterval(() => {
    timeLeft--;
    timeElem.textContent = timeLeft;

    const percent = (timeLeft / 10) * 100;
    progressBar.style.width = percent + "%";

    if (timeLeft <= 3) {
      progressBar.classList.add("low-time");
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      if (currentQuestion === filteredQuestions.length - 1) {
        submitBtn.style.display = "inline-block";
      } else {
        nextBtn.style.display = "inline-block";
      }
    }
  }, 1000);
}

nextBtn.onclick = () => {
  currentQuestion++;
  nextBtn.style.display = "none";
  showQuestion();
};

submitBtn.onclick = () => {
  document.getElementById("question-box").style.display = "none";
  resultElem.style.display = "block";
  scoreElem.textContent = `${score} / ${filteredQuestions.length}`;
  saveScore(score);
  displayLeaderboard();
};

function saveScore(score) {
  const scores = JSON.parse(localStorage.getItem("quiz-scores") || "[]");
  scores.push({ score: score, date: new Date().toLocaleString() });
  localStorage.setItem("quiz-scores", JSON.stringify(scores));
}

function displayLeaderboard() {
  const leaderboardElem = document.getElementById("leaderboard");
  const scores = JSON.parse(localStorage.getItem("quiz-scores") || "[]");
  const topScores = scores.sort((a, b) => b.score - a.score).slice(0, 5);
  leaderboardElem.innerHTML = "<h3>🏆 Leaderboard</h3>";
  topScores.forEach((entry, index) => {
    leaderboardElem.innerHTML += `<p>#${index + 1} - ${entry.score} points on ${entry.date}</p>`;
  });
}
