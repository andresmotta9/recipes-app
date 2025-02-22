// src/js/chatbotInit.js
import { getChatbotAuthCode } from './utils/getChatbotAuthCode';
// Import the AI client from Google's generative AI module.
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function initializeChatbotClient() {
  try {
    const apiAuthCode = await getChatbotAuthCode();
    // Initialize the AI client with the auth code
    const aiClient = new GoogleGenerativeAI({ auth: apiAuthCode });

    console.log('Chatbot client initialized.');
    return aiClient;
  } catch (error) {
    console.error('Failed to initialize the chatbot client:', error);
    return null;
  }
}
