import { async } from "regenerator-runtime";
import {
  API_URL,
  RES_PER_PAGE,
  KEY,
  SPOONACULAR_API_KEY,
  NUMBER_OF_PREVIEW_ELEMENTS_IN_MAIN,
} from "./config.js";
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
  shoppingList: [],
  weeklyCalendar: [],
  weekdaysLeft: [],
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
    if (state.search.results.length === 0) {
      state.search.results = null;
    }
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
  if (state.search.results) {
    return state.search.results.slice(start, end);
  }
}

// NOT WORKING CAUSE A LOT OF API REQUEST !! TIMEOUT!!

// export async function sortResult() {
//   try {
//     // ASSIGN STATE.SEARCH.SORTRESULTS AND THIS SORT THE STATE.SEARCH.RESULT BY COOKING TIME.

//     // Mapping each async operation to a promise
//     const promises = state.search.results.map(async (result) => {
//       const req = await AJAX(`${API_URL}${result.id}`);
//       return req.data.recipe; // Assuming req.data.recipe is the desired data to return
//     });
//     state.search.sortResults = await Promise.all(promises);
//     state.search.sortResults.sort((a, b) => a.cooking_time - b.cooking_time);
//     console.log(state);
//   } catch (error) {
//     console.error(error);
//   }
// }

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
function clearBookmarks() {
  localStorage.removeItem("bookmarks");
}
export function addIngredientsToShoppingList() {
  state.shoppingList.push(...state.recipe.ingredients);
  presistShoppingList();
}

export function removeIngredientsFromShoppingList(index) {
  state.shoppingList.splice(index, 1);
  presistShoppingList();
}
export function updateShoppingList(index, changedValue) {
  state.shoppingList[index].quantity = changedValue;
  presistShoppingList();
}
function presistShoppingList() {
  localStorage.setItem("shoppingList", JSON.stringify(state.shoppingList));
}
function clearShoppingList() {
  localStorage.removeItem("shoppingList");
}

