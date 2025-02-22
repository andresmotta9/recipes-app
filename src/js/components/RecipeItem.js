// src/js/components/RecipeItem.js
import Modal from './Modal';

export default function RecipeItem(recipe, onDelete) {
  const recipeCard = document.createElement('div');
  recipeCard.classList.add('recipe-card', 'card');
  recipeCard.innerHTML = `
    <img src="${recipe.imageUrl}" alt="${recipe.title}" class="recipe-image">
    <div class="recipe-content">
      <h3 class="recipe-title">${recipe.title}</h3>
      <span class="recipe-category">${recipe.category}</span>
      <p class="recipe-details"><strong>Ingredients:</strong> ${recipe.ingredients.join(
        ', '
      )}</p>
      <p class="recipe-details"><strong>Instructions:</strong></p>
      <ol class="recipe-instructions">
        ${Object.values(recipe.instructions)
          .map((instruction) => `<li>${instruction}</li>`)
          .join('')}
      </ol>
      <p class="recipe-details"><strong>Preparation Time:</strong> ${
        recipe.preparationTime
      } minutes</p>
      <p class="recipe-details"><strong>Difficulty:</strong> ${
        recipe.difficulty
      }</p>
      <p class="recipe-details"><strong>Servings:</strong> ${
        recipe.servings
      }</p>
      <p class="recipe-details"><strong>Notes:</strong> ${recipe.notes}</p>
    </div>
    <div class="recipe-footer">
      <button class="btn btn-secondary btn-edit" data-id="${
        recipe.id
      }">Edit</button>
      <button class="btn btn-danger btn-delete" data-id="${
        recipe.id
      }">Delete</button>
    </div>
  `;

  // Delete button handler
  recipeCard.querySelector('.btn-delete').addEventListener('click', () => {
    onDelete(recipe.id);
  });

  // Edit button handler: open the modal pre-filled with recipe data
  recipeCard.querySelector('.btn-edit').addEventListener('click', () => {
    const editModal = Modal(recipe); // Pass the recipe object for editing
    document.body.appendChild(editModal);
  });

  return recipeCard;
}
