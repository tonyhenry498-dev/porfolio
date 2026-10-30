// main.js - shared across all pages: mobile menu, active link, footer year, greeting, project filter

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("menuToggle");
  const links = document.getElementById("navLinks");
  const header = document.querySelector(".site-header");

  function closeMenu() {
    if (!links) return;
    links.classList.remove("open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  // Highlight the link of the current page
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    if (a.getAttribute("href") === current) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  // Shadow under the header once the page scrolls
  if (header) {
    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    }, { passive: true });
  }

  // Dynamic footer year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Dynamic greeting on the homepage
  const greeting = document.getElementById("greeting");
  if (greeting) {
    const hour = new Date().getHours();
    let text = "Good evening";
    if (hour < 12) text = "Good morning";
    else if (hour < 18) text = "Good afternoon";
    greeting.textContent = text + ", and welcome.";
  }

  // Project filter (projects page only)
  const grid = document.getElementById("projectGrid");
  if (grid) {
    const chips = document.querySelectorAll(".chip");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        const filter = chip.dataset.filter;
        chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip); });
        grid.querySelectorAll(".project-card").forEach(function (card) {
          const tags = card.dataset.tags.split(" ");
          card.hidden = filter !== "all" && tags.indexOf(filter) === -1;
        });
      });
    });
  }
});
