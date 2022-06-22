fetch(
  "https://api.themoviedb.org/3/movie/tt12801262?api_key=8f048d8bf0dcc8839670fde2addd2368&language=pt-br"
)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    const title = document.querySelector(".movie h1");
    const description = document.querySelector(".movie p");
    const info = document.querySelector(".movie span");
    const rating = document.querySelector(".rating strong");

    const yearRelease = data.release_date.split("-")[0];

    title.innerHTML = data.title;
    description.innerHTML = data.overview;
    rating.innerHTML = data.vote_average;
    info.innerHTML = `${yearRelease} - ${data.genres[0].name} - Filme`;
  });
