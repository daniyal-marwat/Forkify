import View from "./View.js";
import icons from "url:../../img/icons.svg";

class AddRecipeView extends View {
  _parentEl = document.querySelector(".upload");
  _message = "Recipe successfully uploaded !";
  _errorMessage = "";
  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _showModal = document.querySelector(".nav_btn-container-modal");
  _closeModal = document.querySelector(".btn--close-modal");
  _btnAddIngredients = document.querySelector(".add-ingredients_btn");
  _ingredientsColumn = document.querySelector(".upload__column-ingredients");
  constructor() {
    super();
    this.addHandlerShowModal();
    this.addHandlerCloseModal();
    this.addIngredients();
    this.validIngredientInput();
  }
  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }
  addHandlerShowModal() {
    this._showModal.addEventListener("click", this.toggleWindow.bind(this));
  }
  addHandlerCloseModal() {
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
    this._closeModal.addEventListener("click", this.toggleWindow.bind(this));
  }
  addHandlerUpload(handler) {
    this._parentEl.addEventListener("submit", function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
  addIngredients() {
    let ingredients = 4;

    this._btnAddIngredients.addEventListener(
      "click",
      function () {
        const html = `          <label>Ingredient ${ingredients}</label>
        <input
          value=""
          type="text"
          name="ingredient-${ingredients}"
          placeholder="Format: 'Quantity,Unit,Description'"
/>`;
        this._ingredientsColumn.insertAdjacentHTML("beforeend", html);
        ingredients++;
      }.bind(this)
    );
  }
  validIngredientInput() {
    this._ingredientsColumn.addEventListener("input", function (e) {
      const inputField = e.target.closest("input");
      const text = e.target.closest("input").value;
      const textArr = text.split(",");
      if (textArr.length !== 3) {
        inputField.style.backgroundColor = "#f03e3e";
        inputField.style.color = "#fff";
      } else {
        inputField.style.backgroundColor = "white";
        inputField.style.color = "#000";
      }
    });
  }
}

export default new AddRecipeView();
