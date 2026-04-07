// The function used to go to the top of the page.
function scrollToTarget(element) {
  const target = document.getElementById(element);

  target.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}



// Search bar functionality.
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const searchWrapper = searchBtn?.parentElement;
// Su
searchBtn?.addEventListener("click", () => {
    searchWrapper.classList.toggle("active");
    if (searchWrapper.classList.contains("active")) searchInput.focus();
});
// Submission functionality for search input.
searchInput?.addEventListener("keypress", ({ key }) => {
    if (key !== "Enter") return;
    const query = searchInput.value.trim();
    if (query) window.location.href = `/WebPages/Html/Shop_Page.html?q=${encodeURIComponent(query)}`;
});
// Highlights the target search text on the shop page.
window.addEventListener("DOMContentLoaded", () => {
    const query = new URLSearchParams(window.location.search).get("q");
    if (!query) return;

    const lowerQuery = query.toLowerCase();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    const matches = [];
    // Collects all text nodes containing the search query, excluding certain tags.
    let node;
    while ((node = walker.nextNode())) {
        const { parentNode: parent, textContent: text } = node;
        const tag = parent.tagName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "MARK") continue;
        if (text.toLowerCase().includes(lowerQuery)) textNodes.push({ node, parent, text });
    }
    // Highlights the search query in the collected text nodes.
    for (const { node, parent, text } of textNodes) {
        const lowerText = text.toLowerCase();
        const frag = document.createDocumentFragment();
        let lastIndex = 0, index;
        // Splits the text node into parts, wrapping matches in <mark> elements.
        while ((index = lowerText.indexOf(lowerQuery, lastIndex)) !== -1) {
            if (index > lastIndex) frag.appendChild(document.createTextNode(text.slice(lastIndex, index)));
            // Creates a <mark> element for the matched text.
            const mark = Object.assign(document.createElement("mark"), {
                textContent: text.slice(index, index + lowerQuery.length)
            });
            mark.style.cssText = "background-color:blue;color:white";
            frag.appendChild(mark);
            matches.push(mark);
            lastIndex = index + lowerQuery.length;
        }
        // Appends any remaining text after the last match.
        if (lastIndex < text.length) frag.appendChild(document.createTextNode(text.slice(lastIndex)));
        parent.replaceChild(frag, node);
    }

    matches[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
});



// Shop page category filtering.
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const initialCategory = params.get('category')?.toUpperCase() || 'ALL';

    filterProducts(initialCategory);
    setActiveLink(initialCategory);
    // Adds click event listeners to category links for filtering products and updating the URL.
    document.querySelectorAll('.CategoryList h1').forEach(h1 => {
        h1.addEventListener('click', () => {
            const category = h1.textContent.trim();
            filterProducts(category);
            setActiveLink(category);

            const url = new URL(window.location);
            url.searchParams.set('category', category);
            history.pushState({}, '', url);
        });
    });
});


// Filters products based on the selected category.
function filterProducts(category) {
    document.querySelectorAll(".product").forEach(p => {
        p.style.display = category === "ALL" || p.dataset.product === category ? "" : "none";
    });
    visibleCount = PAGE_SIZE;
    updateProducts();
}
// Highlights the target search text.
function setActiveLink(category) {
    document.querySelectorAll('.CategoryList h1').forEach(h1 => {
        h1.classList.toggle('active', h1.textContent.trim() === category);
    });
}
// Open the shop page to a specific category.
function goToShop(category) {
    window.location.href = `/WebPages/Html/Shop_Page.html?category=${encodeURIComponent(category.toUpperCase())}`;
}  



// Shop filter options.
document.getElementById("sortSelect")?.addEventListener("change", (e) => {
    e.preventDefault();
    const { target } = e;
    const products = [...grid.querySelectorAll(".product")];

    const getValue = el => parseFloat(el.dataset.price) || 0;
    const getName = el => el.querySelector("h1").textContent.trim().toLowerCase();
    const getIndex = el => parseInt(el.dataset.index);

    const sorters = {
        az:     (a, b) => getName(a).localeCompare(getName(b)),
        za:     (a, b) => getName(b).localeCompare(getName(a)),
        newest: (a, b) => getIndex(a) - getIndex(b),
        oldest: (a, b) => getIndex(b) - getIndex(a),
        low:    (a, b) => getValue(a) - getValue(b),
        high:   (a, b) => getValue(b) - getValue(a),
    };

    products.sort(sorters[target.value] || (() => 0)).forEach(p => grid.appendChild(p));
    updateProducts();
});

// load more products functionality.
const PRODUCT_SIZE = 6;
let visibleCount = PRODUCT_SIZE;
let activeCategory = 'ALL';

const grid = document.querySelector(".productGrid");
const loadMoreBtn = document.querySelector(".LoadMoreButton");

function updateProducts() {
    const products = [...grid.querySelectorAll(".product")];
    const visible = products.filter(p => activeCategory === 'ALL' || p.dataset.product === activeCategory);
    const hidden = products.filter(p => activeCategory !== 'ALL' && p.dataset.product !== activeCategory);

    hidden.forEach(p => p.style.display = "none");
    visible.forEach((p, i) => p.style.display = i < visibleCount ? "" : "none");

    if (loadMoreBtn) loadMoreBtn.style.display = visibleCount >= visible.length ? "none" : "";
}

function filterProducts(category) {
    activeCategory = category;
    visibleCount = PRODUCT_SIZE;
    updateProducts();
}

loadMoreBtn?.addEventListener("click", () => {
    visibleCount = Infinity;
    updateProducts();
});

window.addEventListener("DOMContentLoaded", () => {
    updateProducts();
});