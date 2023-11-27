let listaRespuestasGlobal = [];
let respuestaSeleccionadoId = null;


validaSesion();
mostrarRespuestas();

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

// Processa la lista de respuestas a un formato de filas para tabla HTML
function procesarRespuestas(respuestasLista) {
	// Encabezados de tabla
	let tablaHTML = `
		<thead>
			<tr>
				<th class="tabla-columna-comprime text-right">Valor</th>
				<th>Respuesta</th>
				<th class="tabla-columna-comprime text-center">Opciones</th>
			<tr>
		</thead>
		<tbody>`;

	if (respuestasLista.length > 0) {
		// Genera las filas de tabla con arreglo de respuestas
		respuestasLista.forEach(respuestaItem => {
			tablaHTML += `
				<tr>
					<td class="tabla-columna-comprime text-right">${respuestaItem.valor}</td>
					<td>${respuestaItem.respuesta}</td>
					<td class="tabla-columna-comprime text-center">
						<button type="button" onclick="actualizaRespuestaMostrar('${respuestaItem.id}')">Editar</button>
						<button type="button" onclick="eliminaRespuestaMostrar('${respuestaItem.id}')" class="boton boton-red">Eliminar</button>
					</td>
				</tr>`;
		});
	} else {
		// Arreglo de respuestas vacío, notificar en tabla
		tablaHTML += `
				<tr>
					<td colspan="3" class="text-center">
						No se encontraron registros para respuestas
					</td>
				</tr>`;
	}

	tablaHTML += `</tbody>`;

	// Actualizar HTML de la tabla
	const tablaElemento = document.querySelector("#tablaRespuestas");
	tablaElemento.innerHTML = tablaHTML;
}

// Solicita los datos necesarios a BD para actualizar el contenido de la página
function mostrarRespuestas() {
	Promise.all([obtenerRespuestas()]).then(([respuestasLista]) => {

		listaRespuestasGlobal = respuestasLista;
		respuestaSeleccionadoId = null;

		procesarRespuestas(respuestasLista);

	}).catch(error => {
		console.error("Error obteniendo documentos: ", error);
	});
}


/*** FUNCIONES PARA CREAR RESPUESTA ***/
// Vacía los input y muestra el modal
function creaRespuestaMostrar() {
	document.querySelector("#creaRespuesta").value = "";
	document.querySelector("#creaRespuestaAlerta").innerHTML = "";

	document.querySelector("#creaValor").value = "";
	document.querySelector("#creaValorAlerta").innerHTML = "";

	document.querySelector("#creaRespuestaModal").style.display = 'flex';
}

// Valida el contenido de los input
function creaRespuestaValidar() {
	const respuesta = document.querySelector("#creaRespuesta").value;
	const valor = Number(document.querySelector("#creaValor").value ?? 0);

	let hasIssues = false;

	const alertaRespuesta = document.querySelector("#creaRespuestaAlerta");
	if (respuesta == "") {
		alertaRespuesta.innerHTML = "El campo no puede estar vacío.";
		hasIssues = true;
	} else {
		alertaRespuesta.innerHTML = "";
	}

	const alertaValor = document.querySelector("#creaValorAlerta");
	if (valor <= 0) {
		alertaValor.innerHTML = "El campo no puede estar vacío.";
		hasIssues = true;
	} else {
		alertaValor.innerHTML = "";
	}

	// Si no hay errores procede a hacer solicitud a BD
	if (!hasIssues)
		creaRespuestaEnviar(respuesta, valor);
}

// Envia la consulta de crear a BD
function creaRespuestaEnviar(respuesta, valor) {
	cierraModal();
	document.querySelector("#esperaModal").style.display = 'flex';

	db.collection("Respuestas").add({
		respuesta: respuesta,
		valor: valor
	})
		.then((ref) => {
			//Vuelva a llamar a recargar la tabla
			mostrarRespuestas();

			cierraModal();
			document.querySelector("#resultadoModal").style.display = 'flex';
		})
		.catch((error) => {
			cierraModal();
			console.error("Error agregando el documento: ", error);
		});
}


/*** FUNCIONES PARA ACTUALIZAR RESPUESTA ***/
// Vacía los input y muestra el modal
function actualizaRespuestaMostrar(id) {
	const item = listaRespuestasGlobal.find(item => item.id == id);
	respuestaSeleccionadoId = id;

	document.querySelector("#actualizaRespuesta").value = item.respuesta;
	document.querySelector("#actualizaRespuestaAlerta").innerHTML = "";

	document.querySelector("#actualizaRespuestaModal").style.display = 'flex';
}

// Valida el contenido de los input
function actualizaRespuestaValidar() {
	const respuesta = document.querySelector("#actualizaRespuesta").value;
	const valor = document.querySelector("#actualizaValor").value;

	let hasIssues = false;

	const alertaRespuesta = document.querySelector("#actualizaRespuestaAlerta");
	if (respuesta == "") {
		alertaRespuesta.innerHTML = "El campo no puede estar vacío.";
		hasIssues = true;
	} else {
		alertaRespuesta.innerHTML = "";
	}

	const alertaValor = document.querySelector("#actualizaValorAlerta");
	if (respuesta == "") {
		alertaRespuesta.innerHTML = "El campo no puede estar vacío.";
		hasIssues = true;
	} else {
		alertaRespuesta.innerHTML = "";
	}

	// Si no hay errores procede a hacer solicitud a BD
	if (!hasIssues)
		actualizaRespuestaEnviar(respuesta, valor);
}

// Envia la consulta de actualizar a BD
function actualizaRespuestaEnviar(respuesta, valor) {
	cierraModal();
	document.querySelector("#esperaModal").style.display = 'flex';

	db.collection("Respuestas").doc(respuestaSeleccionadoId).set({
		respuesta: respuesta,
		valor: valor
	})
		.then((ref) => {
			//Vuelva a llamar a recargar la tabla
			mostrarRespuestas();

			cierraModal();
			document.querySelector("#resultadoModal").style.display = 'flex';
		})
		.catch((error) => {
			cierraModal();
			console.error("Error agregando el documento: ", error);
		});
}


/*** FUNCIONES PARA ELIMINAR RESPUESTAS ***/
// Busca los datos del registro para mostrar modal de confirmación
function eliminaRespuestaMostrar(id) {
	const item = listaRespuestasGlobal.find(item => item.id == id);
	respuestaSeleccionadoId = id;

	document.querySelector("#eliminaRespuesta").innerHTML = '"' + item.respuesta + '"';

	document.querySelector("#eliminaRespuestaModal").style.display = 'flex';
}

// Envia la consulta de actualizar a BD
function eliminaRespuestaAccion() {
	cierraModal();
	document.querySelector("#esperaModal").style.display = 'flex';

	db.collection("Respuestas").doc(respuestaSeleccionadoId).delete()
		.then((ref) => {
			//Vuelva a llamar a recargar la tabla
			mostrarRespuestas();

			cierraModal();
			document.querySelector("#resultadoModal").style.display = 'flex';
		})
		.catch((error) => {
			cierraModal();
			console.error("Error writing document: ", error);
		});
}