import axios from 'axios';

export async function imagesSearch(query, page) {
  const API_KEY = '41297704-d8a6ac244abb7ac58f946c991';
  const perPage = 40;

  const response = await axios.get('https://pixabay.com/api/', {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: perPage,
    },
  });

  return response.data;
}
