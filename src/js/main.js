// main.js
import '../scss/index.scss';
import { addRecipe } from './firebase/addRecipe';
import { getRecipes } from './firebase/getRecipes';
import { updateRecipe } from './firebase/updateRecipe';
import { deleteRecipe } from './firebase/deleteRecipe';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RecipeItemList from './components/RecipeItemList';
import Swal from 'sweetalert2';

console.log('Main.js loaded');

// DOM Elements
const addRecipeForm = document.getElementById('add-recipe-form');
// We no longer use the "recipes-list" element from index.html since RecipeItemList creates its own container.
const navbarContainer = document.getElementById('navbar');
const appContainer = document.getElementById('app');

// Render the Navbar
const navbar = Navbar();
navbarContainer.appendChild(navbar);

// Render the Hero Component
const hero = Hero();
appContainer.insertBefore(hero, addRecipeForm);

// Render the Recipe List Component
const recipeListComponent = RecipeItemList();
appContainer.appendChild(recipeListComponent);

// Define displayRecipes() to refresh the recipe list in the RecipeItemList component
async function displayRecipes() {
  const recipesListContainer = document.getElementById('recipesList'); // ensure RecipeItemList uses this id for its container
  if (recipesListContainer) {
    recipesListContainer.innerHTML = '';
    await getRecipes(recipesListContainer, handleDelete);
  }
}

async function handleDelete(recipeId) {
  // Show the confirmation dialog using SweetAlert2
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete this recipe?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    try {
      await deleteRecipe(recipeId);
      Swal.fire({
        title: 'Deleted!',
        text: 'Your recipe has been deleted.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
      displayRecipes(); // Refresh the recipe list after deletion
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'There was an error deleting your recipe.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  }
}

// Listen for the custom 'newRecipe' event from the modal (if using modal)
window.addEventListener('newRecipe', async (e) => {
  const newRecipe = e.detail;
  try {
    await addRecipe(newRecipe);
    // Show success alert
    Swal.fire({
      title: 'Success!',
      text: 'Your recipe has been created successfully!',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
    displayRecipes();
  } catch (error) {
    console.error('Error adding recipe from modal:', error);
    Swal.fire({
      title: 'Error!',
      text: 'There was an error adding your recipe.',
      icon: 'error',
      timer: 2000,
      showConfirmButton: false,
    });
  }
});

window.addEventListener('updateRecipe', async (e) => {
  const { recipeId, updatedRecipe } = e.detail;
  try {
    await updateRecipe(recipeId, updatedRecipe);
    Swal.fire({
      title: 'Updated!',
      text: 'Recipe updated successfully!',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
    displayRecipes();
  } catch (error) {
    Swal.fire({
      title: 'Error!',
      text: 'Failed to update recipe.',
      icon: 'error',
      timer: 2000,
      showConfirmButton: false,
    });
  }
});

// Event Listener for the main add recipe form (if used)
addRecipeForm.addEventListener('submit', async (event) => {
  console.log('Form submitted');
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

  try {
    await addRecipe(newRecipe);
    event.target.reset();
    displayRecipes();
  } catch (error) {
    console.error('Error adding recipe:', error);
  }
});

// Initial display of recipes when page loads
displayRecipes();
