import '../scss/index.scss';
import { addRecipe } from './firebase/addRecipe';
import { getRecipes } from './firebase/getRecipes';
import { updateRecipe } from './firebase/updateRecipe';
import { deleteRecipe } from './firebase/deleteRecipe';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RecipeItemList from './components/RecipeItemList';
import Chatbot from './components/Chatbot';
import Modal from './components/Modal';
import Swal from 'sweetalert2';

console.log('Main.js loaded');

const navbarContainer = document.getElementById('navbar');
const appContainer = document.getElementById('app');

if (!navbarContainer || !appContainer) {
  console.error('Navbar or App container not found in the DOM.');
}

const navbar = Navbar();
navbarContainer.appendChild(navbar);
appContainer.appendChild(navbar);

const hero = Hero();
appContainer.appendChild(hero);

const recipeListComponent = RecipeItemList();
appContainer.appendChild(recipeListComponent);

Chatbot()
  .then((chatbotElement) => {
    if (chatbotElement) {
      appContainer.appendChild(chatbotElement);
    } else {
      console.error('Chatbot failed to initialize.');
    }
  })
  .catch((error) => {
    console.error('Error loading chatbot:', error);
  });

async function displayRecipes() {
  const recipesListContainer = document.getElementById('recipesList');
  if (recipesListContainer) {
    recipesListContainer.innerHTML = '';
    await getRecipes(recipesListContainer, handleDelete, handleEdit);
  }
}

window.addEventListener('newRecipe', async (e) => {
  try {
    await addRecipe(e.detail);
    await Swal.fire({
      title: 'Recipe Added!',
      text: 'Your new recipe has been saved successfully.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
    displayRecipes();
  } catch (error) {
    console.error('Error adding recipe via modal:', error);
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
  try {
    const { recipeId, updatedRecipe } = e.detail;
    await updateRecipe(recipeId, updatedRecipe);
    await Swal.fire({
      title: 'Recipe Updated!',
      text: 'Your recipe has been updated successfully.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
    displayRecipes();
  } catch (error) {
    console.error('Error updating recipe via modal:', error);
    Swal.fire({
      title: 'Error!',
      text: 'There was an error updating your recipe.',
      icon: 'error',
      timer: 2000,
      showConfirmButton: false,
    });
  }
});

async function handleDelete(recipeId) {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete this recipe?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    await deleteRecipe(recipeId);
    await Swal.fire({
      title: 'Deleted!',
      text: 'Your recipe has been deleted.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
    displayRecipes();
  }
}

async function handleEdit(recipe) {
  const editModal = Modal(recipe);
  document.body.appendChild(editModal);
}

window.addEventListener('refreshRecipes', displayRecipes);

displayRecipes();
