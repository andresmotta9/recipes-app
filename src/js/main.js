import '../scss/index.scss';
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

// Function to add a recipe
async function addRecipe(recipe) {
  try {
    const docRef = await addDoc(collection(db, 'recipes'), recipe);
    console.log('Recipe added with ID: ', docRef.id);
  } catch (error) {
    console.error('Error adding recipe: ', error);
  }
}

// Function to get all recipes
async function getRecipes() {
  const querySnapshot = await getDocs(collection(db, 'recipes'));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => `, doc.data());
  });
}

// Function to update a recipe
async function updateRecipe(recipeId, updatedRecipe) {
  try {
    const recipeRef = doc(db, 'recipes', recipeId);
    await updateDoc(recipeRef, updatedRecipe);
    console.log('Recipe updated successfully!');
  } catch (error) {
    console.error('Error updating recipe: ', error);
  }
}

// Function to delete a recipe
async function deleteRecipe(recipeId) {
  try {
    const recipeRef = doc(db, 'recipes', recipeId);
    await deleteDoc(recipeRef);
    console.log('Recipe deleted successfully!');
  } catch (error) {
    console.error('Error deleting recipe: ', error);
  }
}

// Example recipe object
const exampleRecipe = {
  title: 'Chocolate Cake',
  ingredients: ['2 cups of flour', '1 cup of sugar', '1 cup of cocoa powder'],
  instructions: {
    1: 'Preheat the oven to 350°F (175°C).',
    2: 'Mix flour, sugar, and cocoa powder together.',
  },
  wasPreviouslyDone: false,
  preparationTime: 45,
  difficulty: 'Medium',
  servings: 8,
  category: 'Dessert',
  imageUrl: 'http://example.com/image.jpg',
  notes: 'Best served warm.',
};

// Add a new recipe
addRecipe(exampleRecipe);

// Retrieve all recipes
getRecipes();

// Update a recipe
updateRecipe('RECIPE_ID', { title: 'Vanilla Cake' });

// Delete a recipe
deleteRecipe('RECIPE_ID');

// DOM Elements
const addRecipeForm = document.getElementById('add-recipe-form');
const recipesList = document.getElementById('recipes-list');

// Event Listeners
addRecipeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = event.target.elements['title'].value;
  const ingredients = event.target.elements['ingredients'].value.split(',');
  const instructions = event.target.elements['instructions'].value
    .split('\n')
    .reduce((acc, instruction, index) => {
      acc[index + 1] = instruction;
      return acc;
    }, {});
  const preparationTime = parseInt(
    event.target.elements['preparationTime'].value,
    10
  );
  const difficulty = event.target.elements['difficulty'].value;
  const servings = parseInt(event.target.elements['servings'].value, 10);
  const category = event.target.elements['category'].value;
  const imageUrl = event.target.elements['imageUrl'].value;
  const notes = event.target.elements['notes'].value;

  const newRecipe = {
    title,
    ingredients,
    instructions,
    wasPreviouslyDone: false,
    preparationTime,
    difficulty,
    servings,
    category,
    imageUrl,
    notes,
  };

  addRecipe(newRecipe);
  event.target.reset();
});

// Function to display recipes
async function displayRecipes() {
  recipesList.innerHTML = '';
  const querySnapshot = await getDocs(collection(db, 'recipes'));
  querySnapshot.forEach((doc) => {
    const recipe = doc.data();
    const recipeItem = document.createElement('div');
    recipeItem.classList.add('recipe-item');
    recipeItem.innerHTML = `
      <h3>${recipe.title}</h3>
      <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
      <p><strong>Instructions:</strong></p>
      <ol>
        ${Object.values(recipe.instructions)
          .map((instruction) => `<li>${instruction}</li>`)
          .join('')}
      </ol>
      <p><strong>Preparation Time:</strong> ${
        recipe.preparationTime
      } minutes</p>
      <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
      <p><strong>Servings:</strong> ${recipe.servings}</p>
      <p><strong>Category:</strong> ${recipe.category}</p>
      <img src="${recipe.imageUrl}" alt="${recipe.title}" />
      <p><strong>Notes:</strong> ${recipe.notes}</p>
      <button onclick="deleteRecipe('${doc.id}')">Delete</button>
    `;
    recipesList.appendChild(recipeItem);
  });
}

// Initial display of recipes
displayRecipes();
