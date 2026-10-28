// Beskriver hur en kommentar i bloggen ska vara uppbyggd.
interface BlogComment {
  body: string;   // Innehållet i kommentaren.
  author: string; // Namnet på personen som skrev kommentaren.
  date: string;   // Datum och tid då kommentaren skapades.
}

// Beskriver hur ett blogginlägg ska vara uppbyggt.
interface BlogPost {
  id: string;              // Unikt ID som identifierar blogginlägget.
  title: string;           // Rubriken på blogginlägget.
  body: string;            // Texten i blogginlägget.
  author: string;          // Namnet på personen som skrev inlägget.
  date: string;            // Datum och tid då inlägget skapades.
  comments: BlogComment[]; // En lista med kommentarer till inlägget.
}

// Anger nyckeln som används för att spara blogginlägg i localStorage.
// Typen string betyder att värdet är en textsträng.
const BLOG_STORAGE_KEY: string = "svampletarnaBlogPosts";

// Anger nyckeln som används för att hämta den inloggade användaren från localStorage.
const BLOG_USER_KEY: string = "loggedInUser";

// Hämtar sparade blogginlägg från localStorage.
// Funktionen returnerar en lista med blogginlägg av typen BlogPost.
function loadBlogPosts(): BlogPost[] {
  try {
    // Hämtar sparad data och omvandlar JSON-texten till JavaScript-data.
    // unknown innebär att datatypen inte är kontrollerad ännu.
    // Om inget finns sparat används en tom lista.
    const value: unknown = JSON.parse(localStorage.getItem(BLOG_STORAGE_KEY) ?? "[]");

    // Kontrollerar att den hämtade informationen verkligen är en lista.
    // Om det inte är en lista returneras en tom lista.
    if (!Array.isArray(value)) return [];

    // Anger att värdet ska behandlas som en lista med blogginlägg.
    return value as BlogPost[];
  } catch {
    // Returnerar en tom lista om något går fel vid hämtning eller JSON-tolkning.
    return [];
  }
}

// Sparar en lista med blogginlägg i localStorage.
// void betyder att funktionen inte returnerar något värde.
function saveBlogPosts(posts: BlogPost[]): void {
  // Omvandlar blogginläggen till JSON-text och sparar dem i webbläsaren.
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
}

// Skapar ett nytt blogginlägg med rubrik, text och författare.
// Funktionen returnerar det nya inlägget som ett BlogPost-objekt.
function createBlogPost(title: string, body: string, author: string): BlogPost {
  return {
    // Skapar ett unikt ID för blogginlägget.
    id: crypto.randomUUID(),

    // Tar bort onödiga blanksteg i början och slutet av rubriken.
    title: title.trim(),

    // Tar bort onödiga blanksteg i början och slutet av inläggstexten.
    body: body.trim(),

    // Sparar namnet på personen som skrev inlägget.
    author,

    // Hämtar aktuellt datum och tid i ISO-format.
    date: new Date().toISOString(),

    // Börjar med en tom lista eftersom inlägget ännu inte har några kommentarer.
    comments: []
  };
}

// Lägger till en kommentar till ett befintligt blogginlägg.
// Funktionen returnerar ett nytt BlogPost-objekt med den nya kommentaren.
function addBlogComment(post: BlogPost, body: string, author: string): BlogPost {
  return {
    // Kopierar alla befintliga egenskaper från blogginlägget.
    ...post,

    // Skapar en ny lista med kommentarer.
    comments: [
      // Kopierar alla kommentarer som redan finns.
      ...post.comments,

      // Lägger till den nya kommentaren med text, författare och aktuellt datum.
      { body: body.trim(), author, date: new Date().toISOString() }
    ]
  };
}