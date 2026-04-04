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

if(searchBtn && searchInput && searchWrapper) {
    searchBtn.addEventListener("click", () => {
        searchWrapper.classList.toggle("active");
    });

    searchInput.addEventListener("keypress", (e) => {
        if(e.key === "Enter") {
            const query = searchInput.value.trim();
            if(query) window.location.href = `Shop_Page.html?q=${encodeURIComponent(query)}`;
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    if(!window.location.search) return; 

    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if(!query) return;

    const lowerQuery = query.toLowerCase();

    function highlightText(node, text) {
        if(node.nodeType === Node.TEXT_NODE) {
            const nodeText = node.textContent.toLowerCase();
            const index = nodeText.indexOf(text);
            if(index !== -1 && node.parentNode.tagName !== "MARK") {
                const range = document.createRange();
                range.setStart(node, index);
                range.setEnd(node, index + text.length);

                const mark = document.createElement("mark");
                mark.style.backgroundColor = "blue";
                mark.style.color = "white";

                range.surroundContents(mark);
                mark.scrollIntoView({ behavior: "smooth", block: "center" });
                return true;
            }
        } else {
            for(const child of node.childNodes) {
                if(highlightText(child, text)) return true;
            }
        }
        return false;
    }

    highlightText(document.body, lowerQuery);
});