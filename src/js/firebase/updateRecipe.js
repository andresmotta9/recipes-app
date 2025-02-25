import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function updateRecipe(recipeId, updatedRecipe) {
  try {
    const recipeRef = doc(db, 'recipes', recipeId);
    await updateDoc(recipeRef, updatedRecipe);
    console.log('Recipe updated successfully!');
  } catch (error) {
    console.error('Error updating recipe: ', error);
  }
}
