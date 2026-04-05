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

window.addEventListener("DOMContentLoaded", () => {
    const query = new URLSearchParams(window.location.search).get("q");
    if (!query) return;

    const lowerQuery = query.toLowerCase();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    const matches = [];

    let node;
    while ((node = walker.nextNode())) {
        const { parentNode: parent, textContent: text } = node;
        const tag = parent.tagName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "MARK") continue;
        if (text.toLowerCase().includes(lowerQuery)) textNodes.push({ node, parent, text });
    }

    for (const { node, parent, text } of textNodes) {
        const lowerText = text.toLowerCase();
        const frag = document.createDocumentFragment();
        let lastIndex = 0, index;

        while ((index = lowerText.indexOf(lowerQuery, lastIndex)) !== -1) {
            if (index > lastIndex) frag.appendChild(document.createTextNode(text.slice(lastIndex, index)));

            const mark = Object.assign(document.createElement("mark"), {
                textContent: text.slice(index, index + lowerQuery.length)
            });
            mark.style.cssText = "background-color:blue;color:white";
            frag.appendChild(mark);
            matches.push(mark);
            lastIndex = index + lowerQuery.length;
        }

        if (lastIndex < text.length) frag.appendChild(document.createTextNode(text.slice(lastIndex)));
        parent.replaceChild(frag, node);
    }

    matches[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
});


document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const initialCategory = params.get('category')?.toUpperCase() || 'ALL';

    filterProducts(initialCategory);
    setActiveLink(initialCategory);
    
    document.querySelectorAll('.CategoryList a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.querySelector('h1').textContent.trim();
            filterProducts(category);
            setActiveLink(category);

            const url = new URL(window.location);
            url.searchParams.set('category', category);
            history.pushState({}, '', url);
        });
    });
});

function filterProducts(category) {
    document.querySelectorAll('.product').forEach(product => {
        const match = category === 'ALL' || product.dataset.product === category;
        product.style.display = match ? '' : 'none';
    });
}

function setActiveLink(category) {
    document.querySelectorAll('.CategoryList a').forEach(link => {
        const isActive = link.querySelector('h1').textContent.trim() === category;
        link.classList.toggle('active', isActive);
    });
}

function goToShop(category) {
    window.location.href = `/WebPages/Html/Shop_Page.html?category=${encodeURIComponent(category.toUpperCase())}`;
}   