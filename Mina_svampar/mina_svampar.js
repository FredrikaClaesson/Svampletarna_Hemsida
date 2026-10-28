const mushroomCards = document.getElementById("mushroom-list");

function init() {
    showMushroomData();

    const deleteButton = document.getElementById("clear-mushrooms");

    if (deleteButton) {
        deleteButton.addEventListener("click", deleteMushroomList);
    }
}

// Kör init när HTML-koden har laddats.
window.addEventListener("DOMContentLoaded", init);

// Tar bort alla sparade svampar från listan.
function deleteMushroomList() {
    localStorage.removeItem("mushroom");
    showMushroomData();
}

// Hämtar och visar svamparna som sparats från startsidan.
function showMushroomData() {
    if (!mushroomCards) return;

    let mushroomList = [];

    try {
        const savedMushrooms = JSON.parse(localStorage.getItem("mushroom") || "[]");
        mushroomList = Array.isArray(savedMushrooms) ? savedMushrooms : [];
    } catch (error) {
        console.error("Kunde inte läsa sparade svampar:", error);
    }

    mushroomCards.replaceChildren();

    if (mushroomList.length > 0) {
        mushroomList.forEach(svamp => {
            const article = document.createElement("article");
            const image = document.createElement("img");
            const info = document.createElement("div");
            const heading = document.createElement("h2");
            const latinName = document.createElement("p");
            const latinText = document.createElement("em");

            image.src = `../svampar/${svamp.bild}`;
            image.alt = svamp.svenskt_namn;
            image.loading = "lazy";

            heading.textContent = svamp.svenskt_namn;
            latinText.textContent = svamp.latinskt_namn;
            latinName.appendChild(latinText);

            info.classList.add("svamp-info");
            info.append(heading, latinName);
            article.append(image, info);
            mushroomCards.appendChild(article);
        });
    } else {
        const noMushroomsMessage = document.createElement("p");
        noMushroomsMessage.classList.add("empty-mushrooms");
        noMushroomsMessage.textContent = "Inga svampar sparade.";
        mushroomCards.appendChild(noMushroomsMessage);
    }
}
