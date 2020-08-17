import firebase from 'firebase/app';
import 'firebase/auth'

const firebaseConfig = {
    // Paste Firebase Configuration
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth()