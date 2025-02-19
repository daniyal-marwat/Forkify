import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
// import { getJSON, sendJSON } from "./helper.js";
import { AJAX } from "./helper.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};
function createRecipeObject(data) {
  let { recipe } = data.data;
  return {
    image: recipe.image_url,
    cookingTime: recipe.cooking_time,
    publisher: recipe.publisher,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    id: recipe.id,
    ...(recipe.key && { key: recipe.key }),
  };
}
export const loadRecipe = async function (id) {
  try {
    const url = `${API_URL}${id}?key=${KEY}`;
    const data = await AJAX(url);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map((res) => {
      return {
        image: res.image_url,
        publisher: res.publisher,
        title: res.title,
        id: res.id,
        ...(res.key && { key: res.key }),
      };
    });

    // STARTING FROM PAGE ONE WHEN THERE IS NEW SEARCH QUERY

    state.search.page = 1;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export function getSearchResultsPerPage(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RES_PER_PAGE; //0
  const end = page * RES_PER_PAGE; //9
  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
}
function presistBookmark() {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}
export function addBookmarks(recipe) {
  // ADD RECIPE TO BOOKMARK
  state.bookmarks.push(recipe);
  // ADD BOOKMARKED PROPERTY TO STATE.RECIPE
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  // SAVE BOOKMARKS TO LOCAL STORAGE
  presistBookmark();
}
export function removeBookmark(id) {
  // FIND INDEX OF BOOKMARK
  const index = state.bookmarks.findIndex((el) => el.id === id);
  // REMOVE BOOKMARK
  state.bookmarks.splice(index, 1);
  // SET BOOKMARK PROPERTY TO FALSE ON RECIPE
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  // SAVE BOOKMARKS TO LOCAL STORAGE
  presistBookmark();
}

export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());
        if (ingArr.length !== 3) throw new Error("Wrong ingredient format");
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      image_url: newRecipe.image,
      source_url: newRecipe.sourceUrl,
      cooking_time: +newRecipe.cookingTime,
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmarks(state.recipe);
  } catch (error) {
    throw error;
  }
}
function init() {
  const storage = localStorage.getItem("bookmarks");
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
}
init();
