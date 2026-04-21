import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const hasRequired = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let db = null;

if (!hasRequired) {
  console.warn(
    "[RemiMinderAI] Firebase env vars are missing. Firestore features are disabled until REACT_APP_FIREBASE_* is set."
  );
} else {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
}

export { db };

export function isFirestoreAvailable() {
  return db != null;
}
