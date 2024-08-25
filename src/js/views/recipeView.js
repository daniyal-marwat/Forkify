import icons from "url:../../img/icons.svg";
import { Fraction } from "fractional";
import View from "./View.js";

class RecipeView extends View {
  _parentEl = document.querySelector(".recipe");
  _errorMessage = "We could not find that recipe. Please try another one!";
  constructor() {
    super();
    this._toggleCalendarDropDownMenu();
  }

  _generateMarkup(data) {
    return `<figure class="recipe_figure">
          <img
            src="${data.recipe.image}"
            alt="${data.recipe.title}"
          />
          <h1 class="recipe__title">
            <span>${data.recipe.title}</span>
          </h1>
        </figure>
        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="icon recipe__details-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              data.recipe.cookingTime
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
              >${Math.floor(data.recipe.totalCalories)}</span
            >
            <span class="recipe__info-text">calories</span>
          </div>
          <div class="recipe__info">
            <svg class="icon recipe__details-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              data.recipe.servings
            }</span>
            <span class="recipe__info-text">servings</span>
            <div class="recipe__info-buttons">
              <button class="btn btn--update-servings" data-update-to="${
                this._data.recipe.servings - 1
              }">
                <svg class="icon">
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn btn--update-servings" data-update-to="${
                this._data.recipe.servings + 1
              }">
                <svg class="icon">
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>
          <div class="recipe__user-generated ${
            this._data.recipe.key ? "" : "hidden"
          }">
            <svg class="icon">
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn btn--bookmark">
            <svg class="icon">
              <use href="${icons}#icon-bookmark${
      this._data.recipe.bookmarked ? "-fill" : ""
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
            ${this._data.weekdaysLeft
              .map((el) => `<option value="${el}">${el}</option>`)
              .join("")}
            </div>
          </button>
        </div>
        <div class="recipe__ingredients">
          <h2 class="heading--2">RECIPE INGREDIENTS</h2>
          <ul class="recipe__ingredients-list">
          ${data.recipe.ingredients
            .map(this._generateMarkupIngredients)
            .join("")}
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
          <a href="${data.recipe.sourceUrl}" class="btn btn--direction">
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
  _toggleCalendarDropDownMenu() {
    this._parentEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn--calendar");
      if (!btn) return;
      const dropDown = btn.querySelector(".btn--calendar_drop_down-menu");
      dropDown.classList.toggle("hidden");
    });
  }
  addHandlerGetCalendarValue(handler) {
    this._parentEl.addEventListener("click", (e) => {
      const node = e.target.closest(".btn--calendar_drop_down-menu option");
      if (!node) return;
      const arr = [node.value, this._data.recipe.title, this._data.recipe.id];
      handler(arr);
    });
  }
}

export default new RecipeView();
