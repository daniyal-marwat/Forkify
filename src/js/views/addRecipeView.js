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
  constructor() {
    super();
    this.addHandlerShowModal();
    this.addHandlerCloseModal();
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
}

export default new AddRecipeView();
