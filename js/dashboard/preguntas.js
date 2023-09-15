const perfil = document.querySelector("#sesionCorreo");
perfil.innerHTML = `Hola! ${sessionStorage.getItem("usuarioCorreo")??""}`;

recibirFrases();

/**Función para llenar la tabla de frases con datos */
function recibirFrases() {
	
	let peticionPreguntas = new XMLHttpRequest();

	peticionPreguntas.open('GET', "../jsons/preguntas.json", false);
	peticionPreguntas.send(null);
	const listaPreguntas = JSON.parse(peticionPreguntas.responseText);

	let tablaHTML = `
		<thead>
			<tr>
				<th class="text-right">Id</th>
				<th>Pregunta</th>
				<th class="text-center">Opciones</th>
			<tr>
		</thead>
		<tbody>`;

	listaPreguntas.forEach(fraseItem => {
		tablaHTML += `
			<tr>
				<td class="text-right">${fraseItem.id}</td>
				<td>${fraseItem.pregunta}</td>
				<td class="text-center">
					<button type="button">Editar</button>
					<button type="button">Eliminar</button>
				</td>
			</tr>`;
	});

	tablaHTML += `</tbody>`;

	const tablaElemento = document.querySelector("#tablaPreguntas");

	tablaElemento.innerHTML = tablaHTML;
}

/**Función para salir de la sesión y limpiar los datos almacenados */
function cerrarSesion() {
	
	localStorage.clear();
	
	window.location.href = "index.html";
	
}
