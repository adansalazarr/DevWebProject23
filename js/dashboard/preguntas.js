let listaPreguntasGlobal = [];
let preguntaSeleccionadoId = null;
let vinculoSeleccionadoId = null;

validaSesion();
mostrarPreguntas();

//Consulta a BD para obtener todas las respuestas
function obtenerPreguntas() {
	const preguntasColeccion = db.collection("Preguntas");

	return preguntasColeccion.get().then((querySnapshot) => {
		const preguntasLista = [];

		querySnapshot.forEach((doc) => {
			const tmp = { ...doc.data() };
			tmp.id = doc.id;
			preguntasLista.push(tmp);
		});

		return preguntasLista;
	});
}

//Consulta a BD para obtener todas las respuestas
function obtenerRespuestas() {
	const respuestasColeccion = db.collection("Respuestas");

	return respuestasColeccion.orderBy("valor").get().then((querySnapshot) => {
		const respuestasLista = [];

		querySnapshot.forEach((doc) => {
			const tmp = { ...doc.data() };
			tmp.id = doc.id;
			respuestasLista.push(tmp);
		});

		return respuestasLista;
	});
}

//Consulta a BD para obtener todas las respuestas
function obtenerVinculos() {
	const vinculosColeccion = db.collection("PreguntasRespuestas");

	return vinculosColeccion.get().then((querySnapshot) => {
		const vinculosLista = [];

		querySnapshot.forEach((doc) => {
			const tmp = { ...doc.data() };
			tmp.id = doc.id;
			vinculosLista.push(tmp);
		});

		return vinculosLista;
	});
}

// Processa la lista de preguntas con sus respuestas vinculadas a un formato de filas para tabla HTML
function procesarPreguntas(preguntasLista) {
	// Encabezados de tabla
	let tablaHTML = `
		<thead>
			<tr>
				<th colspan="2">Pregunta</th>
				<th class="tabla-columna-comprime text-center">Opciones</th>
			<tr>
		</thead>
		<tbody>`;

	if (preguntasLista.length > 0) {
		// Genera las filas de tabla con arreglo de respuestas
		preguntasLista.forEach((preguntaItem, index) => {

			// Datos principales de la pregunta
			tablaHTML += `
				<tr>
					<td colspan="2">${preguntaItem.pregunta}</td>
					<td class="tabla-columna-comprime text-center">
						<button type="button" onclick="actualizaPreguntaMostrar('${preguntaItem.id}')">Editar</button>
						<button type="button" onclick="eliminaPreguntaMostrar('${preguntaItem.id}')" class="boton boton-red">Eliminar</button>
					</td>
				</tr>
				<tr>
					<th class="tabla-columna-comprime text-center">Valor</th>
					<th class="text-left">Respuesta</th>
					<th class="tabla-columna-comprime text-center">
						<button type="button" onclick="vinculaRespuestaMostrar('${preguntaItem.id}')">Agregar respuesta</button>
					</th>
				</tr>`;

			// Datos de respuestas vinculadas
			if (preguntaItem.respuestas.length > 0) {

				//Agrega HTML de respuesta a la tabla de preguntas
				preguntaItem.respuestas.forEach(respuestaItem => {
					tablaHTML += `
						<tr>
							<td class="tabla-columna-comprime text-center">${respuestaItem.valor}</td>
							<td class="text-left">${respuestaItem.respuesta}</td>
							<td class="tabla-columna-comprime text-center">
								<button type="button" onclick="desvinculaRespuestaMostrar('${preguntaItem.id}', '${respuestaItem.id}')" class="boton boton-red">Eliminar</button>
							</td>
						</tr>`;
				});
			} else {
				tablaHTML += `
					<tr>
						<td colspan="3" class="text-center">
							No se encontraron respuestas vinculadas a la pregunta
						</td>
					</tr>`;
			}

			// Agrega espacio al final para separar las preguntas
			if (index != (preguntasLista.length - 1)) {
				tablaHTML += `
					<tr>
						<td colspan="3" class="text-center">
							&nbsp;
						</td>
					</tr>`;
			}
		});

	} else {
		// Arreglo de respuestas vacío, notificar en tabla
		tablaHTML += `
				<tr>
					<td colspan="3" class="text-center">
						No se encontraron registros para preguntas
					</td>
				</tr>`;
	}

	tablaHTML += `</tbody>`;

	// Actualizar HTML de la tabla
	const tablaElemento = document.querySelector("#tablaPreguntas");
	tablaElemento.innerHTML = tablaHTML;
}

