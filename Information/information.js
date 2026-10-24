let articleSectionRef

function init(){
    articleSectionRef = document.getElementById("articles"); // Hämta data från element med id "articles" //
    fetchProducts(); // Kör vår funktion för att hämta JSON-data //
}
window.onload = init;

// Async funktion för att hämta data från vårt json-dokument //
async function fetchProducts(){
    try{
        const response = await fetch("../JSON/speciellaEgenskaper.json"); // Vi väntar på att få respons data från produkter.json  //

        if (!response.ok){ // OM nåt går fel när vi hämtar respons datan så säg att nåt gick fel och hoppa till catch //
            throw new Error("Någonting gick fel vid hämtningen");
        }
        
        const data = await response.json(); // Vänta på att göra om respons datan till JS-format vi kan använda oss av. //
        createArticles(data);
    }
    catch(error){
        console.error("Fel:", error); // Ge oss error data så vi kan felsöka //
    }
}

// Konstanter för att särskilja om svampar är dödliga, giftiga, oätliga eller ingen större risk //
const deadly = "Dödligt";
const lowDanger = "Låg";
const poisonus = "Giftig";
const inedible = "Oätlig";

// Funktion för att skapa våra artiklar //
function createArticles(data){
    data.särskiljande_egenskaper.forEach(article => { // FÖR VARJE produkt i vårt json dokument kör funktion med produkt array som bas //
        const articleElement = document.createElement("article");
        let dangerType;

        let element = createElement("h2", article.par); 
        articleElement.appendChild(element); 
        element = createElement("p", article.risk);
        articleElement.appendChild(element);

        if (article.risk.includes(deadly)){
        dangerType = dangerRating(deadly);
        articleElement.appendChild(dangerType);
        }
        
        else if (article.risk.includes(lowDanger) || article.risk.includes(inedible)){
            dangerType = dangerRating(lowDanger);
            articleElement.appendChild(dangerType);
        }

        else{
            dangerType = dangerRating(poisonus);
            articleElement.appendChild(dangerType);
        }

        element = createElement("p", article.särskiljande);
        articleElement.appendChild(element);

        articleSectionRef.appendChild(articleElement);
    });
}

// Funktion för att skapa våra element inuti artiklarna //
function createElement(elementType, mushroomContent){
    const element = document.createElement(elementType); 
    element.textContent = mushroomContent;
    return element;
}

// Funktion för att skapa olika divs för varningsrutor //
function dangerRating(dangerType){
    const mushWarning = document.createElement("div");
    const icon = document.createElement("i");
    const danger = document.createElement("p");

    if (dangerType == deadly){
        icon.className = "fa-solid fa-skull-crossbones";
        danger.textContent = "DÖDLIG!";
        mushWarning.className = "deadly";

        mushWarning.appendChild(icon);
        mushWarning.appendChild(danger);
    }

    else if (dangerType == lowDanger || dangerType == inedible){
        icon.className = "fa-solid fa-circle-exclamation";
        danger.textContent = "OBS!";
        mushWarning.className = "lowDanger";

        mushWarning.appendChild(icon);
        mushWarning.appendChild(danger);
    }

    else{
        icon.className = "fa-solid fa-triangle-exclamation";
        danger.textContent = "GIFTIG!";
        mushWarning.className = "poisonus";

        mushWarning.appendChild(icon);
        mushWarning.appendChild(danger);
    }

    return mushWarning;
}