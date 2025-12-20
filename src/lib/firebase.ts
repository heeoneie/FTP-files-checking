import { initializeApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';

// Validate required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_DATABASE_URL',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

const missingVars = requiredEnvVars.filter(
  (varName) => !import.meta.env[varName]
);

if (missingVars.length > 0) {
  const errorMessage = `Missing required Firebase environment variables: ${missingVars.join(', ')}`;
  console.error(errorMessage);
  throw new Error(errorMessage);
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app;
let database: Database;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
} catch (error) {
  const errorMessage = `Failed to initialize Firebase: ${error instanceof Error ? error.message : 'Unknown error'}`;
  console.error(errorMessage);
  throw new Error(errorMessage);
}

export { database };
