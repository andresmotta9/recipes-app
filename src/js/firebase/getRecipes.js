// src/js/firebase/getRecipes.js
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import RecipeItem from '../components/RecipeItem';

export async function getRecipes(recipesList, onDelete) {
  recipesList.innerHTML = '';
  try {
    const querySnapshot = await getDocs(collection(db, 'recipes'));
    querySnapshot.forEach((doc) => {
      const recipe = doc.data();
      recipe.id = doc.id;
      const recipeItem = RecipeItem(recipe, onDelete);
      recipesList.appendChild(recipeItem);
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
  }
}
