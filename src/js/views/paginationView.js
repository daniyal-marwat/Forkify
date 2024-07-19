import View from "./View.js";

class PaginationView extends View {
  _parentEl = document.querySelector(".pagination");
  addHandlerPagination(handler) {
    this._parentEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".pagination_btn");
      const gotoPage = +btn.dataset.goto;
      if (!btn) return;

      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const totalNumPages = Math.ceil(
      this._data.results.length / this._data.resPerPage
    );
    // When there is page1 and other

    if (currPage === 1 && totalNumPages > 1) {
      return this._generateMarkupBtnNext(currPage);
    }
    // When there is only last page

    if (currPage === totalNumPages && totalNumPages > 1) {
      return this._generateMarkupBtnPrev(currPage);
    }
    // Other page

    if (currPage < totalNumPages) {
      return `${this._generateMarkupBtnPrev(
        currPage
      )}${this._generateMarkupBtnNext(currPage)}`;
    }
    // When there is only 1 page

    return ``;
  }
  _generateMarkupBtnPrev(currPage) {
    return `<button data-goto="${
      currPage - 1
    }" class="btn pagination_btn pagination_btn-previous">
            &larr; Page <span> ${currPage - 1}</span>
          </button>`;
  }
  _generateMarkupBtnNext(currPage) {
    return `<button data-goto="${
      currPage + 1
    }" class="btn pagination_btn pagination_btn-next">
            Page <span> ${currPage + 1}</span> &rarr;
          </button>`;
  }
}

export default new PaginationView();
