const primaryNav = document.querySelector(".primary-nav");
const navToggle = document.querySelector(".mobile-nav-toggle");

const navLink = document.querySelectorAll(".nav-link");

navToggle.addEventListener("click", () => {
  const visibility = primaryNav.getAttribute("data-visible");

  if (visibility === "false") {
    primaryNav.setAttribute("data-visible", true);
    navToggle.setAttribute("aria-expanded", true);
  }

  if (visibility === "true") {
    primaryNav.setAttribute("data-visible", false);
    navToggle.setAttribute("aria-expanded", false);
  }
});

[...navLink].forEach((nav) => {
  nav.addEventListener("click", () => {
    if (primaryNav.getAttribute("data-visible") === "true") {
      primaryNav.setAttribute("data-visible", false);
      navToggle.setAttribute("aria-expanded", false);
    }
  });
});

/* ambient falling petals */
const petalField = document.getElementById("petal-field");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (petalField && !prefersReducedMotion) {
  const PETAL_COUNT = 16;

  const spawnPetal = () => {
    const petal = document.createElement("div");
    petal.className = "petal";

    const left = Math.random() * 100;
    const size = 6 + Math.random() * 8;
    const fallDuration = 10 + Math.random() * 8;
    const swayDuration = 3 + Math.random() * 3;
    const delay = -(Math.random() * fallDuration);

    petal.style.left = `${left}vw`;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
    petal.style.animationDelay = `${delay}s, ${delay}s`;

    petalField.appendChild(petal);
  };

  for (let i = 0; i < PETAL_COUNT; i++) {
    spawnPetal();
  }
}
