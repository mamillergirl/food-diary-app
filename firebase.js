import firebase from 'firebase/compat/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACT5m4TtwiD_vWoPgprWaMK3W1jKhHePE",
  authDomain: "iride-9c709.firebaseapp.com",
  projectId: "iride-9c709",
  storageBucket: "iride-9c709.appspot.com",
  messagingSenderId: "286560912255",
  appId: "1:286560912255:web:9e2866838304961bd1104a"
};


 if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
 }
 export {firebase};
 const app = firebase.initializeApp(firebaseConfig);
 const auth = getAuth(app);

 const db = getFirestore(app);
 export { app, auth, db };