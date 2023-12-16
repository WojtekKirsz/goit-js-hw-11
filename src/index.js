import { imagesSearch } from './images-api.js';
import Notiflix from 'notiflix';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('search-form');
  const gallery = document.querySelector('.gallery');
  const loadMoreBtn = document.querySelector('.load-more');

  let page = 1;
  let searchQuery = '';

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const userInput = document.querySelector('input[name="searchQuery"]');
    searchQuery = userInput.value.trim();

    if (searchQuery === '') {
      return;
    }

    page = 1;
    gallery.innerHTML = '';

    try {
      const response = await imagesSearch(searchQuery, page);
      handleImageResponse(response);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  });

  function handleImageResponse(response) {
    const gallery = document.querySelector('.gallery');
    if (
      !response ||
      !response.hits ||
      !Array.isArray(response.hits) ||
      response.hits.length === 0
    ) {
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
      console.log('Invalid or empty response data');
      return;
    }

    response.hits.forEach(imageData => {
      const card = createImageCard(imageData);
      gallery.appendChild(card);
    });

    if (data.totalHits <= page * 20) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';
    }
  }

  function createImageCard(imageData) {
    const card = document.createElement('div');
    card.classList.add('photo-card');

    const image = document.createElement('img');
    image.src = imageData.webformatURL;
    image.alt = imageData.tags;

    const info = document.createElement('div');
    info.classList.add('info');

    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes</b> ${imageData.likes}`;

    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views</b> ${imageData.views}`;

    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments</b> ${imageData.comments}`;

    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads</b> ${imageData.downloads}`;

    info.appendChild(likes);
    info.appendChild(views);
    info.appendChild(comments);
    info.appendChild(downloads);

    card.appendChild(image);
    card.appendChild(info);

    console.log(card);

    return card;
  }

  loadMoreBtn.addEventListener('click', async () => {
    page++;

    try {
      const response = await imagesSearch(searchQuery, page);
      handleImageResponse(response);
    } catch (error) {
      console.error('Error fetching more images:', error);
    }
  });
});
