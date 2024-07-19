import View from "./View.js";
import icons from "url:../../img/icons.svg";

class ResultView extends View {
  _parentEl = document.querySelector(".result_list");
  _errorMessage =
    "Could not find result for this query. Please try another one!";
  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join("");
  }
  _generateMarkupPreview(data) {
    const id = window.location.hash.slice(1);
    return `<li class="preview">
    <a class="preview__link ${
      data.id === id ? "preview__link-active" : ""
    }" href="#${data.id}">
      <figure class="preview__figure">
        <img
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

export default new ResultView();
