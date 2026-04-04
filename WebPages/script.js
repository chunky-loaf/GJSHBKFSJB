function scrollToTarget(element) {
  const target = document.getElementById(element);

  target.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

const searchBtn = document.getElementById("searchBtn");
const searchWrapper = searchBtn?.parentElement;
const searchInput = document.getElementById("searchInput");

if (searchBtn && searchInput && searchWrapper) {
    searchBtn.addEventListener("click", () => {
        searchWrapper.classList.toggle("active");
        if (searchWrapper.classList.contains("active")) {
            searchInput.focus();
        }
    });

    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const query = searchInput.value.trim();
            if (query) window.location.href = `Shop_Page.html?q=${encodeURIComponent(query)}`;
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (!query) return;

    const lowerQuery = query.toLowerCase();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
        const parent = node.parentNode;
        if (parent.tagName === "SCRIPT" || parent.tagName === "STYLE" || parent.tagName === "MARK") continue;
        if (node.textContent.toLowerCase().includes(lowerQuery)) {
            textNodes.push(node);
        }
    }

    const matches = [];

    for (const textNode of textNodes) {
        const parent = textNode.parentNode;
        const text = textNode.textContent;
        const lowerText = text.toLowerCase();

        const frag = document.createDocumentFragment();
        let lastIndex = 0;
        let index;

        while ((index = lowerText.indexOf(lowerQuery, lastIndex)) !== -1) {
            if (index > lastIndex) frag.appendChild(document.createTextNode(text.slice(lastIndex, index)));

            const mark = document.createElement("mark");
            mark.style.backgroundColor = "blue";
            mark.style.color = "white";
            mark.textContent = text.slice(index, index + lowerQuery.length);
            frag.appendChild(mark);
            matches.push(mark);

            lastIndex = index + lowerQuery.length;
        }

        if (lastIndex < text.length) frag.appendChild(document.createTextNode(text.slice(lastIndex)));

        parent.replaceChild(frag, textNode);
    }

    if (matches.length) {
        matches[0].scrollIntoView({ behavior: "smooth", block: "center" });
    }
});