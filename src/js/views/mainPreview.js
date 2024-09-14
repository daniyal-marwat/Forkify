import View from "./View.js";
class MainPreview extends View {
  _parentEl = document.querySelector("main");
  _generateMarkup(data) {
    return ` <div class="main__preview_container">
    ${data.randomRecipes
      .map(
        (el) => `<a class="main__preview_container-item" href="#${el.id}">
          <figure class="recipe_figure-main-preview">
            <img
              src="${el.image_url}"
              alt="${el.title}"
            />
            <h1 class="recipe__title-main-preview">
              <span>${el.title}</span>
            </h1>
          </figure>
        </a>`
      )
      .join("")}
      </div>`;
  }
}
export default new MainPreview();
