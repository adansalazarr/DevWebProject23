const perfil = document.querySelector("#sesionCorreo");
perfil.innerHTML = `Hola ${sessionStorage.getItem("usuarioCorreo")??""}!`;

let listaPreguntasGlobal = [];
let listaRespuestasGlobal = [];
let listaVinculosGlobal = [];

recibirPreguntas();

/**Función para llenar la tabla de preguntas con datos */
function recibirPreguntas() {
	
	let peticionPreguntas = new XMLHttpRequest();
	peticionPreguntas.open('GET', "../jsons/preguntas.json", false);
	peticionPreguntas.send(null);
	listaPreguntasGlobal = JSON.parse(peticionPreguntas.responseText);

	let peticionRespuestas = new XMLHttpRequest();
	peticionRespuestas.open('GET', "../jsons/respuestas.json", false);
	peticionRespuestas.send(null);
	listaRespuestasGlobal = JSON.parse(peticionRespuestas.responseText);

	/**Llenar los select de formularios con temas disponibles*/
	let selectOpciones = `<option value="0">-Selecciona-</option>`;

	listaRespuestasGlobal.forEach(item => {
		selectOpciones += `<option value="${item.id}">${item.respuesta}</option>`;
	});

	const selectVinculaRespuesta = document.querySelector("#vinculaRespuesta");
	selectVinculaRespuesta.innerHTML = selectOpciones;

	let peticionVinculos = new XMLHttpRequest();
	peticionVinculos.open('GET', "../jsons/preguntas_respuestas.json", false);
	peticionVinculos.send(null);
	listaVinculosGlobal = JSON.parse(peticionVinculos.responseText);

	listaVinculosGlobal.map(respuesta => {
		respuesta.pregunta = listaPreguntasGlobal.find(pre => pre.id == respuesta.id_pregunta).pregunta;
		const res = listaRespuestasGlobal.find(res => res.id == respuesta.id_respuesta);
		respuesta.respuesta = res.respuesta;
		respuesta.valor = res.valor;
		return respuesta;
	});

	let tablaHTML = `
		<thead>
			<tr>
				<th class="text-right">Id</th>
				<th colspan="2">Pregunta</th>
				<th class="text-center">Opciones</th>
			<tr>
		</thead>
		<tbody>`;

	listaPreguntasGlobal.forEach(item => {
		tablaHTML += `
			<tr>
				<td class="text-right">${item.id}</td>
				<td colspan="2">${item.pregunta}</td>
				<td class="tabla-columna-comprime text-right">
					<button type="button" onclick="actualizaPreguntaMostrar(${item.id})">Editar</button>
					<button type="button" onclick="eliminaPreguntaMostrar(${item.id})" class="boton boton-red">Eliminar</button>
				</td>
			</tr>
			<tr>
				<td></td>
				<th class="text-left">Respuesta</th>
				<th class="text-left">Valor</th>
				<td class="tabla-columna-comprime text-right">
					<button type="button" onclick="vinculaRespuestaMostrar(${item.id})">Agregar respuesta</button>
				</td>
			</tr>`;
		const respuestas = listaVinculosGlobal.filter(vinculo => vinculo.id_pregunta == item.id);

		respuestas.forEach(res => {
			tablaHTML += `
			<tr>
				<td></td>
				<td>${res.respuesta}</td>
				<td>${res.valor}</td>
				<td class="tabla-columna-comprime text-right">
					<button type="button" onclick="desvinculaRespuestaMostrar(${res.id_pregunta}, ${res.id_respuesta})" class="boton boton-red">Eliminar</button>
				</td>
			</tr>`;
		})

		if (listaPreguntasGlobal.indexOf(item) != listaPreguntasGlobal.length-1) {
			tablaHTML += `
			<tr>
				<td colspan="4">&nbsp;</td>
			</tr>`;
		}

	});

	tablaHTML += `</tbody>`;

	const tablaElemento = document.querySelector("#tablaPreguntas");

	tablaElemento.innerHTML = tablaHTML;
}


function creaPreguntaMostrar() {
	const texto = document.querySelector("#creaPregunta");
	texto.value = "";

	const modal = document.querySelector("#creaPreguntaModal");
	modal.style.display = 'flex';
}

function creaPreguntaValidar() {
	cierraModal();
}


function actualizaPreguntaMostrar(id) {
	const item = listaPreguntasGlobal.find(item => item.id == id);
	
	const texto = document.querySelector("#actualizaPregunta");
	texto.value = item.pregunta;

	const modal = document.querySelector("#actualizaPreguntaModal");
	modal.style.display = 'flex';
}

function actualizaPreguntaValidar() {
	cierraModal();
}


function eliminaPreguntaMostrar(id) {
	const item = listaPreguntasGlobal.find(item => item.id == id);
	
	const texto = document.querySelector("#eliminaPregunta");
	texto.innerHTML = '"'+item.pregunta+'"';

	const modal = document.querySelector("#eliminaPreguntaModal");
	modal.style.display = 'flex';
}

function eliminaPreguntaAccion() {
	cierraModal();
}


function vinculaRespuestaMostrar(id) {
	const item = listaPreguntasGlobal.find(item => item.id == id);

	const pregunta = document.querySelector("#vinculaPregunta");
	pregunta.innerHTML = '"'+item.pregunta+'"';

	const respuesta = document.querySelector("#vinculaRespuesta");
	respuesta.value = 0;

	const modal = document.querySelector("#vinculaRespuestaModal");
	modal.style.display = 'flex';
}

function vinculaRespuestaValidar() {
	cierraModal();
}


function desvinculaRespuestaMostrar(idPregunta, idRespuesta) {
	const item = listaVinculosGlobal.find(item => item.id_pregunta == idPregunta && item.id_respuesta == idRespuesta);
	
	const pregunta = document.querySelector("#desvinculaPregunta");
	pregunta.innerHTML = '"'+item.pregunta+'"';

	const respuesta = document.querySelector("#desvinculaRespuesta");
	respuesta.innerHTML = '"'+item.respuesta+'"';

	const modal = document.querySelector("#desvinculaRespuestaModal");
	modal.style.display = 'flex';
}

function desvinculaRespuestaAccion() {
	cierraModal();
}


function cierraModal() {
	const modales = document.querySelectorAll(".modal");
	modales.forEach(item => {
		item.style.display = "none";
	});
}

/**Función para salir de la sesión y limpiar los datos almacenados */
function cerrarSesion() {
	
	localStorage.clear();
	
	window.location.href = "index.html";
	
}
