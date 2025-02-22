import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

// Function to update a recipe
export async function updateRecipe(recipeId, updatedRecipe) {
  try {
    const recipeRef = doc(db, 'recipes', recipeId);
    await updateDoc(recipeRef, updatedRecipe);
    console.log('Recipe updated successfully!');
  } catch (error) {
    console.error('Error updating recipe: ', error);
  }
}
