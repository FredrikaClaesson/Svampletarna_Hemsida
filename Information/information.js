let articleSectionRef;

// Startar informationssidan när HTML-koden har laddats.
function init() {
    articleSectionRef = document.getElementById("articles");
    fetchProducts();
}
window.addEventListener("DOMContentLoaded", init);

// Hämtar data från JSON-filen med svamparnas särskiljande egenskaper.
async function fetchProducts() {
    try {
        const response = await fetch("../JSON/speciellaEgenskaper.json");

        if (!response.ok) {
            throw new Error("Någonting gick fel vid hämtningen.");
        }

        const data = await response.json();
        createArticles(data);
    } catch (error) {
        console.error("Fel vid hämtning av information:", error);

        if (articleSectionRef) {
            articleSectionRef.textContent =
                "Informationen kunde inte laddas. Försök igen senare.";
        }
    }
}

// Konstanter för att särskilja risknivåerna.
const deadly = "Dödligt";
const lowDanger = "Låg";
const poisonous = "Giftig";
const inedible = "Oätlig";

// Skapar artiklarna från JSON-data.
function createArticles(data) {
    if (!articleSectionRef || !data ||
        !Array.isArray(data.särskiljande_egenskaper)) {
        console.error("JSON-filen innehåller inte förväntade egenskaper.");
        return;
    }

    data.särskiljande_egenskaper.forEach(article => {
        const articleElement = document.createElement("article");
        const heading = createElement("h2", article.par);
        const riskText = createElement("p", article.risk);

        articleElement.append(heading, riskText);

        let dangerType;

        if (article.risk.includes(deadly)) {
            dangerType = dangerRating(deadly);
        } else if (article.risk.includes(lowDanger) ||
                   article.risk.includes(inedible)) {
            dangerType = dangerRating(lowDanger);
        } else {
            dangerType = dangerRating(poisonous);
        }

        articleElement.appendChild(dangerType);

        // Visar särskiljande egenskaper som en lista när datan är en array.
        if (Array.isArray(article.särskiljande)) {
            const detailsList = document.createElement("ul");

            article.särskiljande.forEach(detail => {
                const listItem = createElement("li", detail);
                detailsList.appendChild(listItem);
            });

            articleElement.appendChild(detailsList);
        } else {
            articleElement.appendChild(createElement("p", article.särskiljande));
        }

        articleSectionRef.appendChild(articleElement);
    });
}

// Funktion för att skapa textelement.
function createElement(elementType, mushroomContent) {
    const element = document.createElement(elementType);
    element.textContent = mushroomContent ?? "";
    return element;
}

// Skapar varningsrutor för olika risknivåer.
function dangerRating(dangerType) {
    const mushWarning = document.createElement("div");
    const icon = document.createElement("i");
    const danger = document.createElement("p");

    icon.setAttribute("aria-hidden", "true");

    if (dangerType === deadly) {
        icon.className = "fa-solid fa-skull-crossbones";
        danger.textContent = "DÖDLIG!";
        mushWarning.className = "deadly";
    } else if (dangerType === lowDanger || dangerType === inedible) {
        icon.className = "fa-solid fa-circle-exclamation";
        danger.textContent = "OBS!";
        mushWarning.className = "lowDanger";
    } else {
        icon.className = "fa-solid fa-triangle-exclamation";
        danger.textContent = "GIFTIG!";
        mushWarning.className = "poisonous";
    }

    mushWarning.append(icon, danger);
    return mushWarning;
}
