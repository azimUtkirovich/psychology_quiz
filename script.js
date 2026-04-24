let questions = []; // Массив изначально пуст

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

async function loadQuestions() {
    try {
        // 1. Указываем список всех ваших файлов
        const files = [
            'questions-experement.json', 
            'questions-social.json', 
            'questions-talim.json', 
            'questions-umumiy.json'
        ];

        // 2. Запускаем загрузку всех файлов одновременно
        const requests = files.map(file => fetch(file).then(res => {
            if (!res.ok) throw new Error(`Ошибка в файле ${file}`);
            return res.json();
        }));

        // 3. Ждем завершения всех запросов
        const allResults = await Promise.all(requests);

        // 4. Соединяем все массивы в один большой (flat объединяет подмассивы)
        const allQuestions = allResults.flat();

        // 5. Перемешиваем общий список и берем 30 штук
        allQuestions.sort(() => Math.random() - 0.5);
        questions = allQuestions.slice(0, 30);

        startQuiz(); 
    } catch (error) {
        console.error("Ошибка загрузки:", error);
        questionElement.innerHTML = "Ошибка загрузки файлов JSON. Проверьте названия файлов.";
    }
}


function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Кейинги савол";
  showQuestion();
}

function showQuestion() {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  const shuffledAnswers = [...currentQuestion.answers].sort(
    () => Math.random() - 0.5,
  );

  shuffledAnswers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerButtons.appendChild(button);
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
  });
}

function resetState() {
  nextButton.style.display = "none";
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  const selectBtn = e.target;
  const isCorrect = selectBtn.dataset.correct === "true";
  if (isCorrect) {
    selectBtn.classList.add("correct");
    score++;
  } else {
    selectBtn.classList.add("incorrect");
  }
  Array.from(answerButtons.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextButton.style.display = "block";
}

function showScore() {
  resetState();
  questionElement.innerHTML = `${questions.length} саволдан ${score} тугри белгиланди`;
  nextButton.innerHTML = "Тестни бошлаш";
  nextButton.style.display = "block";
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton();
  } else {
    location.reload();
  }
});

loadQuestions();
