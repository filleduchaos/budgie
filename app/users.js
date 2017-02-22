const firebase = require('firebase');
const admin = require('firebase-admin');
const db = firebase.database();

module.exports = {
	createUser(userdata) {
		return admin.auth().createUser(userdata)
			.then((userRecord) => {
				console.log(`Created account for ${userRecord.displayName}`);
				return this.loginUser(userdata.email, userdata.password);
			})
			.catch((err) => {
				console.log(`Error creating account: ${err}`);
			});
	},

	loginUser(email, password) {
		return firebase.auth().signInWithEmailAndPassword(email, password)
			.then((userRecord) => {
				console.log(`${userRecord.displayName} has signed in.`);
				return userRecord;
			})
			.catch((err) => {
				console.log(`Error signing in: ${err}`);
			});
	},

	logout() {
		firebase.auth().signOut()
			.then(() => {
				console.log('Signed out.');
			})
			.catch((err) => {
				console.log(`Error signing out: ${err}`);
			});
	}
}