const usuario = sessionStorage.getItem("usuarioCorreo") ?? "";
if (usuario == "") {
	window.location.href = "../index.html";
}
const perfil = document.querySelector("#sesionCorreo");
perfil.innerHTML = `Buen día! ${usuario}`;

let listaRespuestasGlobal = [];

recibirDatos();

/**Función para llenar la tabla de respuestas con datos */
function recibirDatos() {
	
	let peticionRespuestas = new XMLHttpRequest();
	peticionRespuestas.open('GET', "../jsons/respuestas.json", false); 
	peticionRespuestas.send(null);
	listaRespuestasGlobal = JSON.parse(peticionRespuestas.responseText);

	let tablaHTML = `
		<thead>
			<tr>
				<th class="tabla-columna-comprime text-right">Id</th>
				<th>Respuesta</th>
				<th class="text-right">Valor</th>
				<th class="tabla-columna-comprime text-right">Opciones</th>
			<tr>
		</thead>
		<tbody>`;

	listaRespuestasGlobal.forEach(item => {
		tablaHTML += `
			<tr>
				<td class="tabla-columna-comprime text-right">${item.id}</td>
				<td>${item.respuesta}</td>
				<td class="text-right">${item.valor}</td>
				<td class="tabla-columna-comprime text-right">
					<button type="button" onclick="actualizaRespuestaMostrar(${item.id})">Editar</button>
					<button type="button" onclick="eliminaRespuestaMostrar(${item.id})" class="boton boton-red">Eliminar</button>
				</td>
			</tr>`;
	});

	tablaHTML += `</tbody>`;

	const tablaElemento = document.querySelector("#tablaRespuestas");
	tablaElemento.innerHTML = tablaHTML;
}

function creaRespuestaMostrar() {
	const texto = document.querySelector("#creaRespuesta");
	texto.value = "";

	const valor = document.querySelector("#creaValor");
	texto.value = "";

	const modal = document.querySelector("#creaRespuestaModal");
	modal.style.display = 'flex';
}

function creaRespuestaValidar() {
	cierraModal();
}


function actualizaRespuestaMostrar(id) {
	const item = listaRespuestasGlobal.find(item => item.id == id);
	
	const texto = document.querySelector("#actualizaRespuesta");
	texto.value = item.respuesta;

	const valor = document.querySelector("#actualizaValor");
	valor.value = item.valor;

	const modal = document.querySelector("#actualizaRespuestaModal");
	modal.style.display = 'flex';
}

function actualizaRespuestaValidar() {
	cierraModal();
}


function eliminaRespuestaMostrar(id) {
	const item = listaRespuestasGlobal.find(item => item.id == id);
	
	const texto = document.querySelector("#eliminaRespuesta");
	texto.innerHTML = '"'+item.respuesta+'"';

	const modal = document.querySelector("#eliminaRespuestaModal");
	modal.style.display = 'flex';
}

function eliminaRespuestaAccion() {
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
	
	sessionStorage.clear();
	
	window.location.href = "index.html";
	
}
