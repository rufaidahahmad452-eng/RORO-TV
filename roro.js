
/* ==========================================
        MY LIST BUTTON
========================================== */

const myListButton = document.querySelector(".btn-secondary");
const buttonIcon = document.querySelector(".btn-icon");
const buttonText = document.querySelector(".btn-text");

let isAdded = localStorage.getItem("myList") === "true";


function updateMyListButton() {

    if (isAdded) {

        buttonIcon.classList.remove("fa-plus");
        buttonIcon.classList.add("fa-check");

        buttonText.textContent = "Added";

        myListButton.classList.add("added");

    } else {

        buttonIcon.classList.remove("fa-check");
        buttonIcon.classList.add("fa-plus");

        buttonText.textContent = "My List";

        myListButton.classList.remove("added");

    }

}


/* Show saved status when page opens */

updateMyListButton();


/* Add / Remove from My List */

myListButton.addEventListener("click", function () {

    isAdded = !isAdded;

    if (isAdded) {

        localStorage.setItem("myList", "true");

    } else {

        localStorage.removeItem("myList");

    }

    updateMyListButton();

});
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
const cards = document.querySelectorAll(".card");

searchButton.addEventListener("click", function (event) {

    event.preventDefault();

    searchBox.classList.toggle("show");

    if (!searchBox.classList.contains("show")) {

        searchInput.value = "";

        cards.forEach(function (card) {
            card.style.display = "block";
        });

    }

});


document.addEventListener("click", function (event) {

    if (
        !searchBox.contains(event.target) &&
        !searchButton.contains(event.target)
    ) {

        searchBox.classList.remove("show");

        searchInput.value = "";

        cards.forEach(function (card) {
            card.style.display = "block";
        });

    }

});


searchInput.addEventListener("keyup", function () {

    const searchValue = searchInput.value.toLowerCase();

    cards.forEach(function (card) {

        const movieName = card.querySelector("h3").textContent.toLowerCase();

        if (movieName.includes(searchValue)) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

});


/* ==========================================
        NOTIFICATIONS
========================================== */

const notificationCount = document.querySelector(".notification-count");
const notificationButton = document.querySelector("#notificationBtn");
const notificationBox = document.querySelector(".notification-box");
const notificationList = document.querySelector(".notification-list");

let notificationNumber = 3;

notificationButton.addEventListener("click", function (event) {

    event.preventDefault();

    notificationBox.classList.toggle("show");

    if (notificationNumber > 0) {

        notificationNumber--;
        notificationCount.textContent = notificationNumber;

        if (notificationNumber === 0) {

            notificationCount.style.display = "none";

        }

    }

});


document.addEventListener("click", function (event) {

    if (
        !notificationBox.contains(event.target) &&
        !notificationButton.contains(event.target)
    ) {

        notificationBox.classList.remove("show");

    }

});


/* ==========================================
        NOTIFICATION MESSAGES
========================================== */

const notifications = [

    "🎬 Wednesday Season 3 is now available.",
    "📺 New episode of Dexter released.",
    "⭐ Prison Break added to Trending."

];

notifications.forEach(function (message) {

    const p = document.createElement("p");
    p.textContent = message;

    notificationList.appendChild(p);

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

const API_KEY = "95cc9d7aca405fad4e649aec3ce05eae";
const API_URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;
const movieCards = document.querySelector("#movieCards");
fetch(API_URL).then( response => response.json()).then(data => {
        console.log(data);

        data.results.forEach(function(movie) {
            const card = document.createElement("div");
            card.classList.add("card");
            const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`: "tv.jpeg";
            card.innerHTML = `<img src="${poster}" alt="${movie.title}">

                <div class="card-info">
                    <h3>${movie.title}</h3>
                    <p>Movie</p>
                    <span>⭐ ${movie.vote_average.toFixed(1)}</span>
                </div>
                 `;
            movieCards.appendChild(card);

        });

    })
    .catch(error => {

        console.log("Error:", error);

    });
