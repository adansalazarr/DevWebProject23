const perfil = document.querySelector("#sesionCorreo");
perfil.innerHTML = `Hola ${sessionStorage.getItem("usuarioCorreo")??""}!`;

let listaFrasesGlobal = [];

recibirFrases();

/**Función para llenar la tabla de frases con datos */
function recibirFrases() {
	
	let peticionFrases = new XMLHttpRequest();

	peticionFrases.open('GET', "../jsons/frases.json", false); 
	peticionFrases.send(null);
	listaFrasesGlobal = JSON.parse(peticionFrases.responseText);

	let tablaHTML = `
		<thead>
			<tr>
				<th class="text-right">Id</th>
				<th>Frase</th>
				<th>Autor</th>
				<th class="text-right">Tema</th>
				<th class="text-center">Opciones</th>
			<tr>
		</thead>
		<tbody>`;

		listaFrasesGlobal.forEach(fraseItem => {
		tablaHTML += `
			<tr>
				<td class="text-right">${fraseItem.id}</td>
				<td>${fraseItem.frase}</td>
				<td>${fraseItem.autor}</td>
				<td class="text-right">${fraseItem.tema}</td>
				<td class="text-center">
					<button type="button" onclick="actualizaFraseMostrar(${fraseItem.id})">Editar</button>
					<button type="button">Eliminar</button>
				</td>
			</tr>`;
	});

	tablaHTML += `</tbody>`;

	const tablaElemento = document.querySelector("#tablaFrases");

	tablaElemento.innerHTML = tablaHTML;
}

function creaFraseMostrar() {
	const modal = document.querySelector("#creaFraseModal");
	modal.style.display = 'flex';
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
