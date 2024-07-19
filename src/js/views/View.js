import icons from "url:../../img/icons.svg";

export default class View {
  _data;
  /**
   *
   * @param {Object | Object[]} data The data to be rendered (e.g recipe)
   * @returns {undefined | Error}
   * @this {Object} View Instance
   * @todo  Finished Implementation
   */
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    this._data = data;
    const markup = this._generateMarkup(this._data);
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(this._data);
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const currElements = Array.from(this._parentEl.querySelectorAll("*"));

    newElements.forEach((newel, i) => {
      const currEl = currElements[i];

      // UPDATE CHANGED TEXT

      if (
        !newel.isEqualNode(currEl) &&
        newel.firstChild?.nodeValue.trim() !== ""
      ) {
        currEl.textContent = newel.textContent;
      }

      // UPDATE CHANGED ATTRIBUTES

      if (!newel.isEqualNode(currEl)) {
        Array.from(newel.attributes).forEach((attr) => {
          currEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderSpinner() {
    const markup = `<div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>`;
    this._parentEl.innerHTML = "";
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }
  _clear() {
    this._parentEl.innerHTML = "";
  }
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error main__message">
        <svg class="icon">
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }
  renderMessage(message = this._message) {
    const markup = `        <div class="main__message">
          <svg class="icon">
            <use href="${icons}#icon-smile"></use>
          </svg>
          <p>${message}</p>
        </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }
}
