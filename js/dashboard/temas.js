const usuario = sessionStorage.getItem("usuarioCorreo") ?? "";
if (usuario == "") {
	window.location.href = "../index.html";
}
const perfil = document.querySelector("#sesionCorreo");
perfil.innerHTML = `Buen día! ${usuario}`;

let listaTemasGlobal = [];

recibirTemas();

/**Función para llenar la tabla de temas con datos */
function recibirTemas() {
	
	let peticionTemas = new XMLHttpRequest();

	peticionTemas.open('GET', "../jsons/temas.json", false); 
	peticionTemas.send(null);
	listaTemasGlobal = JSON.parse(peticionTemas.responseText);

	let tablaHTML = `
		<thead>
			<tr>
				<th class="tabla-columna-comprime text-right">Id</th>
				<th>Tema</th>
				<th class="tabla-columna-comprime text-center">Opciones</th>
			<tr>
		</thead>
		<tbody>`;

		listaTemasGlobal.forEach(temaItem => {
		tablaHTML += `
			<tr>
				<td class="tabla-columna-comprime text-right">${temaItem.id}</td>
				<td>${temaItem.tema}</td>
				<td class="tabla-columna-comprime text-center">
					<button type="button" onclick="actualizaTemaMostrar(${temaItem.id})">Editar</button>
					<button type="button" onclick="eliminaTemaMostrar(${temaItem.id})" class="boton boton-red">Eliminar</button>
				</td>
			</tr>`;
	});

	tablaHTML += `</tbody>`;

	const tablaElemento = document.querySelector("#tablaTemas");

	tablaElemento.innerHTML = tablaHTML;
}

function creaTemaMostrar() {
	const modal = document.querySelector("#creaTemaModal");
	modal.style.display = 'flex';
}

function creaTemaValidar() {
	cierraModal();
}


function actualizaTemaMostrar(id) {
	const item = listaTemasGlobal.find(item => item.id == id);
	
	const texto = document.querySelector("#actualizaTema");
	texto.value = item.tema;

	const modal = document.querySelector("#actualizaTemaModal");
	modal.style.display = 'flex';
}

function actualizaTemaValidar() {
	cierraModal();
}


function eliminaTemaMostrar(id) {
	const item = listaTemasGlobal.find(item => item.id == id);
	
	const texto = document.querySelector("#eliminaTema");
	texto.innerHTML = '"'+item.tema+'"';

	const modal = document.querySelector("#eliminaTemaModal");
	modal.style.display = 'flex';
}

function eliminaTemaAccion() {
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
