const myListCards = document.querySelector("#myListCards");
const emptyMessage = document.querySelector("#emptyMessage");
let myList = JSON.parse(localStorage.getItem("myList")) || [];

function displayMyList() {
    myListCards.innerHTML ="";
    if(myList.length === 0){
        emptyMessage.style .display ="block";
        return;
    }
    emptyMessage.style .display ="none";
    myList.forEach(function(item) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML =`
        <img src="${item.poster}" alt ="${item.title}">
        <div class="card-info">
            <h3>${item.title}</h3>
            <p>${item.type}</p>
            <span>⭐ ${item.rating}</span>
            <button class="remove-btn"><i class="fa-solid fa-trash"></i> Remove</button>
        </div> `;
        card.querySelector(".remove-btn").addEventListener("click", function(event) {
            event.preventDefault();
            event.stopPropagation();
        myList = myList.filter(function(movie) {
        return movie.id !== item.id;
    });
    localStorage.setItem("myList", JSON.stringify(myList));
    displayMyList();
});
        card.addEventListener("click", function () {
        window.location.href =
        `mylist-details.html?id=${item.id}&type=${encodeURIComponent(item.type)}`;

});
        myListCards.appendChild(card);
    });
}
displayMyList();
