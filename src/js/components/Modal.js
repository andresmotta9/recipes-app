// src/js/components/Modal.js
export default function Modal(existingRecipe = null) {
  const overlay = document.createElement('div');
  overlay.classList.add('modal-overlay');

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  // Modal header: title changes based on mode
  const header = document.createElement('div');
  header.classList.add('modal-header');
  header.innerHTML = `
    <h3>${existingRecipe ? 'Edit Recipe' : 'Add New Recipe'}</h3>
    <button class="modal-close">&times;</button>
  `;
  modalContent.appendChild(header);

  // Modal body with form – pre-populate if editing
  const body = document.createElement('div');
  body.classList.add('modal-body');
  body.innerHTML = `
    <form id="modal-add-recipe-form">
      <div class="form-group">
        <label for="modal-title">Title</label>
        <input type="text" id="modal-title" name="title" class="form-control" required value="${
          existingRecipe ? existingRecipe.title : ''
        }">
      </div>
      <div class="form-group">
        <label for="modal-ingredients">Ingredients (comma separated)</label>
        <input type="text" id="modal-ingredients" name="ingredients" class="form-control" required value="${
          existingRecipe ? existingRecipe.ingredients.join(', ') : ''
        }">
      </div>
      <div class="form-group">
        <label for="modal-instructions">Instructions (line separated)</label>
        <textarea id="modal-instructions" name="instructions" class="form-control" rows="4" required>${
          existingRecipe
            ? Object.values(existingRecipe.instructions).join('\n')
            : ''
        }</textarea>
      </div>
      <div class="form-group">
        <label for="modal-preparationTime">Preparation Time (minutes)</label>
        <input type="number" id="modal-preparationTime" name="preparationTime" class="form-control" required value="${
          existingRecipe ? existingRecipe.preparationTime : ''
        }">
      </div>
      <div class="form-group">
        <label for="modal-difficulty">Difficulty</label>
        <select id="modal-difficulty" name="difficulty" class="form-control" required>
          <option value="">Select difficulty</option>
          <option value="Easy" ${
            existingRecipe && existingRecipe.difficulty === 'Easy'
              ? 'selected'
              : ''
          }>Easy</option>
          <option value="Medium" ${
            existingRecipe && existingRecipe.difficulty === 'Medium'
              ? 'selected'
              : ''
          }>Medium</option>
          <option value="Hard" ${
            existingRecipe && existingRecipe.difficulty === 'Hard'
              ? 'selected'
              : ''
          }>Hard</option>
        </select>
      </div>
      <div class="form-group">
        <label for="modal-servings">Servings</label>
        <input type="number" id="modal-servings" name="servings" class="form-control" required value="${
          existingRecipe ? existingRecipe.servings : ''
        }">
      </div>
      <div class="form-group">
        <label for="modal-category">Category</label>
        <input type="text" id="modal-category" name="category" class="form-control" required value="${
          existingRecipe ? existingRecipe.category : ''
        }">
      </div>
      <div class="form-group">
        <label for="modal-imageUrl">Image URL</label>
        <input type="url" id="modal-imageUrl" name="imageUrl" class="form-control" required value="${
          existingRecipe ? existingRecipe.imageUrl : ''
        }">
      </div>
      <div class="form-group">
        <label for="modal-notes">Notes</label>
        <textarea id="modal-notes" name="notes" class="form-control" rows="3" required>${
          existingRecipe ? existingRecipe.notes : ''
        }</textarea>
      </div>
      <button type="submit" class="btn btn-primary mt-3">${
        existingRecipe ? 'Update Recipe' : 'Submit Recipe'
      }</button>
    </form>
  `;
  modalContent.appendChild(body);
  overlay.appendChild(modalContent);

  // Close functionality
  modalContent
    .querySelector('.modal-close')
    .addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  // Basic sanitization function
  function sanitize(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  // Form submission handling
  const form = modalContent.querySelector('#modal-add-recipe-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Retrieve and sanitize form values
    const title = sanitize(form.elements['title'].value.trim());
    const ingredientsStr = sanitize(form.elements['ingredients'].value.trim());
    const instructionsStr = sanitize(
      form.elements['instructions'].value.trim()
    );
    const preparationTime = parseInt(
      form.elements['preparationTime'].value,
      10
    );
    const difficulty = sanitize(form.elements['difficulty'].value);
    const servings = parseInt(form.elements['servings'].value, 10);
    const category = sanitize(form.elements['category'].value.trim());
    const imageUrl = sanitize(form.elements['imageUrl'].value.trim());
    const notes = sanitize(form.elements['notes'].value.trim());

    if (
      !title ||
      !ingredientsStr ||
      !instructionsStr ||
      isNaN(preparationTime) ||
      !difficulty ||
      isNaN(servings) ||
      !category ||
      !imageUrl ||
      !notes
    ) {
      alert('Please fill in all fields correctly.');
      return;
    }

    const recipeData = {
      title,
      ingredients: ingredientsStr.split(',').map((item) => item.trim()),
      instructions: instructionsStr
        .split('\n')
        .reduce((acc, instruction, index) => {
          acc[index + 1] = instruction.trim();
          return acc;
        }, {}),
      // For update, preserve previous flags if available
      wasPreviouslyDone: existingRecipe
        ? existingRecipe.wasPreviouslyDone
        : false,
      preparationTime,
      difficulty,
      servings,
      category,
      imageUrl,
      notes,
    };

    if (existingRecipe) {
      // Dispatch update event if in edit mode
      const updateEvent = new CustomEvent('updateRecipe', {
        detail: { recipeId: existingRecipe.id, updatedRecipe: recipeData },
      });
      window.dispatchEvent(updateEvent);
    } else {
      // Dispatch new recipe event for creation
      const newRecipeEvent = new CustomEvent('newRecipe', {
        detail: recipeData,
      });
      window.dispatchEvent(newRecipeEvent);
    }
    overlay.remove();
  });

  return overlay;
}
