import View from "./View.js";
class ShoppingListView extends View {
  _parentEl = document.querySelector(".shopping-cart-list");
  _button = document.querySelector(".recipe");
  _message = "No ingredients at shopping list yet!";
  _errorMessage = "Something went wrong";
  _generateMarkup(data) {
    return data
      .map((ing, i) => {
        return `<li class="shopping-cart-list-item" data-index="${i}">
              ${
                ing.quantity || ing.unit
                  ? `              <div class="shopping-cart-list-item_input-container">
              ${
                ing.quantity
                  ? `<input type="number" value="${ing.quantity}" />`
                  : ""
              }
                ${ing.unit ? `<p>${ing.unit ? ing.unit : ""}</p>` : ""}
              </div>`
                  : ""
              }

              <p>${ing.description}</p>
              <button class="btn--remove-shopping-item">&times;</button>
            </li>`;
      })
      .join(" ");
  }
  addHandlerShoppingList(handler) {
    window.addEventListener("load", handler);
  }
  addHandlerRemoveIngredient(handler) {
    this._parentEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--remove-shopping-item");
      if (!btn) return;
      const deleteIndex = btn.closest("li").dataset.index;
      handler(deleteIndex);
    });
  }
  addHandlerUpdateShoppingList(handler) {
    this._parentEl.addEventListener("change", function (e) {
      const changedIndex = e.target.closest("li").dataset.index;
      const changedValue = +e.target.value;
      handler(changedIndex, changedValue);
    });
  }
}
export default new ShoppingListView();
