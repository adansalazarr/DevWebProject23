// Frases motivacionales
const motivationalPhrases = [
    "«El pesimista ve dificultades en cada oportunidad. El optimista ve oportunidades en cada dificultad» —Winston Churchill",
    "«Muchos piensan en cambiar el mundo, pero casi nadie piensa en cambiarse a sí mismo» —Leon Tolstoi",
    "«Si estás trabajando en algo que te importa de verdad, nadie tiene que empujarte: tu visión te empuja» —Steve Jobs",
    // Agrega más frases aquí
];

const motivationalText = document.getElementById("motivational-text");
let currentPhraseIndex = 0;

function changeMotivationalText() {
    motivationalText.textContent = motivationalPhrases[currentPhraseIndex];
    currentPhraseIndex = (currentPhraseIndex + 1) % motivationalPhrases.length;
}

// Cambio automático de frase motivacional cada 5 segundos
setInterval(changeMotivationalText, 3000);

// Formulario de preguntas
const startFormButton = document.getElementById("start-form-button");
const questionContainer = document.getElementById("question-container");
const questions = [
    {
        question: "Pregunta 1",
        options: ["Opción A", "Opción B", "Opción C"],
        correctAnswer: 1
    },
    {
        question: "Pregunta 2",
        options: ["Opción X", "Opción Y", "Opción Z"],
        correctAnswer: 0
    },
    // Agrega más preguntas aquí
];
let currentQuestionIndex = 0;

startFormButton.addEventListener("click", () => {
    startFormButton.style.display = "none";
    showQuestion();
});

function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        const questionElement = document.createElement("div");
        questionElement.innerHTML = `
            <p>${question.question}</p>
            <ul>
                ${question.options.map((option, index) => `
                    <li>
                        <input type="radio" name="answer" value="${index}">
                        ${option}
                    </li>
                `).join("")}
            </ul>
            <button id="next-question-button">Siguiente</button>
        `;
        questionContainer.appendChild(questionElement);

        const nextQuestionButton = document.getElementById("next-question-button");
        nextQuestionButton.addEventListener("click", () => {
            const selectedAnswer = document.querySelector('input[name="answer"]:checked');
            if (selectedAnswer) {
                const selectedAnswerIndex = parseInt(selectedAnswer.value);
                if (selectedAnswerIndex === question.correctAnswer) {
                    alert("Respuesta correcta");
                } else {
                    alert("Respuesta incorrecta");
                }
                currentQuestionIndex++;
                questionElement.remove();
                showQuestion();
            } else {
                alert("Por favor, selecciona una respuesta.");
            }
        });
    } else {
        alert("Has completado todas las preguntas.");
    }
}
