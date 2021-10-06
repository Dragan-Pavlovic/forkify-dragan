import { View } from './view';
import icons from 'url:./../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _message = '';

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const clicked = e.target.closest('.btn--inline');
      if (!clicked) return;
      handler(+clicked.dataset.page);
    });
  }
  _generateMarkup(data) {
    const { curPage, numPages } = data;

    const btnPrev =
      curPage > 1
        ? `
        <button class="btn--inline pagination__btn--prev" data-page="${
          curPage - 1
        }">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>`
        : '';

    const btnNext =
      curPage < numPages
        ? `        
        <button class="btn--inline pagination__btn--next" data-page="${
          curPage + 1
        }">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`
        : '';

    return btnPrev + btnNext;
  }
}

export default new PaginationView();
