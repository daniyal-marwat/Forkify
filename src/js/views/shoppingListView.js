import View from "./View.js";
class ShoppingListView extends View {
  _parentEl = document.querySelector(".shopping-cart-list");
  _button = document.querySelector(".recipe");
  _generateMarkup(data) {
    return data.ingredients
      .map((ing) => {
        return `<li class="shopping-cart-list-item">
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
    this._button.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--shopping-cart");
      if (!btn) return;
      console.log("clicked");
      handler();
    });
  }
}
export default new ShoppingListView();
