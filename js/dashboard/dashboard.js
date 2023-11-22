let listaFrasesGlobal = [];
let fraseSeleccionadaId = null;

validaSesion();
mostrarFrases();

//Consulta a BD para obtener todas las frases
function obtenerFrases() {
	const frasesColeccion = db.collection("Frases");

    return frasesColeccion.get().then((querySnapshot) => {
        const frasesLista = [];

		querySnapshot.forEach((doc) => {
			const tmp = { ...doc.data() };
			tmp.id = doc.id;
            frasesLista.push(tmp);
        });

		return frasesLista;
    });
}

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
	// Opción por defecto
	let selectOpciones = `<option value="0">-Selecciona-</option>`;

	//Genera HTML de cada opción de tema
	temasLista.forEach(item => {
		selectOpciones += `<option value="${item.id}">${item.tema}</option>`;
	});

	// Actualiza los elementos en HTML
	document.querySelector("#creaTema").innerHTML = selectOpciones;
	document.querySelector("#actualizaTema").innerHTML = selectOpciones;
}

// Construye el HTML de la tabla y lo actualiza
function procesarFrases(frasesLista) {

	// Encabezados de tabla
	let tablaHTML = `
		<thead>
			<tr>
				<th class="tabla-columna-comprime">Id</th>
				<th>Frase</th>
				<th>Autor</th>
				<th>Tema</th>
				<th class="tabla-columna-comprime text-center">Opciones</th>
			<tr>
		</thead>
		<tbody>`;

	if (frasesLista.length > 0) {
		// Genera las filas de tabla con arreglo de frases
		frasesLista.forEach(fraseItem => {
			let autorFormat = fraseItem.autor??``;

			if (autorFormat == "")
				autorFormat = `Anónimo`;

			tablaHTML += `
				<tr>
					<td class="tabla-columna-comprime">${fraseItem.id}</td>
					<td>${fraseItem.frase}</td>
					<td>${autorFormat}</td>
					<td>${fraseItem.tema_nombre}</td>
					<td class="tabla-columna-comprime text-center">
						<button type="button" onclick="actualizaFraseMostrar('${fraseItem.id}')">Editar</button>
						<button type="button" onclick="eliminaFraseMostrar('${fraseItem.id}')" class="boton boton-red">Eliminar</button>
					</td>
				</tr>`;
		});
	} else {
		// Arreglo de frases vacío, notificar en tabla
		tablaHTML += `
				<tr>
					<td colspan="5" class="text-center">
						No se encontraron registros para frases motivacionales
					</td>
				</tr>`;
	}

	tablaHTML += `</tbody>`;

	// Actualizar HTML de la tabla
	const tablaElemento = document.querySelector("#tablaFrases");
	tablaElemento.innerHTML = tablaHTML;
}

// Solicita los datos necesarios a BD para actualizar el contenido de la página
function mostrarFrases() {
	Promise.all([obtenerFrases(), obtenerTemas()]).then(([frasesLista, temasLista]) => {

		procesarTemas(temasLista);

		// Vincula el nombre del tema con el id_tema dentro de cada frase
		frasesLista.forEach(fraseItem => {
			fraseItem.tema_nombre = temasLista.find(item => fraseItem.id_tema == item.id).tema;
		});

		listaFrasesGlobal = frasesLista;
		fraseSeleccionadaId = null;

        procesarFrases(frasesLista);

    }).catch(error => {
        console.error("Error obteniendo documentos: ", error);
    });	
}


/*** FUNCIONES PARA CREAR FRASE ***/
// Vacía los input y muestra el modal
function creaFraseMostrar() {
	document.querySelector("#creaFrase").value = "";
	document.querySelector("#creaFraseAlerta").innerHTML = "";

	document.querySelector("#creaAutor").value = "";
	document.querySelector("#creaAutorAlerta").innerHTML = "";

	document.querySelector("#creaTema").value = 0;
	document.querySelector("#creaTemaAlerta").innerHTML = "";

	document.querySelector("#creaFraseModal").style.display = 'flex';
}

