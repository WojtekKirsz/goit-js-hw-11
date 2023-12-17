import { imagesSearch } from './images-api.js';
import Notiflix from 'notiflix';
// Opisany w dokumentacji
import SimpleLightbox from 'simplelightbox';
// Dodatkowy import stylów
import 'simplelightbox/dist/simple-lightbox.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('search-form');
  const gallery = document.querySelector('.gallery');
  const loadMoreBtn = document.querySelector('.load-more');
  const lightbox = new SimpleLightbox('.gallery a');

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
      lightbox.refresh();
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
      console.log('Invalid or empty response data');
      return;
    }

    response.hits.forEach(imageData => {
      const card = createImageCard(imageData);
      gallery.appendChild(card);
    });

    const totalImagesLoaded = page * 10;
    const totalHits = response.totalHits;

    if (totalImagesLoaded >= totalHits) {
      loadMoreBtn.style.display = 'none';
      if (page > 1) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    } else {
      loadMoreBtn.style.display = 'block';
    }
  }

  function createImageCard(imageData) {
    const card = document.createElement('div');
    card.classList.add('photo-card');

    const anchor = document.createElement('a');
    anchor.href = imageData.largeImageURL;

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

    anchor.appendChild(image);
    card.appendChild(anchor);
    card.appendChild(info);

    console.log(card);

    return card;
  }

  loadMoreBtn.addEventListener('click', async () => {
    page++;

    try {
      const response = await imagesSearch(searchQuery, page);
      handleImageResponse(response);
      lightbox.refresh();
      const totalImagesLoaded = page * 10;
      const totalHits = response.totalHits;
      if (totalImagesLoaded >= totalHits) {
        loadMoreBtn.style.display = 'none';
        if (page > 1) {
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }
      } else {
        loadMoreBtn.style.display = 'block';
      }
    } catch (error) {
      console.error('Error fetching more images:', error);
    }
  });
});
