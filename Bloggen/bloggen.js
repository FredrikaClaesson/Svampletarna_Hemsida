// Bloggfunktioner. Inlägg och kommentarer sparas som JSON i localStorage.
(() => {
    // Anger vilka nycklar som används för att spara blogginlägg och inloggad användare.
    const STORAGE_KEY = "svampletarnaBlogPosts";
    const USER_KEY = "loggedInUser";
     // Hämtar HTML-element som JavaScript behöver för att hantera bloggen.
    const postsContainer = document.querySelector("#posts");
    const emptyMessage = document.querySelector("#empty-message");
    const accountMessage = document.querySelector("#account-message");
    const writeSection = document.querySelector("#write-section");
    const postForm = document.querySelector("#post-form");
    const postStatus = document.querySelector("#post-status");

    // Avbryter körningen om något av de nödvändiga HTML-elementen saknas.
    if (!postsContainer || !postForm || !emptyMessage ||
        !accountMessage || !writeSection || !postStatus) {
        return;
    }
    // Hämtar den inloggade användaren från localStorage.
    // Om ingen användare finns sparad används en tom sträng.
    let currentUser = localStorage.getItem(USER_KEY) || "";
    // Läser in tidigare sparade blogginlägg.
    let posts = readPosts();

    // Hämtar inlägg och skyddar mot felaktig data i localStorage.
    function readPosts() {
        try {
            // Hämtar sparade inlägg och omvandlar JSON-texten till JavaScript-data.
            // Om inget finns sparat används en tom lista.
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            // Kontrollerar att informationen är en lista.
            if (!Array.isArray(saved)) return [];
            // Går igenom inläggen och ser till att varje inlägg har rätt datatyper.
            return saved
                .filter(post => post && typeof post === "object")
                .map(post => ({
                    // Gör om värden till text och använder standardvärden om de saknas.
                    id: String(post.id || ""),
                    title: String(post.title || ""),
                    body: String(post.body || ""),
                    author: String(post.author || "Okänd användare"),
                    date: String(post.date || ""),
                    // Kontrollerar att kommentarer är en lista och behandlar dem på samma sätt.
                    comments: Array.isArray(post.comments)
                        ? post.comments
                            .filter(comment => comment && typeof comment === "object")
                            .map(comment => ({
                                body: String(comment.body || ""),
                                author: String(comment.author || "Okänd användare"),
                                date: String(comment.date || "")
                            }))
                        : []
                }));
        } catch (error) {
            // Skriver ett felmeddelande i konsolen om informationen inte kan läsas.
            console.error("Kunde inte läsa blogginläggen:", error);
            return [];
        }
    }

    // Sparar alla inlägg och kommentarer.
    function savePosts() {
        try {
            // Omvandlar listan till JSON-text och sparar den i webbläsaren.
            localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
        } catch (error) {
            // Hanterar fel som kan uppstå när informationen inte går att spara.
            console.error("Kunde inte spara blogginläggen:", error);
            postStatus.textContent = "Inlägget kunde inte sparas i webbläsaren.";
        }
    }

    // Skapar ett HTML-element och lägger till text på ett säkert sätt.
    function makeElement(tag, text, className) {
        // Skapar ett nytt HTML-element av den angivna typen.
        const element = document.createElement(tag);
        // Lägger till text om ett textvärde har skickats in.
        if (text !== undefined) {
            element.textContent = text;
        }
        // Lägger till ett klassnamn om ett sådant har angetts.
        if (className) {
            element.className = className;
        }
        // Skickar tillbaka det färdiga HTML-elementet.
        return element;
    }

    // Formaterar datum enligt svensk standard.
    function formatDate(dateString) {
        // Omvandlar datumtexten till ett JavaScript-datum.
        const date = new Date(dateString);
        // Kontrollerar om datumet är ogiltigt.
        if (Number.isNaN(date.getTime())) {
            return "Okänt datum";
        }
        // Formaterar datumet enligt svensk standard med ett utskrivet månadsnamn.
        return new Intl.DateTimeFormat("sv-SE", {
            dateStyle: "long"
        }).format(date);
    }

    // Uppdaterar meddelandet och formuläret efter inloggningsstatus.
    function updateAccount() {
        // Hämtar den senaste informationen om inloggad användare.
        currentUser = localStorage.getItem(USER_KEY) || "";
         // Kontrollerar om det finns en inloggad användare.
        const signedIn = currentUser.length > 0;
        // Visar olika meddelanden beroende på om användaren är inloggad.
        accountMessage.textContent = signedIn
            ? `Du är inloggad som ${currentUser}. Du kan skriva inlägg och kommentera.`
            : "Du läser bloggen som besökare. Logga in för att skriva inlägg och kommentera.";
        // Döljer skrivsektionen när användaren inte är inloggad.
        writeSection.hidden = !signedIn;
        // Uppdaterar visningen av blogginläggen.
        renderPosts();
    }

    // Visar blogginlägg och tillhörande kommentarer.
    function renderPosts() {
        // Tar bort det tidigare innehållet innan inläggen visas på nytt.
        postsContainer.replaceChildren();
        // Visar meddelandet om att det saknas inlägg när listan är tom.
        emptyMessage.hidden = posts.length > 0;
        // Skapar en kopia av listan och sorterar inläggen med nyast datum först.
        [...posts]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .forEach(post => {
                // Skapar ett article-element för blogginlägget.
                const article = makeElement("article", undefined, "post");
                // Skapar inläggets rubrik, författare, datum och brödtext.
                const heading = makeElement("h3", post.title);
                const meta = makeElement(
                    "p",
                    `Av ${post.author} · ${formatDate(post.date)}`,
                    "post-meta"
                );
                const content = makeElement("p", post.body, "post-content");
                // Lägger till rubrik, information och text i blogginlägget.
                article.append(heading, meta, content);
                // Skapar en sektion för inläggets kommentarer.
                const commentsSection = makeElement("section", undefined, "comments");
                // Anger vilken rubrik som beskriver kommentarsektionen för skärmläsare.
                commentsSection.setAttribute(
                    "aria-label",
                    `Kommentarer till ${post.title}`
                );
                // Visar rubriken och antalet kommentarer.
                commentsSection.append(
                    makeElement("h4", `Kommentarer (${post.comments.length})`)
                );
                 // Går igenom kommentarerna och visar text, författare och datum.
                post.comments.forEach(comment => {
                    // Skapar ett article-element för varje kommentar.
                    const commentBlock = makeElement("article", undefined, "comment");
                    // Lägger till kommentarens text och information om författaren.
                    commentBlock.append(
                        makeElement("p", comment.body),
                        makeElement(
                            "p",
                            `Av ${comment.author} · ${formatDate(comment.date)}`,
                            "post-meta"
                        )
                    );
                    // Lägger till kommentaren i kommentarsektionen.
                    commentsSection.appendChild(commentBlock);
                });
                // Visar ett kommentarsformulär om en användare är inloggad.
                if (currentUser) {
                    // Skapar formuläret, en etikett och ett textfält.
                    const form = makeElement("form", undefined, "comment-form");
                    const label = makeElement("label", "Skriv en kommentar");
                    const textarea = makeElement("textarea");
                    // Ställer in textfältets namn, storlek och teckenbegränsning.
                    textarea.name = "comment";
                    textarea.rows = 2;
                    textarea.maxLength = 1000;
                    // Gör det obligatoriskt att skriva en kommentar.
                    textarea.required = true;
                    // Beskriver textfältets syfte för hjälpmedel som skärmläsare.
                    textarea.setAttribute("aria-label", `Kommentar till ${post.title}`);
                    // Kopplar ihop etiketten med textfältet.
                    label.appendChild(textarea);
                    // Skapar knappen som skickar kommentaren.
                    const button = makeElement("button", "Kommentera");
                    button.type = "submit";
                    // Lägger till etiketten och knappen i formuläret.
                    form.append(label, button);
                    // Körs när användaren skickar in en kommentar.
                    form.addEventListener("submit", event => {
                        // Förhindrar att formuläret laddar om sidan.
                        event.preventDefault();

                        // Kontrollera aktuell inloggning igen innan kommentaren sparas.
                        currentUser = localStorage.getItem(USER_KEY) || "";
                        // Uppdaterar medlemsstatus om användaren har loggats ut.
                        if (!currentUser) {
                            updateAccount();
                            return;
                        }
                        // Hämtar kommentaren och tar bort onödiga blanksteg i början och slutet.
                        const body = textarea.value.trim();
                        // Avbryter om kommentaren är tom.
                        if (!body) return;
                        // Lägger till den nya kommentaren med text, författare och aktuellt datum.
                        post.comments.push({
                            body,
                            author: currentUser,
                            date: new Date().toISOString()
                        });
                        // Sparar ändringarna och uppdaterar visningen av inläggen.
                        savePosts();
                        renderPosts();
                    });
                    // Lägger till kommentarsformuläret i kommentarsektionen.
                    commentsSection.appendChild(form);
                } else {
                    // Visar ett meddelande för besökare som inte är inloggade.
                    commentsSection.append(
                        makeElement("p", "Logga in för att kommentera.", "post-meta")
                    );
                }
                // Lägger till kommentarsektionen i blogginlägget.
                article.appendChild(commentsSection);
                // Lägger till det färdiga blogginlägget på sidan.
                postsContainer.appendChild(article);
            });
    }

    // Hanterar formuläret för att publicera ett nytt inlägg.
    postForm.addEventListener("submit", event => {
        // Förhindrar att formuläret laddar om sidan när det skickas.
        event.preventDefault();
        // Kontrollerar den aktuella inloggningsstatusen.
        currentUser = localStorage.getItem(USER_KEY) || "";
        // Stoppar publiceringen om användaren inte är inloggad.
        if (!currentUser) {
            postStatus.textContent = "Du behöver logga in innan du kan publicera.";
            // Uppdaterar meddelandet och döljer skrivsektionen.
            updateAccount();
            return;
        }
        // Hämtar rubrik och brödtext från formuläret och tar bort onödiga blanksteg.
        const title = postForm.elements.title.value.trim();
        const body = postForm.elements.body.value.trim();
        // Kontrollerar att både rubrik och text har fyllts i.
        if (!title || !body) {
            postStatus.textContent = "Fyll i både rubrik och text.";
            return;
        }
        // Skapar ett nytt blogginlägg med ett unikt ID, innehåll och datum.
        posts.push({
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            title,
            body,
            author: currentUser,
            date: new Date().toISOString(),
            comments: []
        });
        // Sparar inlägget och återställer formuläret.
        savePosts();
        postForm.reset();
        // Visar ett meddelande om att inlägget har publicerats.
        postStatus.textContent = "Ditt inlägg har publicerats.";
        // Uppdaterar listan så att det nya inlägget visas.
        renderPosts();
        // Flyttar fokus till rubriken för inläggslistan, exempelvis för tangentbordsanvändare.
        document.querySelector("#posts-title")?.focus();
    });

    // Uppdaterar sidan om inloggning eller blogginlägg ändras i en annan flik.
    window.addEventListener("storage", event => {
        // Uppdaterar medlemsstatus om användaruppgifterna ändras eller all lagring rensas.
        if (event.key === USER_KEY || event.key === null) {
            updateAccount();
        }
        // Läser in och visar blogginläggen på nytt om de ändras eller all lagring rensas.
        if (event.key === STORAGE_KEY || event.key === null) {
            posts = readPosts();
            renderPosts();
        }
    });
    // Körs när skriptet startar för att visa rätt medlemsstatus och blogginlägg.
    updateAccount();
})();