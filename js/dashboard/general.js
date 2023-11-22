// Funciones reutilizables en páginas de dashboard

// Valida que el usuario inició sesión como admin
function validaSesion() {
	const usuario = sessionStorage.getItem("usuarioCorreo") ?? "";
	if (usuario == "") {
		cerrarSesion();
	}
	const perfil = document.querySelector("#sesionCorreo");
	perfil.innerHTML = `Buen día! ${usuario}`;
}

/**Función para salir de la sesión y limpiar los datos almacenados */
function cerrarSesion() {
	sessionStorage.clear();
	window.location.href = "index.html";
}

function cierraModal() {
	const modales = document.querySelectorAll(".modal");
	modales.forEach(item => {
		item.style.display = "none";
	});
}
