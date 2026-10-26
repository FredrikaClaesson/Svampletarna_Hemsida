// Tillgänglig mobilmeny: fungerar med mus, Enter, mellanslag och Escape.
const menuButton = document.querySelector('.menu-toggle');
const mainMenu = document.querySelector('#huvudmeny');
if (menuButton && mainMenu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    mainMenu.classList.toggle('menu-open', !isOpen);
    menuButton.querySelector('.visually-hidden').textContent = isOpen ? 'Öppna menyn' : 'Stäng menyn';
    if (!isOpen) mainMenu.querySelector('a').focus();
  });
  mainMenu.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mainMenu.classList.contains('menu-open')) {
      mainMenu.classList.remove('menu-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.querySelector('.visually-hidden').textContent = 'Öppna menyn';
      menuButton.focus();
    }
  });
  mainMenu.addEventListener('click', event => {
    if (event.target.closest('a') && window.matchMedia('(max-width: 900px)').matches) {
      mainMenu.classList.remove('menu-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.querySelector('.visually-hidden').textContent = 'Öppna menyn';
    }
  });
}

const svamparContainer = document.getElementById('svamp-section');

async function fetchDataFromJson() {
  try{
    const response = await fetch('../JSON/svampar.json');
    if (!response.ok) {
      throw new Error('Could not fetch data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Funktion för att korta ner texten som visas i korten
function getEatable(text) {
  return text.split("–")[0].trim();
}
// Funktion för att korta ner texten som visas i korten
function getKommun(fyndplats) {
  return fyndplats.split(",")[0].trim();
}

function createArticle(svamp) {
  const article = document.createElement('article');
  article.classList.add('svamp');
  const boolean = checkLocalStorage(svamp); // Ändra detta till true om du vill visa knappen "Spara till mina svampar"

  article.innerHTML = `
    <img src="../svampar/${svamp.bild}" alt="${svamp.svenskt_namn}">
    <div class="svamp-info">
      <h3>${svamp.svenskt_namn}</h3>
      <p><em>${svamp.latinskt_namn}</em></p>
      <p>${getEatable(svamp["ätlig"])}</p>
      <p><strong>Fyndplats:</strong> ${getKommun(svamp.fyndplats)}</p>
      ${boolean ? '<button class="svampButton">Spara till mina svampar</button>' : '<button disabled>Redan sparad</button>'}
    </div>
  `;
  return article;
}

// Funktion för att markera ätliga och giftiga svampar med olika färger
function highlightEatable(){
  const stycken = document.querySelectorAll('.svamp-info p');

  stycken.forEach(p => {
    const text = p.textContent.toLowerCase().trim();
    
    if (text.includes("ätlig")) {
      p.classList.add("eatable", "highlight-green");
    } else if (text.includes("giftig")) {
      p.classList.add("eatable", "highlight-red");
    }
  });
}

async function saveMushroom (mushroom){
    const mushroomList = JSON.parse(localStorage.getItem('mushroom')) || [];
    mushroomList.push(mushroom);
    localStorage.setItem('mushroom', JSON.stringify(mushroomList))
    const data = JSON.parse(localStorage.getItem('mushroom'));
    console.log("Mushroom saved to localStorage:", data);
    };

function buildMushroomObject(sName, lName, sBild){
    return  {
            svenskt_namn: sName,
            latinskt_namn: lName,
            bild: sBild,
        };
}

 function searchArticles(button) {
    const articles = button.closest("article.svamp");
    const svensktNamn = articles.querySelector("h3");
    const latinsktNamn = articles.querySelector("p em");
    const bild = articles.querySelector("img").getAttribute("src");
    return mushroom = buildMushroomObject(svensktNamn.textContent, latinsktNamn.textContent, bild);
    };

  function checkLocalStorage(svamp) {
        const mushroomList = JSON.parse(localStorage.getItem('mushroom')) || [];
        if (mushroomList.length > 0) {
          for (const mushroom of mushroomList) {
            if(mushroom.svenskt_namn === svamp.svenskt_namn){
              return false;
            }}
            
          }
          return true;
        }

// Initiering funktion för att köra alla funktioner som behövs för att visa svamparna på startsidan
async function init() {
  const data = await fetchDataFromJson();
  const svampar = data.svampar;
  svampar.forEach(svamp => {
    const article = createArticle(svamp);
    svamparContainer.appendChild(article);
  });
  highlightEatable();
  document.addEventListener("click", async function(event) {
    if (event.target.classList.contains("svampButton")) {
      searchArticles(event.target);
      const mushroom = searchArticles(event.target);
      await saveMushroom(mushroom);
      svamparContainer.innerHTML = "";
      svampar.forEach(svamp => {
        const article = createArticle(svamp);
        svamparContainer.appendChild(article);
      });
      highlightEatable();
    };
  });
}
init();