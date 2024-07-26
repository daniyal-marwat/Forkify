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
                    <button class="btn--shopping-cart">
            ADD INGREDIENTS TO SHOPPING LIST
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
  _generateMarkupIngredients(ing) {
    return `<li class="recipe__ingredient">
                <svg class="icon">
                  <use href="${icons}#icon-check"></use>
                </svg>
                <span class="recipe__quantity">${
                  ing.quantity ? new Fraction(ing.quantity).toString() : ""
                }</span>
                <span class="recipe__description recipe__unit">
                  ${ing.unit}
                </span>
                <span class="recipe__description">${ing.description}</span>
              </li>`;
  }
}

export default new RecipeView();
