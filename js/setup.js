// Configuración de Firestore para acceso a la BD
const firebaseConfig = {
	apiKey: "AIzaSyD7IEyrfMF9yHnUospGEiXSg3qv9VYLq_U",
    authDomain: "desarrollowebagosto2023.firebaseapp.com",
    projectId: "desarrollowebagosto2023",
    storageBucket: "desarrollowebagosto2023.appspot.com",
    messagingSenderId: "496384388293",
    appId: "1:496384388293:web:df11b55d42448070a614ac",
    measurementId: "G-LRJN1YYX3X"
};

// Inicializa el plugin de Firebase
firebase.initializeApp(firebaseConfig);

// Objeto db para hacer consultas
const db = firebase.firestore();