// Solicita los datos necesarios a BD para actualizar el contenido de la página
function mostrarPreguntas() {
	Promise.all([obtenerPreguntas(), obtenerRespuestas(), obtenerVinculos()]).then(([preguntasLista, respuestasLista, vinculosLista]) => {

		// Llena elementos <select> en formularios
		let selectOpciones = `<option value="0">-Selecciona-</option>`;

		respuestasLista.forEach(item => {
			selectOpciones += `<option value="${item.id}">Valor: ${item.valor} | ${item.respuesta}</option>`;
		});
		document.querySelector("#vinculaRespuesta").innerHTML = selectOpciones;


		// Mapeo de la lista de vinculos para que incluyan contenido de las respuestas
		vinculosLista.map(item => {
			const respuesta = respuestasLista.find(res => res.id == item.id_respuesta);
			item.respuesta = respuesta.respuesta;
			item.valor = respuesta.valor;

			return item;
		});

		// Agrega los vinculos de respuestas a cada pregunta correspondiente
		preguntasLista.map(item => {

			// Filtra las respuestas que corresponden a la pregunta actual
			const respuestas = vinculosLista.filter(vi => vi.id_pregunta == item.id);

			// Reordena las respuestas por valor 
			respuestas.sort((item1, item2) => item1.valor - item2.valor);

			item.respuestas = respuestas;
			return item;
		});

		// Almacena la lista mapeada en la variable global para manejo en formularios
		listaPreguntasGlobal = preguntasLista;
		respuestaSeleccionadoId = null;
		vinculoSeleccionadoId = null;

		procesarPreguntas(preguntasLista);

	}).catch(error => {
		console.error("Error obteniendo documentos: ", error);
	});
}


/*** FUNCIONES PARA CREAR PREGUNTA ***/
// Vacía los input y muestra el modal
function creaPreguntaMostrar() {
	document.querySelector("#creaPregunta").value = "";
	document.querySelector("#creaPreguntaAlerta").innerHTML = "";

	document.querySelector("#creaPreguntaModal").style.display = 'flex';
}

// Valida el contenido de los input
function creaPreguntaValidar() {
	const pregunta = document.querySelector("#creaPregunta").value;

	let hasIssues = false;

	const alertaPregunta = document.querySelector("#creaPreguntaAlerta");
	if (pregunta == "") {
		alertaPregunta.innerHTML = "El campo no puede estar vacío.";
		hasIssues = true;
	} else {
		alertaPregunta.innerHTML = "";
	}

	// Si no hay errores procede a hacer solicitud a BD
	if (!hasIssues)
		creaPreguntaEnviar(pregunta);
}

// Envia la consulta de crear a BD
function creaPreguntaEnviar(pregunta) {
	cierraModal();
	document.querySelector("#esperaModal").style.display = 'flex';

	db.collection("Preguntas").add({
		pregunta: pregunta
	})
		.then((ref) => {
			//Vuelva a llamar a recargar la tabla
			mostrarPreguntas();

			cierraModal();
			document.querySelector("#resultadoModal").style.display = 'flex';
		})
		.catch((error) => {
			cierraModal();
			console.error("Error agregando el documento: ", error);
		});
}


/*** FUNCIONES PARA ACTUALIZAR PREGUNTA ***/
// Vacía los input y muestra el modal
function actualizaPreguntaMostrar(id) {
	const item = listaPreguntasGlobal.find(item => item.id == id);
	preguntaSeleccionadoId = id;

	document.querySelector("#actualizaPregunta").value = item.pregunta;
	document.querySelector("#actualizaPreguntaAlerta").innerHTML = "";

	document.querySelector("#actualizaPreguntaModal").style.display = 'flex';
}

// Valida el contenido de los input
function actualizaPreguntaValidar() {
	const pregunta = document.querySelector("#actualizaPregunta").value;

	let hasIssues = false;

	const alertaPregunta = document.querySelector("#actualizaPreguntataAlerta");
	if (pregunta == "") {
		alertaPregunta.innerHTML = "El campo no puede estar vacío.";
		hasIssues = true;
	} else {
		alertaPregunta.innerHTML = "";
	}

	// Si no hay errores procede a hacer solicitud a BD
	if (!hasIssues)
		actualizaPreguntaEnviar(pregunta);
}

