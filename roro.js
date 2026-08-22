/* ==========================================
        START WATCHING BUTTON
========================================== */

const startButton = document.querySelector("#startBtn");
const trendingSection = document.querySelector("#trending");

startButton.addEventListener("click", function () {
    trendingSection.scrollIntoView({
        behavior: "smooth"
    });

});

/* ==========================================
        SEARCH
========================================== */

const searchButton = document.querySelector("#searchBtn");
const searchBox = document.querySelector(".search-box");
const searchInput = document.querySelector("#searchInput");
const movieCards = document.querySelector("#movieCards");


// ---------- API KEY ----------

const API_KEY = "95cc9d7aca405fad4e649aec3ce05eae";

// ---------- Trending Movies URL ----------

const API_URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;

// ---------- Open / Close Search ----------

searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    searchBox.classList.toggle("show");
    if (searchBox.classList.contains("show")) { 
        searchInput.focus();
    } else {
        searchInput.value = "";
        loadTrendingMovies();
    }
});

// ---------- Prevent Search Box from Closing ----------

searchBox.addEventListener("click", function (event) { event.stopPropagation();});

// ---------- Close Search When Clicking Outside ----------

document.addEventListener("click", function (event) {
    if (
        !searchBox.contains(event.target) &&
        !searchButton.contains(event.target)
    ) {
        searchBox.classList.remove("show");
        searchInput.value = "";
        loadTrendingMovies();
    }
});

// ---------- Search Input ----------

searchInput.addEventListener("keyup", function () {
    const searchValue = searchInput.value.trim();
    if (searchValue === "") {
        loadTrendingMovies();
        return;
    }
    searchMovies(searchValue);
});

// ==========================================
//        LOAD TRENDING MOVIES
// ==========================================

function loadTrendingMovies() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            displayMovies(data.results);
        })
        .catch(error => {
            console.log("Trending Error:", error);
        });
}

// ==========================================
//        SEARCH MOVIES
// ==========================================
function searchMovies(query) {

    const searchURL =`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
    fetch(searchURL).then(response => response.json()) .then(data => {
        const results = data.results.filter(function(item) {
                return item.media_type === "movie" ||
                       item.media_type === "tv";

            });
            displaySearchResults(results);
        })
        .catch(error => {
            console.log("Search Error:", error);
        });
}
function displaySearchResults(items) {
    movieCards.innerHTML = "";
    items.forEach(function(item) {
        const card = document.createElement("div");
        card.classList.add("card");
        const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}`: "tv.jpeg";
        const title = item.title || item.name;
        const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";
        const type = item.media_type === "movie" ? "Movie" : "TV Show";

        card.innerHTML = `
            <img src="${poster}" alt="${title}">
            <div class="card-info">
                <h3>${title}</h3>
                <p>${type}</p>
                <span>⭐ ${rating}</span>
                <button class="add-list-btn"> ❤️ My List</button>
            </div>`;

        // ==========================
        // MY LIST BUTTON
        // ==========================

        const addButton =card.querySelector(".add-list-btn");
        addButton.addEventListener("click", function(event) {
            event.preventDefault();
            event.stopPropagation();
            let myList = JSON.parse(localStorage.getItem("myList")) || [];
            const exists = myList.some(function(savedItem) {
                return savedItem.id === item.id &&
                       savedItem.type === type;
            });
            if (!exists) {
                myList.push({
                    id: item.id,
                    title: title,
                    poster: poster,
                    type: type,
                    rating: rating
                });
                localStorage.setItem("myList", JSON.stringify(myList) );
                addButton.textContent = "✓ Added";
            } else {
                addButton.textContent = "✓ Added";
            }

        });


        // ==========================
        // OPEN DETAILS
        // ==========================
        card.addEventListener("click", function() {
            if (item.media_type === "movie") {
                window.location.href = `movie-details.html?id=${item.id}`;
            }
            else if (item.media_type === "tv") {
                 window.location.href = `shows-details.html?id=${item.id}`;

            }

        });

        movieCards.appendChild(card);

    });

}


// ==========================================
//        DISPLAY MOVIES
// ==========================================

function displayMovies(movies) {

    movieCards.innerHTML = "";
    movies.forEach(function (movie) {
        console.log("Movie loaded:", movie.title);
        const card = document.createElement("div");
        card.classList.add("card");

        const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "tv.jpeg";
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
        card.innerHTML = `

            <img src="${poster}" alt="${movie.title}">
            <div class="card-info">
                <h3>${movie.title}</h3>
                <p>Movie</p>
                <span>⭐ ${rating}</span>
                <button  type="button" class="add-list-btn">My List</button>
            </div>
        `;
        const addButton = card.querySelector(".add-list-btn");
        addButton.addEventListener("click", function () {
            console.log("BUTTON CLICKED");
            let myList = JSON.parse(localStorage.getItem("myList")) || [];
            if (!Array.isArray(myList)) {
                myList = [];
            }
            const item = {
                id: movie.id,
                title: movie.title,
                poster: poster,
                type: "Movie",
                rating: rating
            };
            const exists = myList.some(function (x) {
                return x.id === movie.id;
            });

            if (!exists) {

                myList.push(item);
                localStorage.setItem("myList",JSON.stringify(myList));
                addButton.textContent = "✓ Added";
            } else {
                addButton.textContent = "✓ Added";
            }
        });
        movieCards.appendChild(card);
    });

}
function loadHome() {
    Promise.all([
        fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`) .then(response => response.json()),
        fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`) .then(response => response.json())

    ]).then(data => {
        const movies = data[0].results.map(function(movie) {
            return {...movie,type: "Movie"};
        });
        const shows = data[1].results.map(function(show) {
            return {...show,type: "TV Show" };
        });
        const allItems = [...movies, ...shows];
        displayHome(allItems);

    })

    .catch(error => {
        console.log("Home Error:", error);
    });

}

