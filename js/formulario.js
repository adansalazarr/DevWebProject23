
// Formulario de preguntas
const questionContainer = document.getElementById("question-container");
const resultContainer = document.getElementById("result-container");

/**Solicitud de preguntas*/
let peticionPreguntas = new XMLHttpRequest();
peticionPreguntas.open('GET', "./jsons/preguntas.json", false); 
peticionPreguntas.send(null);
const preguntasLista = JSON.parse(peticionPreguntas.responseText);

/**Solicitud de respuestas*/
let peticionRespuestas = new XMLHttpRequest();
peticionRespuestas.open('GET', "./jsons/respuestas.json", false); 
peticionRespuestas.send(null);
const respuestasLista = JSON.parse(peticionRespuestas.responseText);

/**Solicitud de preguntas*/
let peticionVinculos = new XMLHttpRequest();
peticionVinculos.open('GET', "./jsons/preguntas_respuestas.json", false); 
peticionVinculos.send(null);
const vinculosLista = JSON.parse(peticionVinculos.responseText);

vinculosLista.map(item => {
    const res = respuestasLista.find(res => res.id == item.id_respuesta);
    item.respuesta = res.respuesta;
    item.valor = res.valor;
    return item;
});

preguntasLista.map(item => {
    item.respuestas = vinculosLista.filter(res => res.id_pregunta == item.id);
    return item;
})

console.log(preguntasLista);

const questions = [];
for (let i = 0; i < 3; i++) {
	const indice = Math.floor(Math.random() * preguntasLista.length);

	questions.push({
		question: preguntasLista[indice].pregunta,
		options: preguntasLista[indice].respuestas
	});

	preguntasLista.splice(indice, 1);
}

let currentQuestionIndex = 0;
let valorFinal = 0;

function showQuestion() {
	document.querySelector("#start-form-div").style.display = "none";
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        const questionElement = document.createElement("div");
        questionElement.innerHTML = `
            <p>${question.question}</p>
            <ul class="formulario">
                ${question.options.map((option, index) => `
                    <li>
                        <input type="radio" id="answer${index}" name="answer" value="${option.valor}">
						<label for="answer${index}">${option.respuesta}</label>
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
				valorFinal += selectedAnswerIndex;
                currentQuestionIndex++;
                questionElement.remove();
                showQuestion();
            } else {
                alert("Por favor, selecciona una respuesta.");
            }
        });
    } else {
		questionContainer.innerHTML = "";
        resultContainer.innerHTML = `
		<h4 >Resultados</h4>
		<p class="text-center">${
			(valorFinal >= 9) ? `Muy bien! Mantienes una buena estabilidad emocional! De acuerdo con tus respuestas, es probable que no tengas un problema de depresión.` : 
				(valorFinal >= 7) ? `Incluso si actualmente no experimenta problemas de depresión, es importante que controle su salud mental de vez en cuando. El bienestar mental es un espectro, y al igual que la salud física, requiere atención y cuidado regulares. Controlar nuestras emociones, buscar apoyo y participar en la autorreflexión puede ayudarnos a mantener una mentalidad sana y equilibrada.` : 
					(valorFinal > 5) ? `Es importante reconocer que incluso la depresión leve puede tener un impacto en el bienestar general de una persona. Reconocer y abordar estos sentimientos es crucial para mantener una buena salud mental. Tomarse el tiempo para buscar ayuda profesional, confiar en amigos o familiares de confianza y explorar estrategias de afrontamiento puede marcar una diferencia significativa.` :
					`Parece que estás experimentando síntomas de depresión, es fundamental que busques ayuda lo antes posible. La depresión es una afección de salud mental grave que puede afectar significativamente su bienestar y calidad de vida.`}
		</p>
        <br>
        <p class="text-center">
            Para solicitar apoyo emocional, te recomendamos comunicarte a la linea del área TQueremos. Puedes usar el enlace a continuación o visitar la página oficial.
        </p>
        <p class="text-center">
            <a href="https://tqueremos.tec.mx/es/lineatqueremos" class="boton" target="_blank">Línea TQueremos</a>
        </p>`;
    }
}

