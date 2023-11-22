let listaTemasGlobal = [];
let temaSeleccionadoId = null;

validaSesion();
mostrarTemas();

//Consulta a BD para obtener todos los temas
function obtenerTemas() {
	const temasColeccion = db.collection("Temas");

    return temasColeccion.get().then((querySnapshot) => {
        const temasLista = [];

		querySnapshot.forEach((doc) => {
			const tmp = { ...doc.data() };
			tmp.id = doc.id;
            temasLista.push(tmp);
        });

		return temasLista;
    });
}

// Agrega temas a los elementos <select> de los formularios
function procesarTemas(temasLista) {
	// Encabezados de tabla
	let tablaHTML = `
		<thead>
			<tr>
				<th class="tabla-columna-comprime text-right">Id</th>
				<th>Tema</th>
				<th class="tabla-columna-comprime text-center">Opciones</th>
			<tr>
		</thead>
		<tbody>`;

	if (temasLista.length > 0) {
		// Genera las filas de tabla con arreglo de temas
		temasLista.forEach(temaItem => {
			tablaHTML += `
				<tr>
					<td class="tabla-columna-comprime text-right">${temaItem.id}</td>
					<td>${temaItem.tema}</td>
					<td class="tabla-columna-comprime text-center">
						<button type="button" onclick="actualizaTemaMostrar('${temaItem.id}')">Editar</button>
						<button type="button" onclick="eliminaTemaMostrar('${temaItem.id}')" class="boton boton-red">Eliminar</button>
					</td>
				</tr>`;
		});
	} else {
		// Arreglo de temas vacío, notificar en tabla
		tablaHTML += `
				<tr>
					<td colspan="3" class="text-center">
						No se encontraron registros para temas
					</td>
				</tr>`;
	}

	tablaHTML += `</tbody>`;

	// Actualizar HTML de la tabla
	const tablaElemento = document.querySelector("#tablaTemas");
	tablaElemento.innerHTML = tablaHTML;
}

// Solicita los datos necesarios a BD para actualizar el contenido de la página
function mostrarTemas() {
	Promise.all([obtenerTemas()]).then(([temasLista]) => {

		listaTemasGlobal = temasLista;
		temaSeleccionadoId = null;

		procesarTemas(temasLista);

    }).catch(error => {
        console.error("Error obteniendo documentos: ", error);
    });	
}


/*** FUNCIONES PARA CREAR TEMA ***/
// Vacía los input y muestra el modal
function creaTemaMostrar() {
	document.querySelector("#creaTema").value = "";
	document.querySelector("#creaTemaAlerta").innerHTML = "";

	document.querySelector("#creaTemaModal").style.display = 'flex';
}

// Valida el contenido de los input
function creaTemaValidar() {
	const tema = document.querySelector("#creaTema").value;

	let hasIssues = false;

	const alertaTema = document.querySelector("#creaTemaAlerta");
	if (tema == "") {
		alertaTema.innerHTML = "El campo no puede estar vacío.";
		hasIssues = true;
	} else {
		alertaTema.innerHTML = "";
	}

	// Si no hay errores procede a hacer solicitud a BD
	if (!hasIssues)
		creaTemaEnviar(tema);
}

// Envia la consulta de crear a BD
function creaTemaEnviar(tema) {
	cierraModal();
	document.querySelector("#esperaModal").style.display = 'flex';

	db.collection("Temas").add({
		tema: tema
	})
	.then((ref) => {
		//Vuelva a llamar a recargar la tabla
		mostrarTemas();

		cierraModal();
		document.querySelector("#resultadoModal").style.display = 'flex';
	})
	.catch((error) => {
		cierraModal();
		console.error("Error writing document: ", error);
	});
}


/*** FUNCIONES PARA ACTUALIZAR TEMA ***/
// Vacía los input y muestra el modal
function actualizaTemaMostrar(id) {
	const item = listaTemasGlobal.find(item => item.id == id);
	temaSeleccionadoId = id;

	document.querySelector("#actualizaTema").value = item.tema;
	document.querySelector("#actualizaTemaAlerta").innerHTML = "";

	document.querySelector("#actualizaTemaModal").style.display = 'flex';
}

// Valida el contenido de los input
function actualizaTemaValidar() {
	const tema = document.querySelector("#actualizaTema").value;

	let hasIssues = false;

	const alertaTema = document.querySelector("#actualizaTemaAlerta");
	if (tema == "") {
		alertaTema.innerHTML = "El campo no puede estar vacío.";
		hasIssues = true;
	} else {
		alertaTema.innerHTML = "";
	}

	// Si no hay errores procede a hacer solicitud a BD
	if (!hasIssues)
		actualizaTemaEnviar(tema);
}

// Envia la consulta de actualizar a BD
function actualizaTemaEnviar(tema) {
	cierraModal();
	document.querySelector("#esperaModal").style.display = 'flex';

	db.collection("Temas").doc(temaSeleccionadoId).set({
		tema: tema
	})
	.then((ref) => {
		//Vuelva a llamar a recargar la tabla
		mostrarTemas();

		cierraModal();
		document.querySelector("#resultadoModal").style.display = 'flex';
	})
	.catch((error) => {
		cierraModal();
		console.error("Error writing document: ", error);
	});
}


/*** FUNCIONES PARA ELIMINAR TEMA ***/
// Busca los datos del registro para mostrar modal de confirmación
function eliminaTemaMostrar(id) {
	const item = listaTemasGlobal.find(item => item.id == id);
	temaSeleccionadoId = id;
	
	document.querySelector("#eliminaTema").innerHTML = '"'+item.tema+'"';

	document.querySelector("#eliminaTemaModal").style.display = 'flex';
}

// Envia la consulta de actualizar a BD
function eliminaTemaAccion() {
	cierraModal();
	document.querySelector("#esperaModal").style.display = 'flex';

	db.collection("Temas").doc(temaSeleccionadoId).delete()
	.then((ref) => {
		//Vuelva a llamar a recargar la tabla
		mostrarTemas();

		cierraModal();
		document.querySelector("#resultadoModal").style.display = 'flex';
	})
	.catch((error) => {
		cierraModal();
		console.error("Error writing document: ", error);
	});
}