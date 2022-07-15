const API_KEY = `8f048d8bf0dcc8839670fde2addd2368`;
const API_LANGUAGE = `pt-br`;
const BASE_URL_IMAGE = {
  original: `https://image.tmdb.org/t/p/original`,
  small: `https://image.tmdb.org/t/p/w500`,
};

const LIST_DEFAULT_MOVIES = ["tt4154796", "tt2527338"];

const movies = [];

let movieActive = "";
const moviesElement = document.getElementById("movies");

const buttonAddMovie = document.getElementById("add__movie");
const inputID = document.querySelector(".form__input");

function getUrlMovie(movieId) {
  return `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=${API_LANGUAGE}`;
}

function resetFormPlaceholder() {
  buttonAddMovie.classList.remove("error");
  inputID.setAttribute("placeholder", "Adicione seu filme");
}

function changeButtonMenu() {
  const button = document.querySelector(".button__menu");
  const navigation = document.querySelector(".navigation");

  button.classList.toggle("active");
  navigation.classList.toggle("active");

  if (button.classList.contains("active")) {
    resetFormPlaceholder();
  }
}

//Inicializa os dados do filme principal
function setMainMovie(movie) {
  const appImage = document.querySelector(".app__image img");
  const title = document.querySelector(".feature__movie h1");
  const description = document.querySelector(".feature__movie p");
  const info = document.querySelector(".feature__movie span");
  const rating = document.querySelector(".rating strong");
  const watchNowLink = document.querySelector(".button");

  title.innerHTML = movie.title;
  description.innerHTML = movie.overview;
  rating.innerHTML = movie.vote_average;
  info.innerHTML = `${movie.release} - ${movie.genre} - Filme`;

  appImage.setAttribute("src", movie.image.original);

  if (movie.homePage === "") {
    watchNowLink.setAttribute("target", "");
    watchNowLink.setAttribute("href", "#");
  } else {
    watchNowLink.setAttribute("target", "_blank");
    watchNowLink.setAttribute("href", movie.homePage);
  }
}

function changeMovieActiveInList(newMovieActive) {
  const movieActiveCurrent = document.getElementById(movieActive);
  movieActiveCurrent.classList.remove("active-movie");

  const movieActiveNew = document.getElementById(newMovieActive);
  movieActiveNew.classList.add("active-movie");

  movieActive = newMovieActive;
}

function changeMainMovie(movieId) {
  changeMovieActiveInList(movieId);

  const movie = movies.find((movie) => movie.id === movieId);

  if (movie?.id) {
    setMainMovie(movie);
    changeButtonMenu();
    resetFormPlaceholder();
  } else {
    console.log(movies);
    console.log("Não foi possivel encontrar o filme com o id: " + movieId);
  }
}

function createPlayButtonMovie(movieId) {
  const button = document.createElement("button");
  button.classList.add("play__button");
  button.setAttribute("onclick", `changeMainMovie('${movieId}')`);
  button.innerHTML = `<img src="/assets/icon-play-button.png" alt="icon-play-button"/>`;

  return button;
}

function createTrashButtonMovie(movieId) {
  const button = document.createElement("button");
  button.classList.add("trash__button");
  button.setAttribute("onclick", `deleteMovieInList('${movieId}')`);
  button.innerHTML = `<img src="/assets/icon-trash-button.png" alt="icon-trash-button"/>`;

  return button;
}

function createImageMovie(movieImage, movieTitle) {
  const divImageMovie = document.createElement("div");
  divImageMovie.classList.add("movie__image");
  const image = document.createElement("img");

  image.setAttribute("src", movieImage);
  image.setAttribute("alt", `Imagem do filme ${movieTitle}`);
  image.setAttribute("loading", "lazy");

  divImageMovie.appendChild(image);

  return divImageMovie;
}

function addMovieInList(movie) {
  const movieElement = document.createElement("li");
  movieElement.classList.add("movie");
  movieElement.setAttribute("id", movie.id);

  const genre = `<span>${movie.genre}</span>`;
  const title = `<strong>${movie.title}</strong>`;

  movieElement.innerHTML = genre + title;
  movieElement.appendChild(createPlayButtonMovie(movie.id));
  movieElement.appendChild(createTrashButtonMovie(movie.id));
  movieElement.appendChild(createImageMovie(movie.image.small, movie.title));

  moviesElement.appendChild(movieElement);
}

