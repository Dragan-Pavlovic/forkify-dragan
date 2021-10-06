import { AJAX, fetchImage, logError } from './helpers.js';
import { API_KEY, API_URL, CORS_PROXY, RESULTS_PER_PAGE } from './config.js';
import 'core-js/stable';

//
export const state = {
  recipe: {},

  //
  search: {
    query: '',
    results: [],
    numResults: 0,
    //
    pageDisplay: {
      pageNum: 1,
      results: [],
      numPages: 0,
      displaingResults: '1-1',
    },
  },

  //
  bookmarks: [],
};

const createRecipeObject = function (recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    //1. load recipe
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    // get data and update state
    const { recipe } = data.data;
    state.recipe = createRecipeObject(recipe);
    state.bookmarks.forEach(rec => {
      if (rec.id === state.recipe.id) state.recipe.bookmarked = true;
    });
  } catch (err) {
    throw logError('Handling error from model.js/loadRecipe', err);
  }
};

export const loadSearchResults = async function (query) {
  //1. Load results
  try {
    const { data } = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    if (data.recipes.length === 0)
      throw new Error('Search results object empty');
    state.search.query = query;
    state.search.results = data.recipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image_url,
        title: recipe.title,
        publisher: recipe.publisher,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    state.search.pageDisplay.numPages = Math.ceil(
      state.search.results.length / RESULTS_PER_PAGE
    );
    state.search.numResults = state.search.results.length;
  } catch (err) {
    throw logError('Handling error from model.js/loadSearchResults', err);
  }
};

export const getSearchResultsPage = function (
  page = state.search.pageDisplay.pageNum
) {
  const indexFirst = (page - 1) * RESULTS_PER_PAGE;
  const indexLast = page * RESULTS_PER_PAGE;
  const pageDisplay = state.search.pageDisplay;

  pageDisplay.pageNum = page;
  pageDisplay.results = state.search.results.slice(indexFirst, indexLast);

  pageDisplay.displaingResults = [
    indexFirst + 1,
    indexLast <= state.search.numResults ? indexLast : state.search.numResults,
  ];

  // console.log(indexFirst, indexLast, state);
};

export const setRecipeServings = function (servingsNum) {
  const curServings = state.recipe.servings;
  const multiplier = servingsNum / curServings;
  state.recipe.servings = servingsNum;
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * multiplier;
  });
};

export const setBookmark = function (bookmark) {
  if (typeof bookmark !== 'boolean') return;

  state.recipe.bookmarked = bookmark;

  switch (bookmark) {
    case true:
      state.bookmarks.push(state.recipe);
      break;

    case false:
      const index = state.bookmarks.findIndex(
        rec => rec.id === state.recipe.id
      );
      state.bookmarks.splice(index, 1);
      break;
  }

  window.localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const loadBookmarks = function () {
  const bookmarks = JSON.parse(window.localStorage.getItem('bookmarks'));
  if (bookmarks) state.bookmarks = bookmarks;
};

loadBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe).reduce((acc, entry) => {
      if (entry[0].startsWith('ingredient') && entry[1] !== '') {
        const ingArr = entry[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) throw new Error('Wrong ingredient format');
        const [quantity, unit, description] = ingArr;
        const ing = {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
        acc.push(ing);
      }
      return acc;
    }, []);
    const img = await fetchImage(`${CORS_PROXY}${newRecipe.image}`);
    const recipeUpload = {
      // id: newRecipe.id,
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: img,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients: ingredients,
      bookmarked: true,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipeUpload);
    let { recipe } = data.data;
    state.recipe = createRecipeObject(recipe);

    setBookmark(true);
  } catch (err) {
    throw logError('Handling error from model.js/upladRecipe', err);
  }
};

// let img;
// fetch(
//   'https://cors-anywhere.herokuapp.com/https://www.recepti.com/img/recipe/49781-posne-punjene-paprike-sa-orasima.jpg'
// )
//   .then(res => res.blob())
//   .then(imageBlob => {
//     const imageObjectURL = URL.createObjectURL(imageBlob);
//     img = 'dragan';
//     console.log(img);
//   })
//   .catch(err => console.log(err));
