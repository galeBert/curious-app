import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const config =  {
    apiKey: "AIzaSyCqi8USzKUhGGu-44FvnI1V98lgeBbJhxg",
    authDomain: "curios-app-albert.firebaseapp.com",
    projectId: "curios-app-albert",
    storageBucket: "curios-app-albert.appspot.com",
    messagingSenderId: "246071523512",
    appId: "1:246071523512:web:23bba74526809469ab1c4d",
    measurementId: "G-4G14PTK8G5"
  };

  export const apps = firebase.initializeApp(config);
  export const  storage = firebase.storage()


export const auth = firebase.auth();
export const firestore = firebase.firestore();

const GoogleProvider = new  firebase.auth.GoogleAuthProvider();

GoogleProvider.setCustomParameters({ prompt: 'select_account' })

export const  signInWithGoogle = () => {
   auth.signInWithPopup(GoogleProvider)
}