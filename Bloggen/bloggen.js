// Bloggfunktioner. Inlägg och kommentarer sparas som JSON i localStorage.
(() => {
  const STORAGE_KEY = "svampletarnaBlogPosts";
  const USER_KEY = "loggedInUser";
  const postsContainer = document.querySelector("#posts");
  const emptyMessage = document.querySelector("#empty-message");
  const accountMessage = document.querySelector("#account-message");
  const writeSection = document.querySelector("#write-section");
  const postForm = document.querySelector("#post-form");
  const postStatus = document.querySelector("#post-status");
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#site-menu");

  if (!postsContainer || !postForm) return;

  let currentUser = localStorage.getItem(USER_KEY) || "";
  let posts = readPosts();

  function readPosts() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  function savePosts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }

  function makeElement(tag, text, className) {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Okänt datum";
    return new Intl.DateTimeFormat("sv-SE", { dateStyle: "long" }).format(date);
  }

  function updateAccount() {
    currentUser = localStorage.getItem(USER_KEY) || "";
    const signedIn = currentUser.length > 0;
    accountMessage.textContent = signedIn
      ? `Du är inloggad som ${currentUser}. Du kan skriva inlägg och kommentera.`
      : "Du läser bloggen som besökare. Logga in för att skriva inlägg och kommentera.";
    writeSection.hidden = !signedIn;
    renderPosts();
  }

  function renderPosts() {
    postsContainer.replaceChildren();
    emptyMessage.hidden = posts.length > 0;

    [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .forEach((post) => {
        const article = makeElement("article", undefined, "post");
        const heading = makeElement("h3", post.title);
        const meta = makeElement("p", `Av ${post.author} · ${formatDate(post.date)}`, "post-meta");
        const content = makeElement("p", post.body, "post-content");
        article.append(heading, meta, content);

        const commentsSection = makeElement("section", undefined, "comments");
        commentsSection.setAttribute("aria-label", `Kommentarer till ${post.title}`);
        commentsSection.append(makeElement("h4", `Kommentarer (${post.comments.length})`));

        post.comments.forEach((comment) => {
          const commentBlock = makeElement("article", undefined, "comment");
          commentBlock.append(
            makeElement("p", comment.body),
            makeElement("p", `Av ${comment.author} · ${formatDate(comment.date)}`, "post-meta")
          );
          commentsSection.append(commentBlock);
        });

        if (currentUser) {
          const form = makeElement("form", undefined, "comment-form");
          const label = makeElement("label", "Skriv en kommentar");
          const textarea = makeElement("textarea");
          textarea.name = "comment";
          textarea.rows = 2;
          textarea.maxLength = 1000;
          textarea.required = true;
          label.append(textarea);
          const button = makeElement("button", "Kommentera");
          button.type = "submit";
          form.append(label, button);
          form.addEventListener("submit", (event) => {
            event.preventDefault();
            const body = textarea.value.trim();
            if (!body) return;
            post.comments.push({ body, author: currentUser, date: new Date().toISOString() });
            savePosts();
            renderPosts();
          });
          commentsSection.append(form);
        } else {
          commentsSection.append(makeElement("p", "Logga in för att kommentera.", "post-meta"));
        }

        article.append(commentsSection);
        postsContainer.append(article);
      });
  }

  postForm.addEventListener("submit", (event) => {
    event.preventDefault();
    currentUser = localStorage.getItem(USER_KEY) || "";
    if (!currentUser) {
      postStatus.textContent = "Du behöver logga in innan du kan publicera.";
      updateAccount();
      return;
    }

    const title = postForm.elements.title.value.trim();
    const body = postForm.elements.body.value.trim();
    if (!title || !body) {
      postStatus.textContent = "Fyll i både rubrik och text.";
      return;
    }

    posts.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      body,
      author: currentUser,
      date: new Date().toISOString(),
      comments: []
    });
    savePosts();
    postForm.reset();
    postStatus.textContent = "Ditt inlägg har publicerats.";
    renderPosts();
    document.querySelector("#posts-title").focus?.();
  });

  if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menu.classList.toggle("is-open", !isOpen);
      if (!isOpen) menu.querySelector("a")?.focus();
    });
    menu.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.focus();
      }
    });
    menu.addEventListener("click", (event) => {
      if (event.target.closest("a") && window.matchMedia("(max-width: 767px)").matches) {
        menu.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  window.addEventListener("storage", (event) => {
    if (event.key === USER_KEY) updateAccount();
    if (event.key === STORAGE_KEY) {
      posts = readPosts();
      renderPosts();
    }
  });

  updateAccount();
})();