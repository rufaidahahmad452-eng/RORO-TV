const API_KEY = "95cc9d7aca405fad4e649aec3ce05eae";
const MOVIES_API_URL =`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;
const movieCards = document.querySelector("#movieCards");

function displayMovies(movies) {
    movieCards.innerHTML = "";
    let myList = JSON.parse(localStorage.getItem("myList")) || [];
    movies.forEach(function(movie) {
        const card = document.createElement("div");
        card.classList.add("card");
        const poster = movie.poster_path? `https://image.tmdb.org/t/p/w500${movie.poster_path}`: "tv.jpeg";
        const rating = movie.vote_average ? movie.vote_average.toFixed(1): "N/A";
        const exists = myList.some(function (item) {
                return item.id === movie.id;
            });
        card.innerHTML = `
            <img src="${poster}" alt="${movie.title}">
            <div class="card-info">
                <h3>${movie.title}</h3>
                <p>Movie</p>
                <span>⭐ ${rating}</span>
                <button class="add-list-btn">${exists ? "✓ Added" : "❤️ My List"}</button>

            </div>`;
            const addButton = card.querySelector(".add-list-btn");
            addButton.addEventListener("click", function(event){
                event.preventDefault();
                event.stopPropagation();
                let myList = JSON.parse(localStorage.getItem("myList")) || [];
                const exists= myList.some(function(item) {
                    return item.id === movie.id;
                });
                if(!exists){
                    myList.push({
                        id :movie.id,
                        title:movie.title,
                        poster:poster,
                        type:"Movie",
                        rating:rating
                    });
                    localStorage.setItem("myList",JSON.stringify(myList));
                    addButton.textContent =  "✓ Added";
                }
            });
        movieCards.appendChild(card);
    });
}

/*  LOAD TRENDING MOVIES*/
function loadMovies() {
    fetch(MOVIES_API_URL)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayMovies(data.results);
        })

        .catch(error => {
            console.log("Movies Error:", error);
        });

}

loadMovies();

/* SEARCH */

const searchButton = document.querySelector("#searchBtn");
const searchBox = document.querySelector(".search-box");
const searchInput = document.querySelector("#searchInput");

searchButton.addEventListener("click", function(event) {
    event.preventDefault();
    searchBox.classList.toggle("show");
    if (searchBox.classList.contains("show")) {
        searchInput.focus();
    } else {
        searchInput.value = "";
        loadMovies();
    }

});
/* Search while typing */

searchInput.addEventListener("keyup", function() {
    const searchValue = searchInput.value.trim();
    if (searchValue === "") {
        loadMovies();
        return;
    }
    searchMovies(searchValue);

});

/* Search Movies */
function searchMovies(query) {
    const SEARCH_API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
    fetch(SEARCH_API_URL).then(response => response.json()).then(data => {
            console.log(data);
            displayMovies(data.results);
        })
        .catch(error => {
            console.log("Search Error:", error);
        });

}
/*  CLOSE SEARCH*/
document.addEventListener("click", function(event) {
    if (
        !searchBox.contains(event.target) &&
        !searchButton.contains(event.target)
    ) {
        searchBox.classList.remove("show");
    }

});