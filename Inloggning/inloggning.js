// Rätt användarnamn och lösenord (enligt instruktioner)
const correctUsername = "Kalle";
const correctPassword = "qwe123";

// Hämtar element från min HTML kod
const loginForm = document.querySelector("#login-form");
const loginSection = document.querySelector("#login-section");
const loggedInSection = document.querySelector("#logged-in-section");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const errorMessage = document.querySelector("#error-message");
const welcomeMessage = document.querySelector("#welcome-message");
const logoutButton = document.querySelector("#logout-button");

// Visar sidan för en inloggad användare
function showLoggedIn(username) {
    // Synlig när användaren ej är inloggad
    loginSection.hidden = true;
    // Synlig när användaren är inloggad
    loggedInSection.hidden = false;
    // Skriver ut välkomstmeddelande med användarnamn till den inloggade (enligt instruktioner)
    welcomeMessage.textContent =
        `Välkommen ${username}, du är nu inloggad`;
}

// Visar inloggningsformuläret
function showLogin() {
    // Synlig när användaren ej är inloggad
    loginSection.hidden = false;
    // Synlig när användaren är inloggad
    loggedInSection.hidden = true;
    // Återställer formuläret dvs innehållet i fälten Användarnamn och Lösenord töms
    loginForm.reset();
    // Tömmer det gamla felmeddelandet när användaren ska försöka logga in på nytt
    errorMessage.textContent = "";
}

// Körs när användaren försöker logga in
loginForm.addEventListener("submit", function (event) {
    // Förhindrar att sidan laddas om så att mitt felmeddelande kan visas
    event.preventDefault();

    // Hämtar det som användaren har skrivit i Användarnamn och Lösenord
    const enteredUsername = usernameInput.value;
    const enteredPassword = passwordInput.value;

    // Kontrollerar inskrivet användarnamn och lösenord
    if (
        enteredUsername === correctUsername &&
        enteredPassword === correctPassword
    ) {
        // Sparar den inloggade användaren i localStorage
        localStorage.setItem("loggedInUser", enteredUsername);
        showLoggedIn(enteredUsername);
    } else {
        // Visar felmeddelande: Felaktiga inloggningsuppgifter
        errorMessage.textContent = "Felaktiga inloggningsuppgifter";
        // Tömmer användarnamnsfältet
       usernameInput.value = "";
        // Tömmer lösenordsfältet
        passwordInput.value = "";
    }
});

// Körs när användaren klickar på Logga ut
logoutButton.addEventListener("click", function () {
    // Tar bort den sparade användaren från localStorage
    localStorage.removeItem("loggedInUser");
    // Visar inloggningsformuläret igen
    showLogin();
});
// Hämtar en eventuell sparad användare från localStorage
const savedUser = localStorage.getItem("loggedInUser");

// Om det finns en sparad användare visas den inloggade sidan (om webbsidan stängs ner och återtas)
if (savedUser) {
    showLoggedIn(savedUser);
}