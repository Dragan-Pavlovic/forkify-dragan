import { ResultsView } from './views/resultsView';
class BookmarksView extends ResultsView {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = '';
  _message = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}
export default new BookmarksView();
