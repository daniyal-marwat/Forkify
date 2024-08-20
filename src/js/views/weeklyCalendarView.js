import View from "./View.js";
class weeklyCalendar extends View {
  _parentEl = document.querySelector(".weekly-calender-list");
  _message = "Plan meal for your weekly calendar";
  _errorMessage = "Something went wrong";
  _generateMarkup(data) {
    return data
      .map((element) => {
        return `            <li class="weekly-calender-list-item">
              <span
                >${element[0]}:<a href="#${element[2]}"
                  >${element[1]}</a
                ></span
              >
            </li>`;
      })
      .join("");
  }
  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }
}
export default new weeklyCalendar();
