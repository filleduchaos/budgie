/* --------------- REQUIREMENTS --------------- */
const express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	session = require('express-session');
	firebase = require('firebase-admin'),
	FirebaseStore = require('connect-session-firebase')(session),
	serviceAccount = require('./config/serviceAccountKey.json');
require('dotenv').load();

/* --------------- FIREBASE --------------- */
firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
    // apiKey: process.env.firebaseKey,
    // authDomain: process.env.firebaseAuth,
    databaseURL: process.env.firebaseDB,
    // storageBucket: process.env.firebaseStore,
    // messagingSenderId: process.env.firebaseMSG
});
const db = firebase.database();

/* --------------- EXPRESS --------------- */
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
	store: new FirebaseStore({
		database: db
	}),
	secret: process.env.secret,
	resave: true,
	saveUninitialized: true
}));

/* --------------- ROUTES --------------- */
app.get('/', function(req, res) {
	res.send('Server running');
})

/* --------------- SERVER --------------- */
const server = app.listen(process.env.port, function() {
	const host = server.address().address;
	const port = server.address().port;
	console.log("Budgie listening at http://%s:%s", host, port);
})