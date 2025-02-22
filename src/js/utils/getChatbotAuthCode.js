// src/js/utils/getChatbotAuthCode.js
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore();

export async function getChatbotAuthCode() {
  try {
    const docRef = doc(db, 'chatbotConfig', 'auth');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().apiAuthCode;
    } else {
      throw new Error('No chatbot auth code found in Firestore.');
    }
  } catch (error) {
    console.error('Error fetching chatbot auth code:', error);
    throw error;
  }
}