function displayHome(items) {
    movieCards.innerHTML = "";
    let myList = JSON.parse(localStorage.getItem("myList")) || [];
    items.forEach(function(item) {
        const card = document.createElement("div");
        card.classList.add("card");

        const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "tv.jpeg";
        const title = item.title || item.name;
        const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";
        const exists = myList.some(function(savedItem) {
            return savedItem.id === item.id && savedItem.type === item.type;
        });

        card.innerHTML = `
            <img src="${poster}" alt="${title}">
            <div class="card-info">
                <h3>${title}</h3>
                <p>${item.type}</p>
                <span>⭐ ${rating}</span>
                <button class="add-list-btn"> ${exists ? "✓ Added" : "❤️ My List"} </button>
            </div>
        `;
        // ==========================================
        // MY LIST BUTTON
        // ==========================================

        const addButton = card.querySelector(".add-list-btn");
        addButton.addEventListener("click", function(event) {
            event.preventDefault();
            event.stopPropagation();

            myList = JSON.parse(localStorage.getItem("myList")) || [];
            const alreadyExists = myList.some(function(savedItem) {
                return savedItem.id === item.id && savedItem.type === item.type;
            });

            if (!alreadyExists) {
                myList.push({
                    id: item.id,
                    title: title,
                    poster: poster,
                    type: item.type,
                    rating: rating
                });
                localStorage.setItem("myList",JSON.stringify(myList));

            }
            addButton.textContent = "✓ Added";
        });
        // ==========================================
        // OPEN DETAILS
        // ==========================================
        card.addEventListener("click", function() {
            if (item.type === "Movie") {
                window.location.href =`movie-details.html?id=${item.id}`;
            } else {
                window.location.href =`shows-details.html?id=${item.id}`;
            }
        });
        movieCards.appendChild(card);

    });

}

// ---------- Load Trending Movies When Page Opens ----------

loadHome();

/* ==========================================
        NOTIFICATIONS
========================================== */
/* NOTIFICATIONS */

const notificationButton = document.querySelector("#notificationBtn");
const notificationBox = document.querySelector(".notification-box");
const notificationCount = document.querySelector(".notification-count");

let notificationNumber = 0;

Promise.all([
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`).then(response => response.json()),

    fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`).then(response => response.json())
])

    .then(data => {

        notificationNumber =
            data[0].results.length + data[1].results.length;

        notificationCount.textContent = notificationNumber;

    });


/* OPEN / CLOSE */
notificationButton.addEventListener("click", function (event) {
    event.preventDefault();
    notificationBox.classList.toggle("show");
});

/* CLOSE WHEN CLICK OUTSIDE */
document.addEventListener("click", function (event) {
    if (
        !notificationBox.contains(event.target) &&
        !notificationButton.contains(event.target)
    ) {
        notificationBox.classList.remove("show");
    }

});
/* ==========================================
                LOGIN
========================================== */

const loginButton = document.querySelector("#loginBtn");
const loginPopup = document.querySelector("#loginPopup");
const closeButton = document.querySelector("#closeBtn");

const username = document.querySelector("#username");
const password = document.querySelector("#password");
const rememberMe = document.querySelector("#rememberMe");

const loginSubmit = document.querySelector("#loginSubmit");
const loginMessage = document.querySelector("#loginMessage");

const logoutButton = document.querySelector("#logoutBtn");


/* ---------- Clear Login Fields ---------- */

function clearLoginFields() {

    password.value = "";

    const savedUsername = localStorage.getItem("username");

    if (savedUsername) {

        username.value = savedUsername;
        rememberMe.checked = true;

    } else {

        username.value = "";
        rememberMe.checked = false;

    }

    loginMessage.textContent = "";
}


/* ---------- Open Login ---------- */

loginButton.addEventListener("click", function (event) {

    event.preventDefault();

    loginPopup.classList.add("show");

    clearLoginFields();

});


/* ---------- Close Login ---------- */

closeButton.addEventListener("click", function () {

    loginPopup.classList.remove("show");

    clearLoginFields();

});


/* ---------- Close by clicking outside ---------- */

document.addEventListener("click", function (event) {

    if (event.target === loginPopup) {

        loginPopup.classList.remove("show");

        clearLoginFields();

    }

});


/* ---------- Login ---------- */

loginSubmit.addEventListener("click", function () {

    if (username.value === "" || password.value === "") {

        loginMessage.textContent =
            "Please enter your username and password.";

        return;
    }


    // Login successful
    localStorage.setItem("isLoggedIn", "true");


    // Remember username
    if (rememberMe.checked) {

        localStorage.setItem("username", username.value);

    } else {

        localStorage.removeItem("username");

    }


    loginMessage.textContent = "Login Successful!";


    updateLoginStatus();


    setTimeout(function () {

        loginPopup.classList.remove("show");

        clearLoginFields();

    }, 1000);

});


/* ---------- Login Status ---------- */

function updateLoginStatus() {

    const isLoggedIn =
        localStorage.getItem("isLoggedIn");


    if (isLoggedIn === "true") {

        loginButton.style.display = "none";
        logoutButton.style.display = "block";

    } else {

        loginButton.style.display = "block";
        logoutButton.style.display = "none";

    }

}


/* ---------- Logout ---------- */

logoutButton.addEventListener("click", function () {

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");

    loginButton.style.display = "block";
    logoutButton.style.display = "none";

    clearLoginFields();

});


/* ---------- Check Login on Page Load ---------- */

updateLoginStatus();


