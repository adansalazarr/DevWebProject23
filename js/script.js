// Frases motivacionales
let peticionFrases = new XMLHttpRequest();
peticionFrases.open('GET', "./jsons/frases.json", false); 
peticionFrases.send(null);
const motivationalPhrases = JSON.parse(peticionFrases.responseText);

const motivationalText = document.getElementById("motivational-text");
let currentPhraseIndex = 0;

function changeMotivationalText() {
    motivationalText.innerHTML = motivationalPhrases[currentPhraseIndex].frase.replace("-","<br />-");
    currentPhraseIndex = (currentPhraseIndex + 1) % motivationalPhrases.length;
}

// Cambio automático de frase motivacional cada 4 segundos
changeMotivationalText();
setInterval(changeMotivationalText, 4000);
