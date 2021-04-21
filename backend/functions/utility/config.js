const  firebase =  require('firebase') 
require('firebase/storage') 

const config =  {
    apiKey: "AIzaSyCqi8USzKUhGGu-44FvnI1V98lgeBbJhxg",
    authDomain: "curios-app-albert.firebaseapp.com",
    projectId: "curios-app-albert",
    storageBucket: "curios-app-albert.appspot.com",
    messagingSenderId: "246071523512",
    appId: "1:246071523512:web:23bba74526809469ab1c4d",
    measurementId: "G-4G14PTK8G5"
  };

  module.exports = firebase.initializeApp(config);