// Valida el contenido de los input
function creaFraseValidar() {
	const texto = document.querySelector("#creaFrase").value;
	const autor = document.querySelector("#creaAutor").value;
	const tema = document.querySelector("#creaTema").value;

	let hasIssues = false;

	const alertaFrase = document.querySelector("#creaFraseAlerta");
	if (texto == "") {
		alertaFrase.innerHTML = "El campo no puede estar vacío.";
		hasIssues = true;
	} else {
		alertaFrase.innerHTML = "";
	}

	/* Autor es opcional, no hay validación
	const alertaAutor = document.querySelector("#creaAutorAlerta");
	if (autor == "") {
		alertaAutor.innerHTML = "El campo no puede estar vacío.";
		hasIssues = true;
	} else {
		alertaAutor.innerHTML = "";
	}*/

	const alertaTema = document.querySelector("#creaTemaAlerta");
	if (tema == 0) {
		alertaTema.innerHTML = "Debe selecciona una opción.";
		hasIssues = true;
	} else {
		alertaTema.innerHTML = "";
	}

	// Si no hay errores procede a hacer solicitud a BD
	if (!hasIssues)
		creaFraseEnviar(texto, autor, tema);
}

// Envia la consulta de crear a BD
function creaFraseEnviar(texto, autor, tema) {
	cierraModal();
	document.querySelector("#esperaModal").style.display = 'flex';

	db.collection("Frases").add({
		frase: texto,
		autor: autor,
		id_tema: tema
	})
	.then((ref) => {
		//Vuelva a llamar a recargar la tabla
		mostrarFrases();

		cierraModal();
		document.querySelector("#resultadoModal").style.display = 'flex';
	})
	.catch((error) => {
		cierraModal();
		console.error("Error writing document: ", error);
	});
}


/*** FUNCIONES PARA ACTUALIZAR FRASE ***/
// Vacía los input y muestra el modal
function actualizaFraseMostrar(id) {
	const item = listaFrasesGlobal.find(item => item.id == id);
	fraseSeleccionadaId = id;
	
	document.querySelector("#actualizaFrase").value = item.frase;
	document.querySelector("#actualizaAutor").value = item.autor;
	document.querySelector("#actualizaTema").value = item.id_tema;

	document.querySelector("#actualizaFraseModal").style.display = 'flex';
}

// Valida el contenido de los input
function actualizaFraseValidar() {
	const frase = document.querySelector("#actualizaFrase").value;
	const autor = document.querySelector("#actualizaAutor").value;
	const tema = document.querySelector("#actualizaTema").value;

	let hasIssues = false;

	const alertaFrase = document.querySelector("#actualizaFraseAlerta");
	if (frase == "") {
		alertaFrase.innerHTML = "El campo no puede estar vacío.";
		hasIssues = true;
	} else {
		alertaFrase.innerHTML = "";
	}

	const alertaTema = document.querySelector("#actualizaTemaAlerta");
	if (tema == "") {
		alertaTema.innerHTML = "Debe selecciona una opción.";
		hasIssues = true;
	} else {
		alertaTema.innerHTML = "";
	}

	// Si no hay errores procede a hacer solicitud a BD
	if (!hasIssues)
		actualizaFraseEnviar(frase, autor, tema);
}

// Envia la consulta de actualizar a BD
function actualizaFraseEnviar(frase, autor, tema) {
	cierraModal();
	document.querySelector("#esperaModal").style.display = 'flex';

	db.collection("Frases").doc(temaSeleccionadoId).set({
		frase: frase,
		autor: autor,
		id_tema: tema
	})
	.then((ref) => {
		//Vuelva a llamar a recargar la tabla
		mostrarFrases();

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
function eliminaFraseMostrar(id) {
	const item = listaFrasesGlobal.find(item => item.id == id);
	fraseSeleccionadaId = id;
	
	document.querySelector("#eliminaFrase").innerHTML = '"'+item.frase+'"';

	document.querySelector("#eliminaFraseModal").style.display = 'flex';
}

// Envia la consulta de actualizar a BD
function eliminaFraseAccion() {
	cierraModal();
	document.querySelector("#esperaModal").style.display = 'flex';

	db.collection("Frases").doc(fraseSeleccionadaId).delete()
	.then((ref) => {
		//Vuelva a llamar a recargar la tabla
		mostrarFrases();

		cierraModal();
		document.querySelector("#resultadoModal").style.display = 'flex';
	})
	.catch((error) => {
		cierraModal();
		console.error("Error writing document: ", error);
	});
}