// Envia la consulta de actualizar a BD
function actualizaPreguntaEnviar(pregunta) {
	cierraModal();
	document.querySelector("#esperaModal").style.display = 'flex';

	db.collection("Preguntas").doc(preguntaSeleccionadoId).set({
		pregunta: pregunta,
	})
		.then((ref) => {
			//Vuelva a llamar a recargar la tabla
			mostrarPreguntas();

			cierraModal();
			document.querySelector("#resultadoModal").style.display = 'flex';
		})
		.catch((error) => {
			cierraModal();
			console.error("Error agregando el documento: ", error);
		});
}


/*** FUNCIONES PARA ELIMINAR PREGUNTAS ***/
// Busca los datos del registro para mostrar modal de confirmación
function eliminaPreguntaMostrar(id) {
	const pregunta = listaPreguntasGlobal.find(item => item.id == id);
	preguntaSeleccionadoId = id;

	document.querySelector("#eliminaPregunta").innerHTML = '"' + pregunta.pregunta + '"';

	document.querySelector("#eliminaPreguntaModal").style.display = 'flex';
}

// Envia la consulta de actualizar a BD
function eliminaPreguntaAccion() {
	cierraModal();
	document.querySelector("#esperaModal").style.display = 'flex';

	db.collection("Preguntas").doc(preguntaSeleccionadoId).delete()
		.then((ref) => {
			//Vuelva a llamar a recargar la tabla
			mostrarPreguntas();

			cierraModal();
			document.querySelector("#resultadoModal").style.display = 'flex';
		})
		.catch((error) => {
			cierraModal();
			console.error("Error writing document: ", error);
		});
}


/*** FUNCIONES PARA VINCULAR RESPUESTA ***/
// Vacía los input y muestra el modal
function vinculaRespuestaMostrar(id) {
	const pregunta = listaPreguntasGlobal.find(item => item.id == id);
	preguntaSeleccionadoId = id;

	document.querySelector("#vinculaPregunta").innerHTML = `"${pregunta.pregunta}"`;

	document.querySelector("#vinculaRespuesta").value = 0;
	document.querySelector("#vinculaRespuestaAlerta").innerHTML = "";

	document.querySelector("#vinculaRespuestaModal").style.display = 'flex';
}

// Valida el contenido de los input
function vinculaRespuestaValidar() {
	const respuesta = document.querySelector("#vinculaRespuesta").value;

	let hasIssues = false;

	const alertaRespuesta = document.querySelector("#vinculaRespuestaAlerta");
	if (respuesta == "0") {
		alertaRespuesta.innerHTML = "Se debe seleccionar una opción.";
		hasIssues = true;
	} else {
		alertaRespuesta.innerHTML = "";
	}

	// Si no hay errores procede a hacer solicitud a BD
	if (!hasIssues)
		vinculaRespuestaEnviar(respuesta);
}

// Envia la consulta de actualizar a BD
function vinculaRespuestaEnviar(respuesta) {
	cierraModal();
	document.querySelector("#esperaModal").style.display = 'flex';

	db.collection("PreguntasRespuestas").add({
		id_pregunta: preguntaSeleccionadoId,
		id_respuesta: respuesta
	})
		.then((ref) => {
			//Vuelva a llamar a recargar la tabla
			mostrarPreguntas();

			cierraModal();
			document.querySelector("#resultadoModal").style.display = 'flex';
		})
		.catch((error) => {
			cierraModal();
			console.error("Error agregando el documento: ", error);
		});
}


/*** FUNCIONES PARA DESVINCULAR RESPUESTA ***/
// Vacía los input y muestra el modal
function desvinculaRespuestaMostrar(idPregunta, idVinculo) {
	const pregunta = listaPreguntasGlobal.find(item => item.id_pregunta == idPregunta);
	const vinculo = pregunta.respuestas.find(item => item.id == idVinculo);
	vinculoSeleccionadoId = idVinculo;

	document.querySelector("#desvinculaPregunta").innerHTML = `"${pregunta.pregunta}"`;
	document.querySelector("#desvinculaRespuesta").innerHTML = `"${vinculo.respuesta}"`;
}

function desvinculaRespuestaAccion() {
	cierraModal();
	document.querySelector("#esperaModal").style.display = 'flex';

	db.collection("PreguntasRespuestas").doc(vinculoSeleccionadoId).delete()
		.then((ref) => {
			//Vuelva a llamar a recargar la tabla
			mostrarPreguntas();

			cierraModal();
			document.querySelector("#resultadoModal").style.display = 'flex';
		})
		.catch((error) => {
			cierraModal();
			console.error("Error agregando el documento: ", error);
		});
}