async function getMovieData(movieId) {
  const isMovieInList = movies.findIndex((movie) => movie.id === movieId);

  if (isMovieInList === -1) {
    try {
      let data = await fetch(getUrlMovie(movieId));
      data = await data.json();

      // console.log(data);

      if (data.success === false) {
        return true;
      }

      const movieData = {
        id: movieId,
        title: data.title,
        overview: data.overview,
        vote_average: data.vote_average,
        genre: data.genres[0].name,
        release: data.release_date.split("-")[0],
        homePage: data.homepage,
        image: {
          original: BASE_URL_IMAGE.original.concat(data.backdrop_path),
          small: BASE_URL_IMAGE.small.concat(data.backdrop_path),
        },
      };

      movies.push(movieData);

      return movieData;
    } catch (error) {
      console.log("Mensagem de ERRO: " + error.message);
    }
  }

  return null;
}

function formattedMovieId(movieId) {
  if (movieId.includes("https://www.imdb.com/title/")) {
    const id = movieId.split("/")[4];
    return id;
  }

  return movieId;
}
//Função que atualiza o localStorage
function updateLocalStorage(newMovieID) {
  const localFilms = JSON.parse(localStorage.getItem("localList"));
  localFilms.push(newMovieID);
  localStorage.setItem("localList", JSON.stringify(localFilms));
}

buttonAddMovie.addEventListener("submit", async function (event) {
  event.preventDefault();

  const newMovieId = formattedMovieId(event.target["movie"].value);
  const newMovie = await getMovieData(newMovieId);

  // console.log(newMovie);

  if (typeof newMovie === "object" && newMovie?.id) {
    addMovieInList(newMovie);
    updateLocalStorage(newMovie["id"]);
    resetFormPlaceholder();
  } else if (newMovie === null) {
    event.target["movie"].value = "";
    inputID.setAttribute("placeholder", "Este filme já está na lista!");
    buttonAddMovie.classList.add("error");
  } else {
    event.target["movie"].value = "";
    inputID.setAttribute("placeholder", "ID inválido!");
    buttonAddMovie.classList.add("error");
  }

  event.target["movie"].value = "";
});

function loadMoviesList(movie_list) {
  movie_list.map(async (movie, index) => {
    const movieData = await getMovieData(movie);
    addMovieInList(movieData);

    if (index === 0) {
      setMainMovie(movieData);
      movieActive = movieData.id;
      const movieActiveNew = document.getElementById(movieActive);
      movieActiveNew.classList.add("active-movie");

      movieActive = movieData.id;
    }
  });
}

function loadMovies() {
  if (localStorage.length === 0) {
    loadMoviesList(LIST_DEFAULT_MOVIES);
    localStorage.setItem("localList", JSON.stringify(LIST_DEFAULT_MOVIES));
  } else {
    let localList = JSON.parse(localStorage.getItem("localList"));
    loadMoviesList(localList);
  }
}

function deleteMovieInList(movieId) {
  const movieIndex = movies.findIndex((movie) => movie.id === movieId);
  const localFilms = JSON.parse(localStorage.getItem("localList"));
  localFilms.splice(movieIndex, 1);
  movies.splice(movieIndex, 1);
  localStorage.setItem("localList", JSON.stringify(localFilms));
  const movieElement = document.getElementById(`${movieId}`);
  movieElement.parentNode.removeChild(movieElement);
}

function showModal(modalID) {
  const modal = document.getElementById(modalID);
  modal.classList.add("show-modal");

  modal.addEventListener("click", (e) => {
    if (e.target.id == modalID || e.target.className == "close__button-bar") {
      modal.classList.remove("show-modal");
    }
    if (e.target.className == "close__button") {
      modal.classList.remove("show-modal");
    }
  });
}

const infoLink = document.querySelector(".add__movie-info-link");

infoLink.addEventListener("click", () => showModal("modal__info-container"));

loadMovies();
