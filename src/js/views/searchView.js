class SearchView {
  #parentEl = document.querySelector(".search_container");
  #clear() {
    this.#parentEl.querySelector(".search__input").value = "";
  }
  getQuery() {
    const query = this.#parentEl.querySelector(".search__input").value;
    this.#clear();
    return query;
  }
  addHandlerResults(handler) {
    this.#parentEl.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }
}
export default new SearchView();
