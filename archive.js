/*
  Archive Thoughts page
  ----------------------------------------------------------------
  Reads every .md file inside the /quotes folder of this repo
  (via the public GitHub Contents API) and renders one card per
  file, showing ONLY the quote text — no author, tags, or links.

  To add a new post: create a new .md file inside /quotes with the
  quote text as its only content, commit it, done. See
  quotes/README.md for the exact steps.
*/

const REPO = "saudsync/irl";
const BRANCH = "main";
const QUOTES_PATH = "quotes";

function stripFrontmatterAndHeadings(raw) {
  let text = raw.replace(/\r\n/g, "\n").trim();

  // strip a leading YAML frontmatter block if someone adds one
  if (text.startsWith("---")) {
    const end = text.indexOf("\n---", 3);
    if (end !== -1) {
      text = text.slice(end + 4).trim();
    }
  }

  // strip a single leading markdown heading line (e.g. "# Title")
  text = text.replace(/^#{1,6}\s.*\n+/, "");

  return text.trim();
}

function renderQuoteCard(text) {
  const card = document.createElement("div");
  card.className = "quote-card";

  const mark = document.createElement("span");
  mark.className = "quote-mark";
  mark.textContent = "\u201C";
  mark.setAttribute("aria-hidden", "true");

  const body = document.createElement("p");
  body.className = "quote-text";
  body.textContent = text;

  card.appendChild(mark);
  card.appendChild(body);
  return card;
}

async function loadQuotes() {
  const listEl = document.getElementById("quote-list");
  const statusEl = document.getElementById("archive-status");

  try {
    const apiUrl = `https://api.github.com/repos/${REPO}/contents/${QUOTES_PATH}?ref=${BRANCH}`;
    const res = await fetch(apiUrl, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!res.ok) {
      throw new Error(`GitHub API responded with ${res.status}`);
    }

    const files = await res.json();

    const mdFiles = files
      .filter(
        (f) =>
          f.type === "file" &&
          f.name.toLowerCase().endsWith(".md") &&
          f.name.toLowerCase() !== "readme.md"
      )
      // date-prefixed filenames sort newest-first this way
      .sort((a, b) => b.name.localeCompare(a.name));

    if (mdFiles.length === 0) {
      statusEl.textContent = "No thoughts posted yet — check back soon.";
      return;
    }

    const contents = await Promise.all(
      mdFiles.map((f) =>
        fetch(f.download_url)
          .then((r) => (r.ok ? r.text() : ""))
          .catch(() => "")
      )
    );

    statusEl.remove();

    contents.forEach((raw) => {
      const text = stripFrontmatterAndHeadings(raw);
      if (!text) return;
      listEl.appendChild(renderQuoteCard(text));
    });
  } catch (err) {
    console.error("Failed to load archive:", err);
    statusEl.textContent =
      "Couldn't load the archive right now — please refresh in a bit.";
  }
}

loadQuotes();
