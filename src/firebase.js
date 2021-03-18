import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyCVHVI0Gtufq-RNCv2XZ-9MI7pDu7gb3ZA",
    authDomain: "netflix-build-react-5fcb3.firebaseapp.com",
    projectId: "netflix-build-react-5fcb3",
    storageBucket: "netflix-build-react-5fcb3.appspot.com",
    messagingSenderId: "910925868190",
    appId: "1:910925868190:web:70e3130d02635fe42b9f8f"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();

  export { auth };
  export default db;