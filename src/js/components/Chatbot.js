import { GoogleGenerativeAI } from '@google/generative-ai';
import { getChatbotAuthCode } from '../utils/getChatbotAuthCode';
import { addRecipe } from '../firebase/addRecipe';
import { updateRecipe } from '../firebase/updateRecipe';
import { deleteRecipe } from '../firebase/deleteRecipe';
import Swal from 'sweetalert2';

export default async function Chatbot() {
  const container = document.createElement('div');
  container.classList.add('chatbot-container');

  const chatWindow = document.createElement('div');
  chatWindow.classList.add('chat-window');

  const messagesContainer = document.createElement('div');
  messagesContainer.classList.add('messages-container');

  const inputContainer = document.createElement('div');
  inputContainer.classList.add('input-container');

  const inputField = document.createElement('input');
  inputField.setAttribute('type', 'text');
  inputField.setAttribute('placeholder', 'Ask me something...');
  inputField.classList.add('chat-input');

  const sendButton = document.createElement('button');
  sendButton.textContent = 'Send';
  sendButton.classList.add('chat-send');

  inputContainer.appendChild(inputField);
  inputContainer.appendChild(sendButton);
  chatWindow.appendChild(messagesContainer);
  chatWindow.appendChild(inputContainer);
  container.appendChild(chatWindow);

  function addMessage(text, sender = 'user') {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  let aiClient;
  try {
    const apiAuthCode = await getChatbotAuthCode();
    aiClient = new GoogleGenerativeAI(apiAuthCode);
  } catch (error) {
    addMessage('Error connecting to AI.', 'bot');
    console.error('AI Init Error:', error);
  }

  let isCollectingRecipe = false;
  let isEditingRecipe = false;
  let currentRecipeId = null;
  let stepIndex = 0;
  let recipeData = {};
  const steps = [
    { key: 'title', message: 'What is the name of the recipe?' },
    { key: 'ingredients', message: 'List ingredients (comma separated).' },
    { key: 'instructions', message: 'List the instructions (line separated).' },
    { key: 'preparationTime', message: 'How many minutes to prepare?' },
    { key: 'difficulty', message: 'Difficulty level? (Easy, Medium, Hard)' },
    { key: 'servings', message: 'How many servings?' },
    { key: 'category', message: 'What category?' },
    { key: 'imageUrl', message: 'Provide an image URL.' },
    { key: 'notes', message: 'Any additional notes?' },
  ];

  async function processUserInput(userInput) {
    addMessage(userInput, 'user');

    if (!aiClient) {
      addMessage("I'm currently unavailable.", 'bot');
      return;
    }

    addMessage('Thinking...', 'bot');

    try {
      if (isCollectingRecipe) {
        await handleRecipeCreation(userInput);
        return;
      }

      if (isEditingRecipe) {
        await handleRecipeEditing(userInput);
        return;
      }

      const model = aiClient.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(userInput);
      const aiResponse = result.response.text();

      messagesContainer.lastChild.remove();
      addMessage(aiResponse, 'bot');

      await handleAICommands(userInput.toLowerCase());
    } catch (error) {
      console.error('AI Error:', error);
      addMessage("I couldn't understand that.", 'bot');
    }
  }

  async function handleAICommands(userInput) {
    if (userInput.includes('add recipe')) {
      isCollectingRecipe = true;
      recipeData = {};
      addMessage(steps[0].message, 'bot');
    } else if (userInput.includes('edit recipe')) {
      isEditingRecipe = true;
      addMessage('Enter the recipe ID you want to edit.', 'bot');
    } else if (userInput.includes('delete recipe')) {
      addMessage('Enter the recipe ID to delete:', 'bot');
    }
  }

  async function handleRecipeCreation(userInput) {
    const currentStep = steps[stepIndex];

    if (currentStep.key === 'ingredients') {
      recipeData.ingredients = userInput.split(',').map((ing) => ing.trim());
    } else if (currentStep.key === 'instructions') {
      recipeData.instructions = userInput
        .split('\n')
        .reduce((acc, instruction, index) => {
          acc[index + 1] = instruction.trim();
          return acc;
        }, {});
    } else if (
      currentStep.key === 'preparationTime' ||
      currentStep.key === 'servings'
    ) {
      recipeData[currentStep.key] = parseInt(userInput, 10);
    } else {
      recipeData[currentStep.key] = userInput.trim();
    }

    stepIndex++;

    if (stepIndex < steps.length) {
      addMessage(steps[stepIndex].message, 'bot');
    } else {
      isCollectingRecipe = false;
      stepIndex = 0;
      recipeData.wasPreviouslyDone = false;

      try {
        await addRecipe(recipeData);
        recipeData = {};
        Swal.fire({
          title: 'Recipe Added!',
          text: 'Your recipe is saved.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        window.dispatchEvent(new Event('refreshRecipes'));
      } catch (error) {
        addMessage('Error saving the recipe.', 'bot');
      }
    }
  }

  async function handleRecipeEditing(userInput) {
    if (!currentRecipeId) {
      currentRecipeId = userInput.trim();
      addMessage(
        `Editing recipe: ${currentRecipeId}. Enter the new title.`,
        'bot'
      );
    } else {
      recipeData.title = userInput.trim();
      try {
        await updateRecipe(currentRecipeId, recipeData);
        Swal.fire({
          title: 'Recipe Updated!',
          text: 'Recipe has been updated.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        window.dispatchEvent(new Event('refreshRecipes'));
      } catch (error) {
        addMessage('Error updating the recipe.', 'bot');
      }
      isEditingRecipe = false;
      currentRecipeId = null;
    }
  }

  sendButton.addEventListener('click', async () => {
    const userInput = inputField.value.trim();
    if (!userInput) return;
    inputField.value = '';
    processUserInput(userInput);
  });

  inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendButton.click();
    }
  });

  return container;
}
