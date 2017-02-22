/* --------------- REQUIREMENTS --------------- */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const firebase = require('firebase');
const admin = require('firebase-admin');
const FirebaseStore = require('connect-session-firebase')(session);
const serviceAccount = require('./config/serviceAccountKey.json');
require('dotenv').load();

/* --------------- FIREBASE --------------- */
firebase.initializeApp({
    apiKey: process.env.firebaseKey,
    authDomain: process.env.firebaseAuth,
    databaseURL: process.env.firebaseDB,
    storageBucket: process.env.firebaseStore,
    messagingSenderId: process.env.firebaseMSG
});
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: process.env.firebaseDB
});
const db = firebase.database();

const user = require('./app/users.js');

/* --------------- EXPRESS --------------- */
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
	store: new FirebaseStore({database: admin.database()}),
	secret: process.env.secret,
	resave: true,
	saveUninitialized: true
}));

/* --------------- VARIABLES --------------- */
var currentUser;

/* --------------- ROUTES --------------- */
app.get('/', function(req, res) {
	res.sendFile('index.html');
})

app.post('/signup', function(req, res, next) {
	var userdata = req.body;
	var create = new Promise(
		function (resolve, reject) {
			resolve( user.createUser(userdata) );
		}
	);

	create.then((userRecord) => {
		currentUser = userRecord;
		res.redirect('/profile');
	})
})

app.post('/login', function(req, res, next) {
	var userdata = req.body;
	var login = new Promise(
		function (resolve, reject) {
			resolve( user.loginUser(userdata.email, userdata.password) );
		}
	);

	login.then((userRecord) => {
		currentUser = userRecord;
		res.redirect('/profile');
	});	
})

app.get('/logout', function(req, res) {
	user.logout();
	currentUserID = null;
	res.redirect('/');
})

app.get('/profile', function(req, res) {
	res.sendFile(__dirname+'/public/views/profile.html');
})

app.get('/history', function(req, res) {
	res.sendFile(__dirname+'/public/views/history.html');
})

app.get('/analysis', function(req, res) {
	res.sendFile(__dirname+'/public/views/analysis.html');
})

app.get('/getprofile', function(req, res) {
	return res.json({
		uid: currentUser.uid,
		displayName: currentUser.displayName
	});
})

app.post('/getbudget', function(req, res, next) {
	var data = parse(req);
	var read = new Promise(
		function (resolve, reject) {
			db.ref(`budgets/${data.owner}/${data.year}/${data.month}`)
			.on('value', (snap) => {
				resolve(snap.val());
			});
		}
	);

	read.then((budgetdata) => {
		return res.json(budgetdata);
	});
})

app.post('/getbudgets', function(req, res, next) {
	var data = parse(req);
	var readAll = new Promise(
		function (resolve, reject) {
			db.ref(`budgets/${data.owner}`)
			.on('value', (snap) => {
				resolve(snap.val());
			});
		}
	);

	readAll.then((budgetdata) => {
		return res.json(budgetdata);
	}); 
})

app.post('/getallbudgets', function(req, res, next) {
	var data = parse(req);
	var readAll = new Promise(
		function (resolve, reject) {
			db.ref(`users/${data.owner}`)
			.on('value', (snap) => {
				resolve(snap.val());
			});
		}
	);

	readAll.then((budgetdata) => {
		return res.json(budgetdata);
	}); 
})

app.post('/savebudget', function(req, res, next) {
	var data = parse(req);
	db.ref(`budgets/${data.owner}/${data.year}/${data.month}`).set(data)
		.then(() => {
			console.log('Successfully saved budget.');
			return true;
		})
		.catch((err) => {
			console.log(`Error saving budget: ${err}`);
		});
	db.ref(`users/${data.owner}/${data.year}/${data.month}`).set({})
		.then(() => {
			console.log('Successfully saved budget in users.');
			return true;
		})
		.catch((err) => {
			console.log(`Error saving budget: ${err}`);
		});
})

/* --------------- SERVER --------------- */
const server = app.listen(process.env.port, function() {
	const host = server.address().address;
	const port = server.address().port;
	console.log("Budgie listening at http://%s:%s", host, port);
})

/* --------------- FUNCTIONS --------------- */
function parse(req) {
	var data;
	for (var key in req.body) {
		data = JSON.parse(key);
	}
	return data;
}
