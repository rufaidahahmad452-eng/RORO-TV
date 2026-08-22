const API_KEY = "95cc9d7aca405fad4e649aec3ce05eae";
const movieDetails = document.querySelector("#movieDetails");
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");


function loadMovieDetails() {

    const URL =`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;

    fetch(URL)
        .then(response => response.json())
        .then(movie => {
            console.log(movie);
            const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`: "tv.jpeg";
            const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
            movieDetails.innerHTML = `
                <div class="details-poster">
                    <img src="${poster}" alt="${movie.title}">
                </div>
                <div class="details-info">
                    <h1>${movie.title}</h1>
                    <p>⭐ ${movie.vote_average.toFixed(1)}</p>
                    <p> Release Date:${movie.release_date}</p>
                    <p>${movie.overview}</p>
                    <button class="add-list-btn" id="addToList">❤️ My List</button>
                </div>`;
                const addButton = document.querySelector("#addToList");
                let myList = JSON.parse(localStorage.getItem("myList")) || [];
                const exists = myList.some(function(item) {
                    return item.id == movie.id;
                });
                if (exists) {
                    addButton.textContent = "✓ Added";
                }
                addButton.addEventListener("click" , function() {
                    let myList = JSON.parse(localStorage.getItem ("myList")) || [];
                    const alreadyExists = myList.some(function(item) {
                        return item.id == movie.id;
                    });
                    if (!alreadyExists) {
                        myList.push( {
                            id: movie.id ,
                            title: movie.title,
                            poster :poster,
                            type: "Movie",
                            rating: rating
                        });
                        localStorage.setItem( "myList" , JSON.stringify(myList));
                        addButton.textContent = "✓ Added";
                        console.log("Movie added to My List");
                    } else {
                        addButton.textContent = "✓ Added";
                    }
                });
        })
        .catch(error => {
            console.log("Movie Details Error:", error);
        });

}
loadMovieDetails();