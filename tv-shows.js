const API_KEY = "95cc9d7aca405fad4e649aec3ce05eae";
const TV_API_URL =`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`;
const tvCards = document.querySelector("#tvCards");

function displayShows(show) {
    tvCards.innerHTML ="";
    let myList = JSON.parse(localStorage.getItem("myList")) || [];
    show.forEach(function(show) {
        const card = document.createElement("div");
        card.classList.add("card");
        const poster = show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : "tv.jpeg";
        const rating = show.vote_average ? show.vote_average.toFixed(1) :"N/A";
        const exists = myList.some(item => item.id === show.id);
        card.innerHTML = `
        <img src="${poster}" alt ="${show.name}">
        <div class="card-info">
            <h3>${show.name}</h3>
            <p>TV Shows</p>
            <span>⭐ ${rating}</span>
            <button class="add-list-btn">${exists ? "✓ Added" : "❤️ My List"}</button>

        </div> `;
        const addButton = card.querySelector(".add-list-btn");

addButton.addEventListener("click", function(event) {

    event.preventDefault();
    event.stopPropagation();

    if (!exists) {

        myList.push({
            id: show.id,
            title: show.name,
            poster: poster,
            type: "TV Show",
            rating: rating
        });
        localStorage.setItem("myList", JSON.stringify(myList) );
        addButton.textContent = "✓ Added";
    }

});
    card.addEventListener("click", function () {
    window.location.href = `shows-details.html?id=${show.id}`;
});
        tvCards.appendChild(card);

    });
}
/* ==========================================
        LOAD TRENDING TV SHOWS
========================================== */
function loadShows() {
    fetch(TV_API_URL).then(Response => Response.json()).then(data => {
        displayShows(data.results);
    })
    .catch(error => {
        console.log("TV Shows Error :" , error);
    });
}
/* Load TV Shows */
loadShows();

/* Search */
const searchButton = document.querySelector("#searchBtn");
const searchBox = document.querySelector(".search-box");
const searchInput = document.querySelector("#searchInput");

searchButton.addEventListener("click" , function(event) {
    event.preventDefault();
    searchBox.classList.toggle("show");

    if(searchBox.classList.contains("show") ){
        searchInput.focus();
    }else {
        searchInput.value ="";
        loadShows();
    }
})
/* Search while typing */
searchInput.addEventListener("keyup",function() {
    const searchValue = searchInput.value.trim();
    if (searchValue === ""){
        loadShows();
        return;
    }
    searchShows(searchValue);
});
/* Search TV Shows */
function searchShows(query){
    const SEARCH_API_URL = `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
fetch(SEARCH_API_URL).then(Response => Response.json()).then(data => {
    console.log(data);
    displayShows(data.results);
})
.catch(error => {
    console.log("Search Error:", error);
});
}
/* Close Search when clicking outside */
document.addEventListener("click", function (event) {
    if (
        !searchBox.contains(event.target) &&
        !searchButton.contains(event.target)
    ) {
        searchBox.classList.remove("show");
    }
});


