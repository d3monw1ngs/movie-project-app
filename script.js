const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'api_key=b5e824a3d922f68ba211fcf6dbdcb6f5';
const API_URL = BASE_URL + '/discover/movie?sort_by-popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;

const options = {
    params: {
        key: API_KEY,
        query: "",
        include_adult: false,
        language: "en-US",
        primary_release_year: "",
        page: 1,
        region: "",
        year: "", 
    }
}

const genre = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');

// PAGINATION
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const current = document.getElementById('current')

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;


// GENRE SECTION
var selectedGenre = []
setGenre();
function setGenre() {
    tagsEl.innerHTML = '';
    genre.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else {
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx, 1);
                        }
                    })
                }else {
                    selectedGenre.push(genre.id);
                }
            }
                console.log(selectedGenre)
                getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.
                    join(',')))
                highlightSelection()
        })
        tagsEl.append(t);
    })
}

// Selecting Genres
function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight');
    })
    clearBtn();
    if(selectedGenre.length != 0) {
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add('highlight');
        })
    }     
}

// Clearing Genre Selection
function clearBtn() {
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight')
    }else {
        let clear = document.createElement('div');
        clear.classList.add('tag', 'highlight');
        clear.id = 'clear';
        clear.innerText = 'CLEAR x';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();
            getMovies(API_URL);
        })
        tagsEl.append(clear);
    }
}


getMovies(API_URL);

// to display movie cards
function getMovies(url) {
    lastUrl = url;    
    fetch(url).then(res => res.json()).then(data => {
       console.log(data.results)
       if(data.results.length !== 0){
            showMovies(data.results);
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;

            current.innerText = currentPage;
            if(currentPage <= 1){
                prev.classList.add('disabled');
                next.classList.remove('disabled');
            }else if(currentPage >= totalPages){
                prev.classList.remove('disabled');
                next.classList.add('disabled');
            }else{
                prev.classList.remove('disabled');
                next.classList.remove('disabled');
            }

            tagsEl.scrollIntoView({behavior : 'smooth'});

       }else {
            main.innerHTML = `<h1 class="no-results">No Results Found</h1>`
       }        
    })
}

function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <img class="poster" src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1500"}" 
            alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${vote_average}">${vote_average}</span>
            </div>

        `
        main.appendChild(movieEl);
    })
}



// function getColor(vote) {
//     if(vote >= 8) {
//         return "green"
//     }else if (vote >= 5) {
//         return "orange"
//     }else{
//         return "red"
//     }
// }

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    selectedGenre=[];
    setGenre();

    if(searchTerm) {
        getMovies(searchURL+'&query='+searchTerm)
    }else{
        getMovies(API_URL);
    }
})

//function for previous page
prev.addEventListener('click', () => {
    if(prevPage > 0){
        pageCall(prevPage);
    }
})

// function for the next page 
next.addEventListener('click', () => {
    if(nextPage <= totalPages){
        pageCall(nextPage);
    }
})

function pageCall(page) {
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length - 1].split('=');
    if(key[0] != 'page') {
        let url = lastUrl + '&page=' + page;
        getMovies(url);
    }else{
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length - 1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] +'?'+ b;
        getMovies(url);
    }
}

// MODAL SECTION

















// document.addEventListener('DOMContentLoaded', function() {
//     const modal = document.getElementById('myModal');
//     const modalPoster = document.getElementById('modal-poster');
//     const modalTitle = document.getElementById('modal-title');
//     const modalVote = document.getElementById('modal-vote');
//     const modalPopularity = document.getElementById('modal-popularity');
//     const modalOrigTitle = document.getElementById('modal-original-title');
//     const modalGenre = document.getElementById('modal-genre');
//     const modalOverview = document.getElementById('modal-overview');
//     const addToWatchedBtn = document.getElementById('addToWatchedBtn');
//     const addToQueuBtn = document.getElementById('addToQueuBtn');
//     const closeBtn = document.getElementsByClassName('close')[0];

//     // function to open the modal with movie details
//     function openModal(movie) {
//         modalPoster.src = movie.poster_path;
//         modalTitle.textContent = movie.title;
//         modalVote.textContent = movie.vote_average;
//         modalPopularity.textContent = movie.popularity;
//         modalOrigTitle.textContent = movie.original_title;
//         modalGenre.textContent = movie.genre;
//         modalOverview.textContent = movie.overview;
//         modal.style.display = "block";
//     }


//     // function to close the modal
//     function closeModal() {
//         modal.style.display = "none";
//     }

//     // event listener for the close button
//     closeBtn.addEventListener('click', closeModal);

//     // event listener for clicks outside the modal
//     window.addEventListener('click', function(event) {
//         if(event.target === modal) {
//             closeModal();
//         }
//     });

//     // event listener for the "Add to Watched" button
//     addToWatchedBtn.addEventListener('click', function() {
//         console.log("Movie added to Watched list");
//         closeModal();
//     });

//     // event listener for the "Add to Queu" button
//     addToQueuBtn.addEventListener('click', function() {
//         console.log("Movie added to Queu");
//         closeModal();
//     });
// });