const mushroomCards = document.getElementById("muschroom-list");

function init(){
    showMushroomData();

    const deleteButton = document.getElementById("red.button");
    deleteButton.addEventListener("click", deleteMushroomList);
}
window.onload = init;

async function deleteMushroomList(){
    console.log("Delete button clicked");
    localStorage.removeItem("mushroom");
    showMushroomData();
    console.log("Mushroom list deleted from localStorage");
}

async function showMushroomData (){
    const mushroomList = JSON.parse(localStorage.getItem("mushroom")) || [];
    mushroomCards.innerHTML = "";
    if(mushroomList.length > 0){
        mushroomList.forEach(svamp => {
            const article = document.createElement('article');
            article.classList.add('green-section');

            article.innerHTML = `
            <img src="../svampar/${svamp.bild}" alt="${svamp.svenskt_namn}">
            <div class="svamp-info">
            <h3>${svamp.svenskt_namn}</h3>
            <p><em>${svamp.latinskt_namn}</em></p>
            </div>
  `         ;
            mushroomCards.appendChild(article)
        });
    }
    else{
        const noMushroomsMessage = document.createElement('p');
        noMushroomsMessage.textContent = "Inga svampar sparade.";
        mushroomCards.appendChild(noMushroomsMessage);
    }
}