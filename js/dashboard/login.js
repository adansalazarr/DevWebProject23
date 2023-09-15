/**Función que realizará login a base de datos */
function login() {
	const correo = document.querySelector("#correo").value;
	const pass = document.querySelector("#contrasena").value;

	console.log(correo);

	if (verificarCorreo(correo) && pass != "") {
		sessionStorage.setItem("usuarioCorreo", correo);
	
		window.location.href = "dashboard.html";
	} else {
		alert("Error al iniciar sesion");
	}
}

function verificarCorreo(correo) {
	const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(correo);
}