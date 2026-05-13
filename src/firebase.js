import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA-kgFaCuV_-bocHxtRQ_HwOiashSk2qE0',
  authDomain: 'jewelry-ai-app-bba3d.firebaseapp.com',
  projectId: 'jewelry-ai-app-bba3d',
  storageBucket: 'jewelry-ai-app-bba3d.firebasestorage.app',
  messagingSenderId: '79453872525',
  appId: '1:79453872525:web:48351645a932695f151dc4'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
