// TypeScript-modeller för bloggdata. bloggen.ts dokumenterar och typkontrollerar
// datastrukturen som används i bloggen; den körbara webbläsarfilen är bloggen.js.
interface BlogComment {
  body: string;
  author: string;
  date: string;
}

interface BlogPost {
  id: string;
  title: string;
  body: string;
  author: string;
  date: string;
  comments: BlogComment[];
}

const BLOG_STORAGE_KEY: string = "svampletarnaBlogPosts";
const BLOG_USER_KEY: string = "loggedInUser";

// JSON.parse returnerar any, så kontrollera att innehållet verkligen är en lista.
function loadBlogPosts(): BlogPost[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(BLOG_STORAGE_KEY) ?? "[]");
    if (!Array.isArray(value)) return [];
    return value as BlogPost[];
  } catch {
    return [];
  }
}

function saveBlogPosts(posts: BlogPost[]): void {
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
}

function createBlogPost(title: string, body: string, author: string): BlogPost {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    body: body.trim(),
    author,
    date: new Date().toISOString(),
    comments: []
  };
}

function addBlogComment(post: BlogPost, body: string, author: string): BlogPost {
  return {
    ...post,
    comments: [
      ...post.comments,
      { body: body.trim(), author, date: new Date().toISOString() }
    ]
  };
}

// OBS: bloggen.js är den JavaScript-fil som HTML-sidan laddar.
// Om ni ändrar TypeScript-koden ska den kompileras till JavaScript.
