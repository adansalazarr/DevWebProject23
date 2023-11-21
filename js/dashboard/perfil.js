const usuario = sessionStorage.getItem("usuarioCorreo") ?? "";
if (usuario == "") {
	window.location.href = "../index.html";
}
const perfil = document.querySelector("#sesionCorreo");
perfil.innerHTML = `Buen día! ${usuario}`;

document.querySelector("#correo").value = usuario;

/**Función para subir el nuevo correo electrónico a datos de acceso del usuario */
function actualizarCorreo() {
	const correo = document.querySelector("#correo").value;

	if (verificarCorreo(correo)) {
		actualizaSesion(correo);
	} else {
		alert("El correo electrónico ingresado no es válido.");
	}
}


/**Función para cambiar la contrasena del usuario */
function actualizarContrasena() {
	const actual = document.querySelector("#contrasenaActual").value;
	const nueva = document.querySelector("#contrasenaNueva").value;

	if (actual != "") {
		if (nueva != "") {
			if (actual != nueva) {
				actualizaContrasena(actual, nueva);
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


/**Envia el valor del correo a servidor (temporalmente solo hace cambio de localstorage) */
function actualizaSesion(correo) {
	sessionStorage.setItem("usuarioCorreo", correo);
	perfil.innerHTML = `Hola ${sessionStorage.getItem("usuarioCorreo")??""}!`;

	alert("El correo se ha actualizado correctamente.");
}


/**Función para salir de la sesión y limpiar los datos almacenados */
function cerrarSesion() {
	
	localStorage.clear();
	
	window.location.href = "index.html";
	
}


/**Envia los datos de actualización de contraseña a servidor*/
function actualizaContrasena(actual, nueva) {
	document.querySelector("#contrasenaActual").value = "";
	document.querySelector("#contrasenaNueva").value = "";

	alert("La contraseña se ha actualizado correctamente.");

}

function verificarCorreo(correo) {
	const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(correo);
}