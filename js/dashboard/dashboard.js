const perfil = document.querySelector("#sesionCorreo");
perfil.innerHTML = `Hola! ${sessionStorage.getItem("usuarioCorreo")??""}`;

recibirFrases();

/**Función para llenar la tabla de frases con datos */
function recibirFrases() {
	
	let peticionFrases = new XMLHttpRequest();

	peticionFrases.open('GET', "../jsons/frases.json", false); 
	peticionFrases.send(null);
	const listaFrases = JSON.parse(peticionFrases.responseText);

	let tablaHTML = `
		<thead>
			<tr>
				<th class="text-right">Id</th>
				<th>Frase</th>
				<th class="text-center">Opciones</th>
			<tr>
		</thead>
		<tbody>`;

	listaFrases.forEach(fraseItem => {
		tablaHTML += `
			<tr>
				<td class="text-right">${fraseItem.id}</td>
				<td>${fraseItem.frase}</td>
				<td class="text-center">
					<button type="button">Editar</button>
					<button type="button">Eliminar</button>
				</td>
			</tr>`;
	});

	tablaHTML += `</tbody>`;

	const tablaElemento = document.querySelector("#tablaFrases");

	tablaElemento.innerHTML = tablaHTML;
}

/**Función para salir de la sesión y limpiar los datos almacenados */
function cerrarSesion() {
	
	sessionStorage.clear();
	
	window.location.href = "index.html";
	
}
