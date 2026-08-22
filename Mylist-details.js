const API_KEY = "95cc9d7aca405fad4e649aec3ce05eae";
const myListDetails = document.querySelector("#myListDetails");
const params = new URLSearchParams(window.location.search);
const myListId = params.get("id");
const type = params.get("type");
console.log("ID:",myListId);
console.log("TYPE:" , type);


function loadMyListDetails() {
    const mediaType = type === "TV Show" ? "tv" : "movie";
    const URL =`https://api.themoviedb.org/3/${mediaType}/${myListId}?api_key=${API_KEY}`;

    fetch(URL)
        .then(response => {console.log("Status:",response.status) ;
        return response.json();
        })
        
        .then(item => {
            console.log("Item:",item);
            const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}`: "tv.jpeg";
            const title = item.title || item.name;
            const rating = item.vote_average ? item.vote_average.toFixed(1): "N/A";
            const date = item.release_date || item.first_air_date || "N/A";
            myListDetails.innerHTML = `
                <div class="details-poster">
                    <img src="${poster}" alt="${title}">
                </div>
                <div class="details-info">
                    <h1>${title}</h1>
                    <p>⭐ ${rating}</p>
                    <p>${type}</p>
                    <p> Release Date: ${date}</p>
                    <p>${item.overview || "No description available"}</p>
                    <button class="remove-btn" id="removeFromList">🗑️ Remove from My List </button>
                </div>`;
                const removeButton = document.querySelector("#removeFromList");
                removeButton.addEventListener("click", function() {
                    let myList =  JSON.parse(localStorage.getItem("myList")) || [];
                    myList = myList.filter(function(item) {
                        return item.id != myListId ;
                    });
                    localStorage.setItem("myList" , JSON.stringify(myList));
                    window.location.href= "MyList.html";
                });
        })
        .catch(error => {
            console.log("TV Details Error:", error);
        });

}
loadMyListDetails();