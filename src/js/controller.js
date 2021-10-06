// https://forkify-api.herokuapp.com/v2
import 'regenerator-runtime/runtime';
import 'core-js/stable';

import { LOG_STATE, SUCCESS_TIMEOUT_MS } from './config.js';
import * as model from './model.js';
import recipeView from './views/recipeView';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { logError } from './helpers.js';

///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //1. load Data
    await model.loadRecipe(id);

    //2. rendering recipe
    recipeView.render(model.state.recipe);

    resultsView.update(model.state.search.pageDisplay.results);
    bookmarksView.update(model.state.bookmarks);

    if (LOG_STATE) console.log(model.state);
  } catch (err) {
    logError('Handling error from controller.js/controlRecipes', err);

    recipeView.renderError();
  }
};

const controlSearch = async function () {
  try {
    // get search query
    const query = searchView.getQuery();

    if (!query) return;

    //render spinner
    resultsView.renderSpinner();

    //load data
    await model.loadSearchResults(query);

    //renderdata
    controlPagination(1);
  } catch (err) {
    logError('Handling error from controller.js/controlSearch', err);
    resultsView.renderError();
  }
};

const controlPagination = function (page) {
  //render spinner
  resultsView.renderSpinner();
  //load results
  model.getSearchResultsPage(page);

  const curPage = model.state.search.pageDisplay.pageNum;
  const numPages = model.state.search.pageDisplay.numPages;

  //render data
  resultsView.render(model.state.search.pageDisplay.results);
  paginationView.render({ curPage, numPages });

  if (LOG_STATE) console.log(model.state);
};

const controlServings = function (newServings) {
  model.setRecipeServings(newServings);
  recipeView.update(model.state.recipe);

  if (LOG_STATE) console.log(model.state);
};

const controlBookmarks = function (bookmark) {
  model.setBookmark(bookmark);
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);

  if (LOG_STATE) console.log(model.state);
};

const bookmarkRender = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    //upload recipe
    await model.uploadRecipe(newRecipe);

    //render views
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //hide form
    setTimeout(() => {
      addRecipeView.toggleHiddenClass();
    }, SUCCESS_TIMEOUT_MS);

    bookmarksView.render(model.state.bookmarks);
    resultsView.update(model.state.search.pageDisplay.results);
    //change id in browser
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    addRecipeView.renderError(err.message);
    logError('Handling error from controller.js/controlAddRecipe', err);
    addRecipeView.renderError('Error posting recipe, please try again!');
  }
};
const newFeature = function () {
  console.log('welcome to the application');
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmarks);

  bookmarksView.addHandlerRender(bookmarkRender);
  paginationView.addHandlerClick(controlPagination);
  searchView.addHandlerSearch(controlSearch);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();
