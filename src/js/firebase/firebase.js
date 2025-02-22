import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCTMuIdf9I1O-6b0HoIRNq_knRSugF0v-o',
  authDomain: 'recipe-app-9a9d3.firebaseapp.com',
  projectId: 'recipe-app-9a9d3',
  storageBucket: 'recipe-app-9a9d3.firebasestorage.app',
  messagingSenderId: '421349767654',
  appId: '1:421349767654:web:c1fb2585428be6c6f37e27',
  measurementId: 'G-TDHW67H4RX',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
