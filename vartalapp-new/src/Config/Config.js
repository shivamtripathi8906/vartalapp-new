import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAIKfrRUK-yoOVFWVGt1EsF1d0VCYjdqmk",
    authDomain: "vartalaap-message.firebaseapp.com",
    projectId: "vartalaap-message",
    storageBucket: "vartalaap-message.appspot.com",
    messagingSenderId: "975520215363",
    appId: "1:975520215363:web:83925a49e7f63e52d23ff6",
    measurementId: "G-CBSNYYGMWJ"
  };

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const phoneProvider= firebase.auth.PhoneAuthProvider.PROVIDER_ID;
const storage = firebase.storage();

export { auth, storage, phoneProvider, db, firebase};
