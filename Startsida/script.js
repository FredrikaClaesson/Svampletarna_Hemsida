const svamparContainer = document.getElementById("svamp-section");

// Hämtar svampdata från JSON-filen.
async function fetchDataFromJson() {
    try {
        const response = await fetch("../JSON/svampar.json");

        if (!response.ok) {
            throw new Error("Kunde inte hämta svampdata.");
        }

        return await response.json();
    } catch (error) {
        console.error("Fel vid hämtning av svampdata:", error);
        return null;
    }
}

// Funktion för att korta ner texten som visas i korten.
function getEatable(text = "") {
    return text.split("–")[0].trim();
}

// Funktion för att korta ner fyndplatsen till kommunens namn.
function getKommun(fyndplats = "") {
    return fyndplats.split(",")[0].trim();
}

// Hämtar listan över sparade svampar från localStorage.
function getSavedMushrooms() {
    try {
        const savedMushrooms = JSON.parse(localStorage.getItem("mushroom") || "[]");
        return Array.isArray(savedMushrooms) ? savedMushrooms : [];
    } catch (error) {
        console.error("Kunde inte läsa sparade svampar:", error);
        return [];
    }
}

// Kontrollerar om svampen redan finns i listan.
function checkLocalStorage(svamp) {
    const mushroomList = getSavedMushrooms();
    return !mushroomList.some(mushroom =>
        mushroom.svenskt_namn === svamp.svenskt_namn
    );
}

// Skapar objektet som sparas i localStorage.
function buildMushroomObject(sName, lName, imageFilename) {
    return {
        svenskt_namn: sName,
        latinskt_namn: lName,
        bild: imageFilename
    };
}

// Skapar ett svampkort utan att lägga JSON-text direkt i HTML.
function createArticle(svamp) {
    const article = document.createElement("article");
    article.classList.add("svamp");

    const image = document.createElement("img");
    image.src = `../svampar/${svamp.bild}`;
    image.alt = svamp.svenskt_namn;
    image.dataset.filename = svamp.bild;

    const info = document.createElement("div");
    info.classList.add("svamp-info");

    const heading = document.createElement("h3");
    heading.textContent = svamp.svenskt_namn;

    const latinName = document.createElement("p");
    const latinText = document.createElement("em");
    latinText.textContent = svamp.latinskt_namn;
    latinName.appendChild(latinText);

    const edibility = document.createElement("p");
    edibility.classList.add("edibility");
    edibility.textContent = getEatable(svamp["ätlig"]);

    const location = document.createElement("p");
    const locationLabel = document.createElement("strong");
    locationLabel.textContent = "Fyndplats: ";
    location.append(locationLabel, document.createTextNode(getKommun(svamp.fyndplats)));

    const saveButton = document.createElement("button");
    if (checkLocalStorage(svamp)) {
        saveButton.classList.add("svampButton");
        saveButton.type = "button";
        saveButton.textContent = "Spara till mina svampar";
    } else {
        saveButton.type = "button";
        saveButton.disabled = true;
        saveButton.textContent = "Redan sparad";
    }

    info.append(heading, latinName, edibility, location, saveButton);
    article.append(image, info);
    return article;
}

// Markerar ätliga och giftiga svampar med olika färger.
function highlightEatable() {
    document.querySelectorAll(".edibility").forEach(paragraph => {
        const text = paragraph.textContent.toLowerCase();

        if (text.includes("ätlig")) {
            paragraph.classList.add("highlight-green");
        } else if (text.includes("giftig") || text.includes("oätlig")) {
            paragraph.classList.add("highlight-red");
        }
    });
}

// Sparar en svamp i localStorage.
function saveMushroom(mushroom) {
    const mushroomList = getSavedMushrooms();

    if (mushroomList.some(item => item.svenskt_namn === mushroom.svenskt_namn)) {
        return;
    }

    mushroomList.push(mushroom);
    localStorage.setItem("mushroom", JSON.stringify(mushroomList));
}

// Hämtar informationen från kortet vars knapp klickades.
function searchArticles(button) {
    const article = button.closest("article.svamp");
    if (!article) return null;

    const svensktNamn = article.querySelector("h3");
    const latinsktNamn = article.querySelector("p em");
    const image = article.querySelector("img");

    if (!svensktNamn || !latinsktNamn || !image) return null;

    return buildMushroomObject(
        svensktNamn.textContent,
        latinsktNamn.textContent,
        image.dataset.filename
    );
}

// Visar svamparna på startsidan.
async function init() {
    if (!svamparContainer) return;

    const data = await fetchDataFromJson();

    if (!data || !Array.isArray(data.svampar)) {
        svamparContainer.textContent = "Svamparna kunde inte laddas. Försök igen senare.";
        return;
    }

    function renderMushrooms() {
        svamparContainer.replaceChildren();

        data.svampar.forEach(svamp => {
            svamparContainer.appendChild(createArticle(svamp));
        });

        highlightEatable();
    }

    renderMushrooms();

    // Hanterar klick på knapparna för att spara svampar.
    svamparContainer.addEventListener("click", event => {
        if (!event.target.classList.contains("svampButton")) return;

        const mushroom = searchArticles(event.target);
        if (!mushroom) return;

        saveMushroom(mushroom);
        renderMushrooms();
    });
}

init();
