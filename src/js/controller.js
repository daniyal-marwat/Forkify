import * as model from "./model";
import { TIMEOUT_CLOSE_WINDOW } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultView from "./views/resultView.js";
import paginationView from "./views/paginationView.js";
import bookmarkView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import shoppingListView from "./views/shoppingListView.js";
import weeklyCalendarView from "./views/weeklyCalendarView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

async function controlRecipe() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // RENDERING SPINNER

    recipeView.renderSpinner();

    //HIGHLIGHT THE ACTIVE SEARCH RESULT

    resultView.update(model.getSearchResultsPerPage());

    //HIGHLIGHT THE ACTIVE BOOKMARK RESULT
    bookmarkView.update(model.state.bookmarks);

    // LOADING RECIPE

    await model.loadRecipe(id);

    // GET CALORIES

    // await model.getCaloriesOfIngredients(model.state.recipe.ingredients);

    //RENDERING DATA

    recipeView.render(model.state.recipe);
  } catch (err) {
    // RENDERIN ERROR

    recipeView.renderError();
    console.error(err);
  }
}

async function controlSearchResults() {
  try {
    // GETTING QUERY

    const query = searchView.getQuery();
    if (!query || query === "") return;

    //RENDERING SPINNER

    resultView.renderSpinner();

    // LOADING SEARCH RESULTS

    await model.loadSearchResults(query);

    // SORT THE RESULT BY COOKING TIME

    // await model.sortResult();

    // RENDERING RESULTS

    resultView.render(model.getSearchResultsPerPage());

    // RENDERING PAGINATION

    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
}

function controlPagination(gotoPage) {
  // RENDER NEW SEARCH RESULT

  resultView.render(model.getSearchResultsPerPage(gotoPage));

  // RENDER NEW PAGINATION BUTTONS

  paginationView.render(model.state.search);
}

async function controlUpdateServings(newServings) {
  //UPDATE SERVINGS

  model.updateServings(newServings);

  // UPDATE CALOREIS

  await model.getCaloriesOfIngredients(model.state.recipe.ingredients);

  //RENDER NEW SERVINGS

  recipeView.update(model.state.recipe);
}

function controlAddBookmarks() {
  // IF BOOKMARK PROPERTY IS SET TO FALSE ADD BOOKMARK

  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe);
  // IF BOOKMARK PROPERTY IS TRUR SET BOOKMARK TO FALSE
  else model.removeBookmark(model.state.recipe.id);

  // UPDATE THE BOOKMARK ICON
  recipeView.update(model.state.recipe);

  // RENDER THE RESULTS IN BOOKMARK TAB
  bookmarkView.render(model.state.bookmarks);
}

function controlBookmarks() {
  bookmarkView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  try {
    // RENDER SPINNER

    addRecipeView.renderSpinner();

    // UPLOAD RECIPE TO API

    await model.uploadRecipe(newRecipe);

    // RENDER NEW RECIPE

    recipeView.render(model.state.recipe);

    // RENDER MESSAGE

    addRecipeView.renderMessage();

    // ADD NEW RECIPE TO BOOKMARK

    bookmarkView.render(model.state.bookmarks);

    // UPDATING THE URL OF THE PAGE WITH THE ID OF THE NEW RECIPE

    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // CLOSE MODEL WINDOW AFTER TIMEOUT

    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, TIMEOUT_CLOSE_WINDOW * 1000);

    // UPDATE BOOKMARK

    console.log(model.state.recipe);
  } catch (error) {
    addRecipeView.renderError(error);
    console.error(error);
  }
}
function controlAddShoppingList() {
  // ADD INGREDIENTS OF RECIPE TO SHOPPING LIST IN MODEL.STATE
  model.addIngredientsToShoppingList();
  shoppingListView.render(model.state.shoppingList);
}
function controlRemoveShoppingListIngredient(index) {
  model.removeIngredientsFromShoppingList(index);
  shoppingListView.render(model.state.shoppingList);
}

function controlShoppingList() {
  shoppingListView.render(model.state.shoppingList);
}
function controlUpdateShoppingList(index, changedValue) {
  model.updateShoppingList(index, changedValue);
}

function controlCalender(calendarData) {
  // save the data in state
  model.saveWeeklyCalendar(calendarData);
  // sort calendar
  model.sortWeeklyCalendar();
  // delete prev days from weekly calendar
  model.deletePrevDaysFromWeeklyCalendar();
  // store into local storage
  model.storeWeeklyCalendar();
  // render data on website
  weeklyCalendarView.render(model.state.weeklyCalendar);
}
function controlRenderCalenderOnLoad() {
  // delete prev days from weekly calendar
  model.deletePrevDaysFromWeeklyCalendar();
  // store into local storage
  model.storeWeeklyCalendar();
  // model.clearWeeklyCalendar();
  // render data on website
  weeklyCalendarView.render(model.state.weeklyCalendar);
}
function init() {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandleUpdateServings(controlUpdateServings);
  recipeView.addHandlerBookmark(controlAddBookmarks);
  searchView.addHandlerResults(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  recipeView.addHandlerShoppingList(controlAddShoppingList);
  shoppingListView.addHandlerShoppingList(controlShoppingList);
  shoppingListView.addHandlerRemoveIngredient(
    controlRemoveShoppingListIngredient
  );
  shoppingListView.addHandlerUpdateShoppingList(controlUpdateShoppingList);
  weeklyCalendarView.addHandlerRender(controlRenderCalenderOnLoad);
  recipeView.addHandlerGetCalendarValue(controlCalender);
}
init();
