// src/js/components/RecipeItemList.js
import Modal from './Modal';

export default function RecipeItemList() {
  const section = document.createElement('section');
  section.classList.add('recipes-section', 'recipe-list-container', 'my-5');
  section.innerHTML = `
    <div class="header">
      <h2>All Recipes</h2>
      <button class="btn btn-primary btn-add" id="addRecipeBtn">Add Recipe</button>
    </div>
    <div id="recipesList" class="recipe-list"></div>
  `;

  // Setup the Add Recipe button to show the modal
  const addRecipeBtn = section.querySelector('#addRecipeBtn');
  addRecipeBtn.addEventListener('click', () => {
    const modal = Modal();
    document.body.appendChild(modal);
  });

  // Do NOT call getRecipes() here—leave that to main.js

  return section;
}
