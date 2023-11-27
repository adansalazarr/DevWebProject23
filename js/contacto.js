// Formulario de preguntas


/**Verificar que los datos son validos*/
function prepararCorreo() {
	const correo = document.querySelector("#correo").value;
	const asunto = document.querySelector("#asunto").value;
	const mensaje = document.querySelector("#mensaje").value;

	if (verificarCorreo(correo)) {
		if (asunto != "") {
			if (mensaje != "") {
				enviarCorreo(correo, asunto, mensaje);
			} else {
				alert("El mensaje no puede ir vacío.");
			}
		} else {
			alert("El asunto no puede ir vacío.");
		}
	} else {
		alert("El correo electrónico no es válido.");
	}
}


function enviarCorreo(correo, asunto, mensaje) {

}


function verificarCorreo(correo) {
	const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(correo);
}