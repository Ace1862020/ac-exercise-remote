const BEST_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BEST_URL + '/api/v1/movies/'
const IMAGE_URL = BEST_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovies'))
const dataPanel = document.querySelector('#data-panel')

// Render movie list
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src="${IMAGE_URL + item.image}" class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-primary btn-show-movie" data-toggle="modal"
                data-target="#movie-modal" data-id="${item.id}">More</button>
              <button type="button" class="btn btn-danger btn-remove-favorite" data-id="${item.id}">x</button>
            </div>
          </div>
        </div>
      </div>`
    dataPanel.innerHTML = rawHTML
  })
}

// 處理 SHOW API 的資料
function showMovieModel(id) {
  const movieModalTitle = document.querySelector('#movie-modal-title')
  const movieModalDate = document.querySelector('#movie-modal-date')
  const movieModalDescription = document.querySelector('#movie-modal-description')
  const movieModalImage = document.querySelector('#movie-modal-image')
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    movieModalTitle.innerText = data.title
    movieModalDate.innerText = 'Release date: ' + data.release_date
    movieModalDescription.innerText = data.description
    movieModalImage.innerHTML = `<img
                src="${IMAGE_URL + data.image}"
                alt="movie-poster" class="img-fluid">`
  })
}

function removeFromFavorite(id) {
  if (!movies) return
  const movieIndex = movies.findIndex((movie) => { return movie.id == id })
  // console.log(movieIndex)
  if (movieIndex === -1) return alert('您的電影清單沒東西')
  movies.splice(movieIndex, 1)
  console.log(movies)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}

// On click more button show movie modal Listener
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    //console.log(event.target.dataset.id)
    showMovieModel(event.target.dataset.id)
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(event.target.dataset.id)
  }
})
renderMovieList(movies)