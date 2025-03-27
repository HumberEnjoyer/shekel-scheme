import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";

    const firebaseConfig = {
        apiKey: "AIzaSyAtq7eyxi8KALdkafdeSPUffA9gNVKHt2E",
        authDomain: "shekel-scheme.firebaseapp.com",
        projectId: "shekel-scheme",
        storageBucket: "shekel-scheme.firebasestorage.app",
        messagingSenderId: "511001738954",
        appId: "1:511001738954:web:a76819d0dd91aafdc63e33",
        measurementId: "G-73ED3DD8Y3"
      };

      const app = initializeApp (firebaseConfig);
      export const db = getFirestore(app);
      export const auth = getAuth(app);