export async function getCaloriesOfIngredients(ingredients) {
  try {
    const url = `https://api.spoonacular.com/recipes/parseIngredients?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=true`;
    let totalCalories = 0;
    const UpData = new URLSearchParams({
      ingredientList: ingredients
        .map(
          (ingredient) =>
            `${ingredient.quantity ? ingredient.quantity : ""} ${
              ingredient.unit ? ingredient.unit : ""
            } ${ingredient.description}`
        )
        .join("\n"),
    });
    const data = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: UpData,
    });
    const data2 = await data.json();
    data2.forEach((ingredient) => {
      if (ingredient.nutrition) {
        const calories = ingredient.nutrition.nutrients.find(
          (nutrient) => nutrient.name === "Calories"
        ).amount;
        totalCalories += calories;
      }
    });
    state.recipe.totalCalories = totalCalories;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function sortWeeklyCalendar() {
  const weekdayOrder = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  };
  // sort weekly days in calendar in order
  state.weeklyCalendar.sort((a, b) => {
    return weekdayOrder[a[0]] - weekdayOrder[b[0]];
  });
}
export function deletePrevDaysFromWeeklyCalendar() {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const weekdayOrder = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  };
  const getDayIndex = (dayName) => weekdayOrder[dayName];
  const currentDay = dayNames[new Date().getDay()];
  const currentDayIndex = getDayIndex(currentDay);
  const arr = state.weeklyCalendar.filter(
    (el) => getDayIndex(el[0]) >= currentDayIndex
  );

  state.weeklyCalendar = arr;
}
export function storeWeeklyCalendar() {
  // save to local storage
  localStorage.setItem("weeklyCalendar", JSON.stringify(state.weeklyCalendar));
}
export function saveWeeklyCalendar(arr) {
  let found = false;

  // replace meal of existing day
  state.weeklyCalendar.forEach((el) => {
    if (el.includes(arr[0])) {
      el[1] = arr[1];
      el[2] = arr[2];
      found = true;
    }
  });
  if (!found) {
    state.weeklyCalendar.push(arr);
  }
}
export function clearWeeklyCalendar() {
  localStorage.removeItem("weeklyCalendar");
}
export function setWeekdaysLeft() {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const weekdayOrder = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  };
  const getDayIndex = (dayName) => weekdayOrder[dayName];
  const currentDay = dayNames[new Date().getDay()];
  const currentDayIndex = getDayIndex(currentDay);

  const leftDays = dayNames.filter((el) => getDayIndex(el) >= currentDayIndex);
  leftDays.sort((a, b) => {
    return weekdayOrder[a] - weekdayOrder[b];
  });
  state.weekdaysLeft.push(...leftDays);
}
export async function getRandomRecipes() {
  try {
    const randomfoodItems = [
      "carrot",
      "broccoli",
      "asparagus",
      "cauliflower",
      "corn",
      "cucumber",
      "green pepper",
      "lettuce",
      "mushrooms",
      "onion",
      "potato",
      "pumpkin",
      "red pepper",
      "tomato",
      "beetroot",
      "brussel sprouts",
      "peas",
      "zucchini",
      "radish",
      "sweet potato",
      "artichoke",
      "leek",
      "cabbage",
      "celery",
      "chili",
      "garlic",
      "basil",
      "coriander",
      "parsley",
      "dill",
      "rosemary",
      "oregano",
      "cinnamon",
      "saffron",
      "green bean",
      "bean",
      "chickpea",
      "lentil",
      "apple",
      "apricot",
      "avocado",
      "banana",
      "blackberry",
      "blackcurrant",
      "blueberry",
      "boysenberry",
      "cherry",
      "coconut",
      "fig",
      "grape",
      "grapefruit",
      "kiwifruit",
      "lemon",
      "lime",
      "lychee",
      "mandarin",
      "mango",
      "melon",
      "nectarine",
      "orange",
      "papaya",
      "passion fruit",
      "peach",
      "pear",
      "pineapple",
      "plum",
      "pomegranate",
      "quince",
      "raspberry",
      "strawberry",
      "watermelon",
      "salad",
      "pizza",
      "pasta",
      "popcorn",
      "lobster",
      "steak",
      "bbq",
      "pudding",
      "hamburger",
      "pie",
      "cake",
      "sausage",
      "tacos",
      "kebab",
      "poutine",
      "seafood",
      "chips",
      "fries",
      "masala",
      "paella",
      "som tam",
      "chicken",
      "toast",
      "marzipan",
      "tofu",
      "ketchup",
      "hummus",
      "chili",
      "maple syrup",
      "parma ham",
      "fajitas",
      "champ",
      "lasagna",
      "poke",
      "chocolate",
      "croissant",
      "arepas",
      "bunny chow",
      "pierogi",
      "donuts",
      "rendang",
      "sushi",
      "ice cream",
      "duck",
      "curry",
      "beef",
      "goat",
      "lamb",
      "turkey",
      "pork",
      "fish",
      "crab",
      "bacon",
      "ham",
      "pepperoni",
      "salami",
      "ribs",
    ];
    function returnsRandomRecipesFromArray(arrayOfRecipes) {
      const randomRecipes = [];
      const copyRecipes = [...arrayOfRecipes];
      for (let i = 0; i < NUMBER_OF_PREVIEW_ELEMENTS_IN_MAIN; i++) {
        const randomIndex = Math.floor(Math.random() * copyRecipes.length);
        randomRecipes.push(copyRecipes.splice(randomIndex, 1)[0]);
      }
      return randomRecipes;
    }
    const req = await AJAX(
      `https://forkify-api.herokuapp.com/api/v2/recipes?search=${
        randomfoodItems[[Math.floor(Math.random() * randomfoodItems.length)]]
      }`
    );
    const { recipes } = req.data;
    if (recipes.length > NUMBER_OF_PREVIEW_ELEMENTS_IN_MAIN) {
      state.randomRecipes = returnsRandomRecipesFromArray(recipes);
    } else {
      const req2 = await AJAX(
        `https://forkify-api.herokuapp.com/api/v2/recipes?search=${
          randomfoodItems[[Math.floor(Math.random() * randomfoodItems.length)]]
        }`
      );
      const recipes2 = req2.data.recipes;
      const combineRecipes = recipes.concat(recipes2);
      state.randomRecipes = returnsRandomRecipesFromArray(combineRecipes);
    }
  } catch (error) {
    throw error;
  }
}
function init() {
  const bookmarkStorage = localStorage.getItem("bookmarks");
  if (bookmarkStorage) {
    state.bookmarks = JSON.parse(bookmarkStorage);
  }
  const shoppingListStorage = localStorage.getItem("shoppingList");
  if (shoppingListStorage) {
    state.shoppingList = JSON.parse(shoppingListStorage);
  }
  const weeklyCalendarStorage = localStorage.getItem("weeklyCalendar");
  if (weeklyCalendarStorage) {
    state.weeklyCalendar = JSON.parse(weeklyCalendarStorage);
  }
}
init();
