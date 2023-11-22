// Obtiene las frases de la BD
function obtenerTextos(tema = 0) {
    const frasesColeccion = db.collection("Frases");

    // Si el alumno tiene un tema, aplica filtro en consulta
    if (tema != 0) {
        frasesColeccion.where("tema", "==", tema);
    }

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

// Cambia el contenido del HTML que muestra la frase
function changeMotivationalText(frasesLista, indice) {
    if (indice < frasesLista.length) {
        const motivationalText = document.getElementById("motivational-text");
    
        motivationalText.innerHTML = frasesLista[indice].frase + "<br />-" + frasesLista[indice].autor??"Anónimo";
        indice = (indice + 1) % frasesLista.length;
    
        // Espera unos segundos antes de mostrar la siguiente frase
        setTimeout(changeMotivationalText, 4000, frasesLista, indice);
    }
}

// Solicita las frases y despues las muestra, cambiando en un intervalo definido
function iniciarFrases() {
    // Si hay un tema del usuario, se usará en la consulta
    const tema = Number(sessionStorage.getItem("usuarioTema") ?? 0);

    Promise.all([obtenerTextos(tema)]).then(([frasesLista]) => {

        //Llamada inicial a mostrar las frases
        changeMotivationalText(frasesLista, 0);

    }).catch(error => {
        console.error("Error obteniendo documentos: ", error);
    });
}

iniciarFrases();