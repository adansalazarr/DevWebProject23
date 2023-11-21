const usuario = sessionStorage.getItem("usuarioCorreo") ?? "";
if (usuario == "") {
	window.location.href = "../index.html";
}
const perfil = document.querySelector("#sesionCorreo");
perfil.innerHTML = `Buen día! ${usuario}`;

let listaFrasesGlobal = [];
let listaTemasGlobal = [];

recibirFrases();

/**Función para llenar la tabla de frases con datos */
function recibirFrases() {
	
	let peticionFrases = new XMLHttpRequest();
	peticionFrases.open('GET', "../jsons/frases.json", false); 
	peticionFrases.send(null);
	listaFrasesGlobal = JSON.parse(peticionFrases.responseText);

	let peticionTemas = new XMLHttpRequest();
	peticionTemas.open('GET', "../jsons/temas.json", false); 
	peticionTemas.send(null);
	listaTemasGlobal = JSON.parse(peticionTemas.responseText);

	/**Llenar los select de formularios con temas disponibles*/
	let selectOpciones = `<option value="0">-Selecciona-</option>`;

	listaTemasGlobal.forEach(item => {
		selectOpciones += `<option value="${item.id}">${item.tema}</option>`;
	});

	const selectCreaTema = document.querySelector("#creaTema");
	selectCreaTema.innerHTML = selectOpciones;

	const selectActualizaTema = document.querySelector("#actualizaTema");
	selectActualizaTema.innerHTML = selectOpciones;

	/**Llenar la tabla de datos */
	let tablaHTML = `
		<thead>
			<tr>
				<th class="tabla-columna-comprime text-right">Id</th>
				<th>Frase</th>
				<th>Autor</th>
				<th class="text-right">Tema</th>
				<th class="tabla-columna-comprime text-center">Opciones</th>
			<tr>
		</thead>
		<tbody>`;

		listaFrasesGlobal.forEach(fraseItem => {
		tablaHTML += `
			<tr>
				<td class="tabla-columna-comprime text-right">${fraseItem.id}</td>
				<td>${fraseItem.frase}</td>
				<td>${fraseItem.autor}</td>
				<td class="text-right">${listaTemasGlobal.find(item => fraseItem.tema == item.id).tema}</td>
				<td class="tabla-columna-comprime text-center">
					<button type="button" onclick="actualizaFraseMostrar(${fraseItem.id})">Editar</button>
					<button type="button" onclick="eliminaFraseMostrar(${fraseItem.id})" class="boton boton-red">Eliminar</button>
				</td>
			</tr>`;
	});

	tablaHTML += `</tbody>`;

	const tablaElemento = document.querySelector("#tablaFrases");
	tablaElemento.innerHTML = tablaHTML;
}


function creaFraseMostrar() {
	const texto = document.querySelector("#creaFrase");
	texto.value = "";
	const autor = document.querySelector("#creaAutor");
	autor.value = "";
	const tema = document.querySelector("#creaTema");
	tema.value = 0;

	const modal = document.querySelector("#creaFraseModal");
	modal.style.display = 'flex';
}

function creaFraseValidar() {
	cierraModal();
}


function actualizaFraseMostrar(id) {
	const item = listaFrasesGlobal.find(item => item.id == id);
	
	const texto = document.querySelector("#actualizaFrase");
	texto.value = item.frase;
	const autor = document.querySelector("#actualizaAutor");
	autor.value = item.autor;
	const tema = document.querySelector("#actualizaTema");
	tema.value = item.tema;

	const modal = document.querySelector("#actualizaFraseModal");
	modal.style.display = 'flex';
}

function actualizaFraseValidar() {
	cierraModal();
}


function eliminaFraseMostrar(id) {
	const item = listaFrasesGlobal.find(item => item.id == id);
	
	const texto = document.querySelector("#eliminaFrase");
	texto.innerHTML = '"'+item.frase+'"';

	const modal = document.querySelector("#eliminaFraseModal");
	modal.style.display = 'flex';
}

function eliminaFraseAccion() {
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
