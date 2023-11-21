//usuario para pruebas
//correo: a01327530@tec.mx
//pass: prueba123

// Consulta de usuario en BD
function iniciarSesion(correo, contrasena) {
    db.collection("administradores").where("correo", "==", correo).where("contrasena", "==", contrasena).get().then((querySnapshot) => {

		//se encontró un administrador
		if (querySnapshot.docs.length > 0) {
			const administrador = querySnapshot.docs[0];

			sessionStorage.setItem("usuarioCorreo", administrador.data().correo);
		
			window.location.href = "dashboard.html";
		} else {
			alert("El correo o contraseña es incorrecto.");
		}
    });
}

// Función que realizará login a base de datos
function login() {
	//Obtiene valores de inputs en formulario
	const correo = document.querySelector("#correo").value;
	const pass = document.querySelector("#contrasena").value;

	// Valida datos no vacios y formato de correo antes de hacer la consulta
	if (verificarCorreo(correo)) {
		if (pass != "") {
			// Ejecuta consulta con datos
			iniciarSesion(correo, pass);

		} else {
			alert("Se necesita una contraseña para iniciar sesión");
		}
	} else {
		alert("El correo de usuario no es válido");
	}
}

function verificarCorreo(correo) {
	const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(correo);
}