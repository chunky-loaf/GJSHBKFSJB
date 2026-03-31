
function scrollToTarget(element) {
  const target = document.getElementById(element);

  target.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}