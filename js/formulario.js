// Formulario de preguntas
const questionContainer = document.getElementById("question-container");
const resultContainer = document.getElementById("result-container");

let puntuacion_final = 0;
let puntuacion_maximo = 0;
let puntuacion_minimo = 0;

// Obtener preguntas
function obtenerPreguntas() {
	return db.collection("Preguntas").get().then((querySnapshot) => {
		const preguntasLista = [];
		querySnapshot.forEach((doc) => {
			const tmp = { ...doc.data() };
			tmp.id = doc.id;
			preguntasLista.push(tmp);
		});
		return preguntasLista;
	});
}

// Obtener vínculos entre preguntas y respuestas
function obtenerVinculos() {
	return db.collection("Preguntas_Respuestas").get().then((querySnapshot) => {
		const vinculosLista = [];
		querySnapshot.forEach((doc) => {
			const tmp = { ...doc.data() };
			tmp.id = doc.id;
			vinculosLista.push(tmp);
		});
		return vinculosLista;
	});
}

// Obtener respuestas
function obtenerRespuestas() {
	return db.collection("Respuestas").get().then((querySnapshot) => {
		const respuestasLista = [];
		querySnapshot.forEach((doc) => {
			const tmp = { ...doc.data() };
			tmp.id = doc.id;
			respuestasLista.push(tmp);
		});
		return respuestasLista;
	});
}

// Construir los objetos de pregunta con respuestas correspondientes
function vincularPreguntasRespuestas(preguntasLista, respuestasLista, vinculosLista) {
	//agregar texto de respuestas a vinculos
	vinculosLista.map(item => {
		const res = respuestasLista.find(res => res.id == item.id_respuesta);
		item.respuesta = res.respuesta;
		item.valor = res.valor;
		return item;
	});

	//agregar arreglo de respuestas a preguntas
	preguntasLista.map(item => {
		item.respuestas = vinculosLista.filter(res => res.id_pregunta == item.id);
		return item;
	})

	return preguntasLista;
}

// Filtra solo la cantidad de preguntas indicadas del total, selecciona al azar
function seleccionarPreguntas(preguntasLista, cantidad) {
	// Arreglo con la lista de preguntas seleccionadas al azar
	const preguntasSeleccionadas = [];

	for (let i = 0; i < cantidad && preguntasLista.length >= 1; i++) {
		// Selecciona el indice de una pregunta
		const indice = Math.floor(Math.random() * preguntasLista.length);

		// Crea una copia de la pregunta al arreglo resultado
		preguntasSeleccionadas.push({ ...preguntasLista[indice] });

		// Determina los rangos de la puntuación 
		const puntuacionesPregunta = preguntasLista[indice].respuestas.map(item => item.valor);
		puntuacion_maximo += Math.max(...puntuacionesPregunta);
		puntuacion_minimo += Math.min(...puntuacionesPregunta);

		// Elimina la pregunta del arreglo inicial para evitar repetirla
		preguntasLista.splice(indice, 1);
	}

	return preguntasSeleccionadas;
}

// Muestra el HTML de una pregunta o del resultado
function showQuestion(preguntasLista, indice) {
	document.querySelector("#start-form-div").style.display = "none";

	// Valida si hace falta responder preguntas
	if (indice < preguntasLista.length) {
		// Hay preguntas por contestar
		const question = preguntasLista[indice];
		const questionElement = document.createElement("div");

		// Genera HTML de la pregunta y sus opciones de respuestas
		questionElement.innerHTML = `
            <p>${question.pregunta}</p>
            <ul class="formulario">
                ${question.respuestas.map((option, index) => `
                    <li>
                        <input type="radio" id="answer${index}" name="answer" value="${option.valor}">
                        <label for="answer${index}">${option.respuesta}</label>
                    </li>
                `).join("")}
            </ul>
            <button id="next-question-button">Siguiente</button>
        `;
		questionContainer.appendChild(questionElement);

		// Modifica el evento de click del botón de avanzar
		const nextQuestionButton = document.getElementById("next-question-button");
		nextQuestionButton.addEventListener("click", () => {
			const selectedAnswer = document.querySelector('input[name="answer"]:checked');
			if (selectedAnswer) {
				// Agrega la puntuación de la respuesta al resultado
				const selectedAnswerIndex = parseInt(selectedAnswer.value);
				puntuacion_final += selectedAnswerIndex;
				indice++;
				questionElement.remove();

				// Pasa a la siguiente pregunta
				showQuestion(preguntasLista, indice);
			} else {
				alert("Por favor, selecciona una respuesta.");
			}
		});
	} else {
		// Sin preguntas pendientes, muestra resultado
		questionContainer.innerHTML = "";

		// Texto de resultado depende de la puntuación final 
		resultContainer.innerHTML = `
        <h4 >Resultados</h4>
        <p class="text-center">${(puntuacion_final == puntuacion_maximo) ? `Muy bien! Mantienes una buena estabilidad emocional! De acuerdo con tus respuestas, es probable que no tengas un problema de depresión.` :
				(puntuacion_final > (puntuacion_minimo + (puntuacion_maximo - puntuacion_minimo) / 2)) ? `Incluso si actualmente no experimenta problemas de depresión, es importante que controle su salud mental de vez en cuando. El bienestar mental es un espectro, y al igual que la salud física, requiere atención y cuidado regulares. Controlar nuestras emociones, buscar apoyo y participar en la autorreflexión puede ayudarnos a mantener una mentalidad sana y equilibrada.` :
					(puntuacion_final > puntuacion_minimo) ? `Es importante reconocer que incluso la depresión leve puede tener un impacto en el bienestar general de una persona. Reconocer y abordar estos sentimientos es crucial para mantener una buena salud mental. Tomarse el tiempo para buscar ayuda profesional, confiar en amigos o familiares de confianza y explorar estrategias de afrontamiento puede marcar una diferencia significativa.` :
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

// Al presionar el botón "Hacer formulario", se obtienen las preguntas y comienza la evaluación
function iniciarCuestionario() {
	Promise.all([obtenerPreguntas(), obtenerRespuestas(), obtenerVinculos()]).then(([preguntasLista, respuestasLista, vinculosLista]) => {

		// Preguntas construidas con respuestas vinculadas
		preguntasCompletasLista = vincularPreguntasRespuestas(preguntasLista, respuestasLista, vinculosLista);

		// Filtro para solo hacer 3 preguntas de todas las obtenidas
		preguntasSeleccionadasLista = seleccionarPreguntas(preguntasCompletasLista, 3);

		// Comenzar a mostrar las preguntas
		showQuestion(preguntasSeleccionadasLista, 0);

	}).catch(error => {
		console.error("Error obteniendo documentos: ", error);
	});
}