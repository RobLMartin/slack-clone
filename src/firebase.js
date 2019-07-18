import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var config = {
  apiKey: "AIzaSyDXjZZOFQB0TWt7iLNmvsHWWd5uDK5BmIQ",
  authDomain: "slack-clone-302ac.firebaseapp.com",
  databaseURL: "https://slack-clone-302ac.firebaseio.com",
  projectId: "slack-clone-302ac",
  storageBucket: "slack-clone-302ac.appspot.com",
  messagingSenderId: "842939528384",
  appId: "1:842939528384:web:37440e81198d5d16"
};
// Initialize Firebase
firebase.initializeApp(config);

export default firebase;
