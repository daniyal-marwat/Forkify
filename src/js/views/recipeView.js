import icons from "url:../../img/icons.svg";
import { Fraction } from "fractional";
import View from "./View.js";

class RecipeView extends View {
  _parentEl = document.querySelector(".recipe");
  _errorMessage = "We could not find that recipe. Please try another one!";

  _generateMarkup(recipe) {
    return `<figure class="recipe_figure">
          <img
            src="${recipe.image}"
            alt="${recipe.title}"
          />
          <h1 class="recipe__title">
            <span>${recipe.title}</span>
          </h1>
        </figure>
        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="icon recipe__details-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              recipe.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon recipe__details-icon"
              viewBox="0 0 512 512"
            >
              <path
                d="M112 320c0-93 124-165 96-272 66 0 192 96 192 272a144 144 0 01-288 0z"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="32"
              />
              <path
                d="M320 368c0 57.71-32 80-64 80s-64-22.29-64-80 40-86 32-128c42 0 96 70.29 96 128z"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="32"
              />
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes"
              >${Math.floor(recipe.totalCalories)}</span
            >
            <span class="recipe__info-text">calories</span>
          </div>
          <div class="recipe__info">
            <svg class="icon recipe__details-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              recipe.servings
            }</span>
            <span class="recipe__info-text">servings</span>
            <div class="recipe__info-buttons">
              <button class="btn btn--update-servings" data-update-to="${
                this._data.servings - 1
              }">
                <svg class="icon">
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn btn--update-servings" data-update-to="${
                this._data.servings + 1
              }">
                <svg class="icon">
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>
          <div class="recipe__user-generated ${this._data.key ? "" : "hidden"}">
            <svg class="icon">
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn btn--bookmark">
            <svg class="icon">
              <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? "-fill" : ""
    }"></use>
            </svg>
          </button>
                    <button class="btn btn--calendar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon"
              viewBox="0 0 24 24"
            >
              <path d="M8 15h3v3h2v-3h3v-2h-3v-3h-2v3H8z"></path>
              <path
                d="M19 4h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm.002 16H5V8h14l.002 12z"
              ></path>
            </svg>
            <div class="btn--calendar_drop_down-menu hidden">
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </div>
          </button>
        </div>
        <div class="recipe__ingredients">
          <h2 class="heading--2">RECIPE INGREDIENTS</h2>
          <ul class="recipe__ingredients-list">
          ${recipe.ingredients.map(this._generateMarkupIngredients).join("")}
          </ul>
        </div>
        <div class="recipe__direction">
          <h2 class="heading--2">how to cook it</h2>
          <p class="recipe__direction-text">
            This recipe was carefully designed and tested by Closet Cooking.
            Please check out directions at their website.
          </p>
          <button class="btn btn--direction btn--shopping-cart">
            ADD INGREDIENTS TO SHOPPING LIST
          </button>
          <a href="${recipe.sourceUrl}" class="btn btn--direction">
            <span>Direction</span>
            <svg class="icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;
  }
  addHandlerRender(handler) {
    ["hashchange", "load"].forEach((ev) =>
      window.addEventListener(ev, handler)
    );
  }
  addHandleUpdateServings(handler) {
    this._parentEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--update-servings");
      if (!btn) return;
      const updateTo = +btn.dataset.updateTo;
      if (updateTo > 0) handler(updateTo);
    });
  }
  addHandlerBookmark(handler) {
    this._parentEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--bookmark");
      if (!btn) return;
      handler();
    });
  }
  addHandlerShoppingList(handler) {
    this._parentEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--shopping-cart");
      if (!btn) return;
      handler();
    });
  }
  _generateMarkupIngredients(ing) {
    return `<li class="recipe__ingredient">
                <svg class="icon">
                  <use href="${icons}#icon-check"></use>
                </svg>
                <span class="recipe__quantity">${
                  ing.quantity ? new Fraction(ing.quantity).toString() : ""
                }</span>
                ${
                  ing.unit
                    ? `<span class="recipe__description recipe__unit">${ing.unit}</span>`
                    : ""
                }

                <span class="recipe__description">${ing.description}</span>
              </li>`;
  }
}

export default new RecipeView();
