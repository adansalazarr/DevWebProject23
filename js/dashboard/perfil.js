//id para operaciones del usuario
const usuarioId = sessionStorage.getItem("usuarioId");

document.querySelector("#correo").value = sessionStorage.getItem("usuarioCorreo");

validaSesion();

// Al presionar el botón valida que el input no se encuentra vacío y es un correo
function actualizarCorreo() {
	const correo = document.querySelector("#correo").value;

	if (verificarCorreo(correo)) {
		actualizaUsuario(correo);
	} else {
		alert("El correo electrónico ingresado no es válido.");
	}
}

// Envia el nuevo correo al servidor
function actualizaUsuario(correo) {
	cierraModal();
	document.querySelector("#esperaModal").style.display = 'flex';

	db.collection("Administradores").doc(usuarioId).update({
		correo: correo
	})
	.then((ref) => {
		// Envia el nuevo correo a SessionStorage
		actualizaSesion(correo);

		cierraModal();
		document.querySelector("#resultadoModal").style.display = 'flex';
	})
	.catch((error) => {
		cierraModal();
		console.error("Error writing document: ", error);
	});
}

// Actualiza el almacenamiento local
function actualizaSesion(correo) {
	sessionStorage.setItem("usuarioCorreo", correo);
	document.querySelector("#sesionCorreo").innerHTML = `Buen día! ${correo}`;
}


// Valida los input para actualizar la contraseña
function actualizarContrasena() {
	const actual = document.querySelector("#contrasenaActual").value;
	const nueva = document.querySelector("#contrasenaNueva").value;

	if (actual != "") {
		if (nueva != "") {
			if (actual != nueva) {
				validarContrasena(actual, nueva);
			} else {
				alert("La contraseña nueva no puede ser la misma que la actual.");
			}
		} else {
			alert("La contraseña nueva no puede estar vacía.");
		}
	} else {
		alert("La contraseña actual no puede estar vacía.");
	}
}

/**Envia los datos de actualización de contraseña a servidor*/
function validarContrasena(actual, nueva) {
	cierraModal();
	document.querySelector("#esperaModal").style.display = 'flex';

	db.collection("Administradores").doc(usuarioId).get()
	.then((querySnapshot) => {
		
		if (querySnapshot.data().contrasena == actual) {
			// La contraseña anterior coincide, procede a reemplazar
			enviaContrasena(nueva);
		} else {
			cierraModal();
			alert("La contraseña actual es incorrecta.");
		}
	})
	.catch((error) => {
		cierraModal();
		console.error("Error writing document: ", error);
	});
}

function enviaContrasena(nueva) {

	document.querySelector("#contrasenaActual").value = "";
	document.querySelector("#contrasenaNueva").value = "";

	db.collection("Administradores").doc(usuarioId).update({
		contrasena: nueva
	})
	.then((ref) => {
		// Envia el nuevo correo a SessionStorage
		actualizaSesion(correo);

		cierraModal();
		document.querySelector("#resultadoModal").style.display = 'flex';
	})
	.catch((error) => {
		cierraModal();
		console.error("Error writing document: ", error);
	});
}

function verificarCorreo(correo) {
	const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(correo);
}