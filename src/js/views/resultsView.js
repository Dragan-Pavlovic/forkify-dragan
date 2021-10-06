import { View } from './view';
import icons from 'url:./../../img/icons.svg';

export class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipes found for your query, please try another one.`;
  _message = 'Search over 1,000,000 recipes...';

  _generateMarkup(searchResults) {
    const hash = window.location.hash.slice(1);
    return searchResults
      .map(recipe => {
        return `<li class="preview">
            <a class="preview__link ${
              hash === recipe.id ? 'preview__link--active' : ''
            }" href="#${recipe.id}">
              <figure class="preview__fig">
                <img src="${recipe.image}" alt="${recipe.title}" crossorigin/>
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${recipe.title}</h4>
                <p class="preview__publisher">${recipe.publisher}</p>
               
                <div class="preview__user-generated ${
                  recipe.key ? '' : 'hidden'
                }">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
          </div>

              </div>
            </a>
          </li>`;
      })
      .join('');
  }
}

export default new ResultsView();
