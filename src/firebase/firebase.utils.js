import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyC2A9ERYPsbiLR1C-hHqw0JnzouuqYQoD8",
    authDomain: "ecommerce-db-ad249.firebaseapp.com",
    databaseURL: "https://ecommerce-db-ad249.firebaseio.com",
    projectId: "ecommerce-db-ad249",
    storageBucket: "ecommerce-db-ad249.appspot.com",
    messagingSenderId: "190626164372",
    appId: "1:190626164372:web:86a987ffd3fdfcd37d8e81",
    measurementId: "G-Z16T25EC8E"
};

firebase.initializeApp(config);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }

  return userRef;
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
