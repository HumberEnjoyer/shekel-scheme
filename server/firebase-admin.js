import admin from "firebase-admin";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = {
  "type": "service_account",
  "project_id": process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
  "private_key": process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const db = admin.firestore();