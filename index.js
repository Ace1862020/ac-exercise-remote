const BEST_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BEST_URL + '/api/v1/movies/'
const IMAGE_URL = BEST_URL + '/posters/'
const MOVIES_PER_PAGE = 12

const movies = []
let filteredMovies = []
const dataPanel = document.querySelector('#data-panel')
const searchFrom = document.querySelector('#search-from')
const searchInput = document.querySelector('#search-input')
const iconDisplay = document.querySelector('#icon-display')
let displayMovieList = 'fa-th'
const paginator = document.querySelector('#paginator')
let page = 1

// Render movie list 
function renderMovieList(data, display) {
  let rawHTML = ''
  if (display === 'fa-th') {
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
                <button type="button" class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
              </div>
            </div>
          </div>
        </div>`
      dataPanel.innerHTML = rawHTML
    })
  } else if (display === 'fa-bars') {
    rawHTML += `
      <div class="list w-100">
      <ul class="list-group list-group-flush">`
    data.forEach((item) => {
      rawHTML += `
        <div class="row border-top">
          <li class="list-group-item w-100 d-flex justify-content-between border-0">
            <div class="col-8">${item.title}</div>
            <div class="col-4">
              <button type="button" class="btn btn-primary btn-show-movie" data-toggle="modal"
                  data-target="#movie-modal" data-id="${item.id}">More</button>
                <button type="button" class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </li>
        </div>`
    })
    rawHTML += `
      </ul>
        </div>`
    dataPanel.innerHTML = rawHTML
  }
}

function getMovieByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const statrIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(statrIndex, statrIndex + MOVIES_PER_PAGE)
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
      <li class="page-item">
      <a class="page-link" href="#" data-page=${page}>${page}</a>
      </li>`
  }
  paginator.innerHTML = rawHTML
}

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

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// LINSTENER
// On click more button show movie modal Listener
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModel(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

// Search bar Submit
searchFrom.addEventListener('submit', function onSearchFromSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword))
  if (filteredMovies.length === 0) {
    return alert('哩功蝦? 蝦米' + keyword)
  }
  renderPaginator(filteredMovies.length)
  renderMovieList(getMovieByPage(1), displayMovieList)
})

// Pagination Listener
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  page = Number(event.target.dataset.page)
  renderMovieList(getMovieByPage(page), displayMovieList)
})

// Icon Listener
iconDisplay.addEventListener('click', function onIconClick(event) {
  displayMovieList = event.target.dataset.icon
  if (event.target.tagName === 'I') {
    renderMovieList(getMovieByPage(page), displayMovieList)
  }
})

// INDEX API
axios.get(INDEX_URL).then(function (response) {
  movies.push(...response.data.results)
  renderPaginator(movies.length)
  renderMovieList(getMovieByPage(page), displayMovieList)
})
  .catch((err) => console.log(err))