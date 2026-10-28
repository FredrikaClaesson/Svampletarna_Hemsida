// GEMENSAM MOBILMENY FÖR ALLA SIDOR.



// Hämtar knappen som används för att öppna och stänga mobilmenyn.
const menuButton = document.querySelector(".menu-toggle");

// Hämtar navigeringsmenyn 
const mainMenu = document.querySelector("#huvudmeny");

// Kontrollerar att både menyknappen och menyn finns på sidan innan funktionalit läggs till.
if (menuButton && mainMenu) {

    // Hämtar det dolda textinnehållet i menyknappen.
    // Texten används för att beskriva knappens funktion för hjälpmedel.
    const menuLabel = menuButton.querySelector(".visually-hidden");

    // Funktion som stänger mobilmenyn.
    // Parametern returnFocus avgör om fokus ska flyttas tillbaka till knappen.
    function closeMenu(returnFocus = false) {

        // Tar bort klassen som visar att menyn är öppen.
        mainMenu.classList.remove("menu-open");

        // Uppdaterar knappens ARIA-attribut så att det visar att menyn är stängd.
        menuButton.setAttribute("aria-expanded", "false");

        // Ändrar knappens dolda text till "Öppna menyn".
        if (menuLabel) {
            menuLabel.textContent = "Öppna menyn";
        }

        // Om returnFocus är true flyttas tangentbordsfokus tillbaka till knappen.
        if (returnFocus) {
            menuButton.focus();
        }
    }

    // Lyssnar efter klick på menyknappen.
    menuButton.addEventListener("click", () => {

        // Kontrollerar om menyn redan är öppen.
        const isOpen = menuButton.getAttribute("aria-expanded") === "true";

        // Växlar ARIA-attributet mellan true och false.
        // String() omvandlar det booleska värdet till en textsträng.
        menuButton.setAttribute("aria-expanded", String(!isOpen));

        // Lägger till klassen "menu-open" om menyn ska öppnas och tar bort den om menyn ska stängas.
        mainMenu.classList.toggle("menu-open", !isOpen);

        // Uppdaterar den dolda knapptexten beroende på menyns tillstånd.
        if (menuLabel) {
            menuLabel.textContent = isOpen ? "Öppna menyn" : "Stäng menyn";
        }

        // Om menyn öppnas flyttas fokus till den första länken.
        // ?. gör att koden inte försöker fokusera något om länken saknas.
        if (!isOpen) {
            mainMenu.querySelector("a")?.focus();
        }
    });

    // Lyssnar efter tangenttryckningar i navigeringsmenyn.
    mainMenu.addEventListener("keydown", event => {

        // Om användaren trycker på Escape medan menyn är öppen
        // stängs menyn och fokus flyttas tillbaka till menyknappen.
        if (event.key === "Escape" && mainMenu.classList.contains("menu-open")) {
            closeMenu(true);
        }
    });

    // Lyssnar efter klick i navigeringsmenyn.
    mainMenu.addEventListener("click", event => {

        // Kontrollerar om klicket skedde på en länk eller ett element inuti en länk.
        // Kontrollerar också att skärmens bredd är högst 900 pixlar.
        if (
            event.target.closest("a") &&
            window.matchMedia("(max-width: 900px)").matches
        ) {

            // Stänger mobilmenyn när användaren klickar på en länk.
            closeMenu();
        }
    });

    // Lyssnar efter ändringar av webbläsarfönstrets storlek.
    window.addEventListener("resize", () => {

        // Kontrollerar om fönstrets bredd är större än 900 pixlar.
        if (!window.matchMedia("(max-width: 900px)").matches) {

            // Tar bort klassen som visar att mobilmenyn är öppen.
            mainMenu.classList.remove("menu-open");

            // Återställer knappens ARIA-attribut till stängt läge.
            menuButton.setAttribute("aria-expanded", "false");

            // Återställer den dolda knapptexten.
            if (menuLabel) {
                menuLabel.textContent = "Öppna menyn";
            }
        }
    });
}