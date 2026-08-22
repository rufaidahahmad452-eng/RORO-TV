const API_KEY = "95cc9d7aca405fad4e649aec3ce05eae";
const showsDetails = document.querySelector("#showsDetails");
const params = new URLSearchParams(window.location.search);
const showId = params.get("id");


function loadShowsDetails() {

    const URL = `https://api.themoviedb.org/3/tv/${showId}?api_key=${API_KEY}`;

    fetch(URL)
        .then(response => response.json())
        .then(show => {
            console.log(show);
            console.log("Number of Seasons: ", show.number_of_seasons);
            console.log("Number of episodes: ", show.number_of_episodes);
            console.log("Seasons: ", show.seasons);
            const poster = show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : "tv.jpeg";
            const rating = show.vote_average ? show.vote_average.toFixed(1) : "N/A";
            const seasons = show.seasons.filter(function (season) { return season.season_number > 0 });
            let seasonsHTML = "";
           seasons.forEach(function (season) {
            const seasonPoster = season.poster_path ? `https://image.tmdb.org/t/p/w500${season.poster_path}`: poster;
             seasonsHTML += `
<div class="season-item">
    <img src="${season.poster_path ? `https://image.tmdb.org/t/p/w500${season.poster_path}` : poster}" 
         alt="Season ${season.season_number}">
    <div class="season-info">
        <h3>Season ${season.season_number}</h3>
        <p>${season.episode_count} Episodes</p>
        <button class="season-btn" data-season="${season.season_number}">▶</button>
    </div>
</div>`;
        });
            showsDetails.innerHTML = `
                <div class="details-poster">
                    <img src="${poster}" alt="${show.name}">
                </div>
                <div class="details-info">
                    <h1>${show.name}</h1>
                    <p>⭐ ${rating}</p>
                    <p>📺 Seasons: ${show.number_of_seasons}</p>
                    <p>🎬 Episodes: ${show.number_of_episodes}</p>
                    <p> Release Date: ${show.first_air_date || "N/A"}</p>
                    <p>${show.overview || "No description available"}</p>
                    <button class="add-list-btn" id="addToList">❤️ My List</button>
                    <div class="seasons-section">
    <h2>Seasons</h2>

    <div id="seasonsContainer">
        ${seasonsHTML}
    </div>

    <div id="episodesContainer"></div>
</div>    
                </div>`;
                const addButton = document.querySelector("#addToList");
                let myList = JSON.parse(localStorage.getItem("myList")) || [];

const exists = myList.some(function(item) {
    return item.id === show.id && item.type === "TV Show";
});

if (exists) {
    addButton.textContent = "✓ Added";
}

addButton.addEventListener("click", function(event) {

    event.preventDefault();
    event.stopPropagation();

    let myList = JSON.parse(localStorage.getItem("myList")) || [];
    const alreadyExists = myList.some(function(item) {
        return item.id === show.id && item.type === "TV Show";
    });

    if (!alreadyExists) {

        myList.push({
            id: show.id,
            title: show.name,
            poster: poster,
            type: "TV Show",
            rating: rating
        });

        localStorage.setItem("myList", JSON.stringify(myList));
        addButton.textContent = "✓ Added";
    } else {
        addButton.textContent = "✓ Added";

    }
    const seasonButtons = document.querySelectorAll(".season-btn");
const episodesContainer = document.querySelector("#episodesContainer");

seasonButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const seasonNumber = button.dataset.season;

        // لو نفس السيزون مفتوح، اقفله
        if (episodesContainer.dataset.season === seasonNumber) {
            episodesContainer.innerHTML = "";
            episodesContainer.dataset.season = "";
            button.textContent = "▶";
            return;
        }

        // رجع كل الأزرار ▶
        seasonButtons.forEach(function(btn) {
            btn.textContent = "▶";
        });

        const episodesURL =
            `https://api.themoviedb.org/3/tv/${showId}/season/${seasonNumber}?api_key=${API_KEY}`;

        fetch(episodesURL)
            .then(response => response.json())
            .then(seasonData => {

                episodesContainer.innerHTML = "";
                episodesContainer.dataset.season = seasonNumber;

                seasonData.episodes.forEach(function(episode) {

                    const episodeCard = document.createElement("div");
                    episodeCard.classList.add("episode-card");

                    const episodeImage = episode.still_path
                        ? `https://image.tmdb.org/t/p/w500${episode.still_path}`
                        : "tv.jpeg";

                    const runtime = episode.runtime
                        ? `${episode.runtime} min`
                        : "N/A";

                    episodeCard.innerHTML = `
                        <img src="${episodeImage}" alt="${episode.name}">
                        <div class="episode-info">
                            <h3>Episode ${episode.episode_number}: ${episode.name}</h3>
                            <p>${runtime}</p>
                        </div>
                    `;

                    episodesContainer.appendChild(episodeCard);
                });

                button.textContent = "▼";
            })
            .catch(error => {
                console.log("Episodes Error:", error);
            });

    });

});

});
        })
        .catch(error => {
            console.log("TV Details Error:", error);
        });

}
loadShowsDetails();