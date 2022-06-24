const API_KEY = `8f048d8bf0dcc8839670fde2addd2368`;
const API_LANGUAGE = `pt-br`;
const BASE_URL_IMAGE = `https://image.tmdb.org/t/p/original`;
const LIST_MOVIES = [
  "tt2380307",
  "tt12801262",
  "tt2096673",
  "tt5109280",
  "tt7146812",
  "tt2948372",
  "tt2953050",
  "tt3521164",
  "tt8097030",
];

const moviesList = document.getElementById("movies__list");

function getUrlMovie(movieId) {
  return `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=${API_LANGUAGE}`;
}

//Inicializa os dados do filme principal
function setMainMovie(movieId) {
  fetch(getUrlMovie(movieId))
    .then((response) => response.json())
    .then((data) => {
      const app = document.getElementById("app");
      const title = document.querySelector(".movie h1");
      const description = document.querySelector(".movie p");
      const info = document.querySelector(".movie span");
      const rating = document.querySelector(".rating strong");

      const yearRelease = data.release_date.split("-")[0];

      title.innerHTML = data.title;
      description.innerHTML = data.overview;
      rating.innerHTML = data.vote_average;
      info.innerHTML = `${yearRelease} - ${data.genres[0].name} - Filme`;

      const image = BASE_URL_IMAGE.concat(data.backdrop_path);

      app.style.backgroundImage = `linear-gradient(
      90.18deg,
      rgb(13, 22, 46, 0.7) 23.21%,
      rgba(13, 22, 46, 0.0001) 96.69%
    ),
    url("${image}")`;
    });
}

function createButtonMovie(movieId) {
  const button = document.createElement("button");
  button.setAttribute("onclick", `setMainMovie('${movieId}')`);
  button.innerHTML = `<img src="/assets/icon-play-button.png" alt="icon-play-button"/>`;

  return button;
}

function createMovie(movieId) {
  fetch(getUrlMovie(movieId))
    .then((response) => response.json())
    .then((data) => {
      const movie = document.createElement("li");
      const genre = `<span>${data.genres[0].name}</span>`;
      const title = `<strong>${data.title}</strong>`;

      const image = BASE_URL_IMAGE.concat(data.backdrop_path);

      movie.innerHTML = genre + title;
      movie.appendChild(createButtonMovie(movieId));
      movie.style.backgroundImage = `linear-gradient(
        180deg,
        rgba(14, 23, 47, 0.0001) 11.72%,
        #0e172f 100%
      ),
      url("${image}")`;
      moviesList.appendChild(movie);
    });
}

function loadListMovies() {
  LIST_MOVIES.map(createMovie);
}

loadListMovies();
//Inicializa os dados do filme principal
setMainMovie(LIST_MOVIES[0]);
