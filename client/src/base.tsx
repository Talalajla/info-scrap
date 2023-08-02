import { initializeApp } from "firebase/app";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyA5ji7zRy675SJ0QHhbkwQdzAWyr7ZQQAE",
    authDomain: "info-scrap.firebaseapp.com",
    projectId: "info-scrap",
    messagingSenderId: "934050825120",
    appId: "1:934050825120:web:46107f12fe34892a3a9ac5",
    databaseURL: 'https://info-scrap-default-rtdb.europe-west1.firebasedatabase.app/',
};

initializeApp(firebaseConfig);