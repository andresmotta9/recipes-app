import { getChatbotAuthCode } from './utils/getChatbotAuthCode';

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function initializeChatbotClient() {
  try {
    const apiAuthCode = await getChatbotAuthCode();

    const aiClient = new GoogleGenerativeAI({ auth: apiAuthCode });

    console.log('Chatbot client initialized.');
    return aiClient;
  } catch (error) {
    console.error('Failed to initialize the chatbot client:', error);
    return null;
  }
}
