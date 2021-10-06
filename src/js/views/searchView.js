class SearchView {
  _parentElement = document.querySelector('.search');

  addHandlerSearch(handler) {
    document.querySelector('.search').addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
  #clearInput() {
    document.querySelector('.search__field').value = '';
  }
  getQuery() {
    const query = document.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }
}
export default new SearchView();
