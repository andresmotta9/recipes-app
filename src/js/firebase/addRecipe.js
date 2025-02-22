import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

// Function to add a recipe
export async function addRecipe(recipe) {
  try {
    const docRef = await addDoc(collection(db, 'recipes'), recipe);
    console.log('Recipe added with ID: ', docRef.id);
  } catch (error) {
    console.error('Error adding recipe: ', error);
  }
}
