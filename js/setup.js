// Configuración de Firestore para acceso a la BD
const firebaseConfig = {
	apiKey: "AIzaSyCiHNUSeT6WuB0-pfGAXWX_iL6OboVF5O4",
	authDomain: "devwebapps23.firebaseapp.com",
	databaseURL: "https://devwebapps23-default-rtdb.firebaseio.com",
	projectId: "devwebapps23",
	storageBucket: "devwebapps23.appspot.com",
	messagingSenderId: "482052415267",
	appId: "1:482052415267:web:7acc0c1ffb75a6043a7696",
	measurementId: "G-BCTBKJJTD4"
};

// Inicializa el plugin de Firebase
firebase.initializeApp(firebaseConfig);

// Objeto db para hacer consultas
const db = firebase.firestore();
