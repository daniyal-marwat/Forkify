import View from "./View.js";
import icons from "url:../../img/icons.svg";

class BookmarkView extends View {
  _parentEl = document.querySelector(".bookmark__list");
  _errorMessage = "No bookmark add yet!. Choose a nice food and bookmark it.";
  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join("");
  }
  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }
  _generateMarkupPreview(data) {
    const id = window.location.hash.slice(1);
    return `<li class="preview">
    <a class="preview__link ${
      data.id === id ? "preview__link-active" : ""
    }" href="#${data.id}">
      <figure class="preview__figure">
        <img
          class="bookmark__list-img"
          src="${data.image}"
          alt="${data.title}"
        />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">
          ${data.title}
        </h4>
        <p class="preview__publisher">${data.publisher}</p>
      </div>
      <div class="preview__user-generated ${data.key ? "" : "hidden"}">
        <svg class="icon">
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
    </a>
  </li>`;
  }
}

export default new BookmarkView();
