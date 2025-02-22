// src/js/firebase/deleteRecipe.js
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function deleteRecipe(recipeId) {
  try {
    const recipeRef = doc(db, 'recipes', recipeId);
    await deleteDoc(recipeRef);
    console.log('Recipe deleted successfully!');
  } catch (error) {
    console.error('Error deleting recipe:', error);
  }
}
