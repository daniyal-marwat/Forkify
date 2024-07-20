import View from "./View.js";

class PaginationView extends View {
  _parentEl = document.querySelector(".pagination");
  addHandlerPagination(handler) {
    this._parentEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".pagination_btn");
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;

      handler(gotoPage);
    });
  }
  _calcTotalNumOfPage() {
    return Math.ceil(this._data.results.length / this._data.resPerPage);
  }

  _generateMarkup() {
    const currPage = this._data.page;
    // When there is page1 and other

    if (currPage === 1 && this._calcTotalNumOfPage() > 1) {
      return this._generateMarkupBtnNext(currPage);
    }
    // When there is only last page

    if (
      currPage === this._calcTotalNumOfPage() &&
      this._calcTotalNumOfPage() > 1
    ) {
      return this._generateMarkupBtnPrev(currPage);
    }
    // Other page

    if (currPage < this._calcTotalNumOfPage()) {
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
    // ALSO DISPLAY TOTAL NUMBER OF PAGES

    return `<button data-goto="${
      currPage + 1
    }" class="btn pagination_btn pagination_btn-next">
            Page <span> ${
              currPage + 1
            }(${this._calcTotalNumOfPage()})</span> &rarr;
          </button>`;
  }
}

export default new PaginationView();
