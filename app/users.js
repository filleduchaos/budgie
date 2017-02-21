const firebase = require('firebase'),
	admin = require('firebase-admin');
module.exports = {
	createUser(userdata) {
		admin.auth().createUser(userdata)
			.then((userRecord) => {
				console.log(`Created account for ${userRecord.displayName}`);
			})
			.catch((err) => {
				console.log(`Error creating account: ${err}`);
			});
	},

	loginUser(email, password) {
		firebase.auth().signInWithEmailAndPassword(email, password)
			.then((userRecord) => {
				console.log(`${userRecord.displayName} has signed in.`);
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