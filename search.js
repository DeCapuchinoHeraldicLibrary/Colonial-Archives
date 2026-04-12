<!-- =========================
FILE: search.js
========================= -->
const archiveIndex = [
  {
    title: "Home · Archive Overview",
    url: "index.html",
    keywords: ["home", "overview", "archive", "library", "estate", "capuchino", "chronology", "orders", "ships", "treatise"],
    excerpt: "General entrance to the Capuchino Estate Historical Library."
  },
  {
    title: "Biography · Early Life and Formation",
    url: "biography.html",
    keywords: ["biography", "early life", "formation", "1689", "barclay", "madrid mint", "wittenberg", "strasbourg", "french administration", "bourbon", "jean orry", "amelot"],
    excerpt: "Birth, education, bilingual formation, and early Bourbon service."
  },
  {
    title: "Potosí and Lima · First Atlantic Commission",
    url: "potosi.html",
    keywords: ["potosi", "lima", "san cristoforo", "coffee", "milk", "silver mines", "illness", "recovery", "jose antonio de mendoza", "potosí commission"],
    excerpt: "Atlantic voyage, near-fatal illness, colonial coffee discovery, and mining reports."
  },
  {
    title: "Maritime Enterprise · Cádiz, Company, and Seizures",
    url: "maritime.html",
    keywords: ["maritime", "cadiz", "cádiz", "franckentine-capuchino", "company", "le saint-esprit", "salvadore", "havana", "nassau", "carmen", "seizure", "combative commerce"],
    excerpt: "Withdrawal from service, company formation, Atlantic routes, and first irregular maritime actions."
  },
  {
    title: "Treatise · Estrategias fiscales del comercio combativo",
    url: "treatise.html",
    keywords: ["treatise", "book", "thesis", "estrategias fiscales del comercio combativo", "comercio combativo", "mobility", "discretion", "speed", "trade doctrine"],
    excerpt: "Capuchino’s core commercial theory and its principal themes."
  },
  {
    title: "Gallery · Ships, Estates, and Holdings",
    url: "gallery.html",
    keywords: ["gallery", "ships", "properties", "estate", "office", "routes", "andalusia", "cadiz office", "plantation", "calatrava", "orders"],
    excerpt: "Visual catalogue for portraits, vessels, estates, maps, and distinctions."
  }
];

function normalizeTerm(value) {
  return value.toLowerCase().trim();
}

function performArchiveSearch(query) {
  const q = normalizeTerm(query);
  if (!q) return [];

  return archiveIndex
    .map(entry => {
      const haystack = `${entry.title} ${entry.excerpt} ${entry.keywords.join(" ")}`.toLowerCase();
      let score = 0;
      if (entry.title.toLowerCase().includes(q)) score += 5;
      if (entry.excerpt.toLowerCase().includes(q)) score += 3;
      entry.keywords.forEach(keyword => {
        if (keyword.includes(q) || q.includes(keyword)) score += 2;
      });
      if (haystack.includes(q)) score += 1;
      return { ...entry, score };
    })
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score);
}

function renderArchiveResults(container, query) {
  const results = performArchiveSearch(query);
  if (!container) return;

  if (!query.trim()) {
    container.classList.remove("visible");
    container.innerHTML = "";
    return;
  }

  container.classList.add("visible");

  if (!results.length) {
    container.innerHTML = `<strong>No archival matches found.</strong><p>Try terms such as <em>Potosí</em>, <em>Calatrava</em>, <em>coffee</em>, <em>San Cristóforo</em>, <em>Cádiz</em>, or <em>combativo</em>.</p>`;
    return;
  }

  const items = results.map(item => `
    <li>
      <a href="${item.url}">${item.title}</a><br>
      <span>${item.excerpt}</span>
    </li>
  `).join("");

  container.innerHTML = `
    <strong>Search results for “${query}”</strong>
    <ul>${items}</ul>
  `;
}

function setupArchiveSearch() {
  const forms = document.querySelectorAll("[data-archive-search]");
  forms.forEach(form => {
    const input = form.querySelector("input[type='search']");
    const results = form.parentElement.querySelector(".search-results");
    if (!input || !results) return;

    form.addEventListener("submit", event => {
      event.preventDefault();
      renderArchiveResults(results, input.value);
    });

    input.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        input.value = "";
        renderArchiveResults(results, "");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", setupArchiveSearch);

