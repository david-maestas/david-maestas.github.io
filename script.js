document.documentElement.classList.add("js");

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#nav-menu");

if (navToggle && navMenu) {
  const closeMenu = () => {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("is-open")) {
      closeMenu();
      navToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
      closeMenu();
    }
  });

  const desktopLayout = window.matchMedia("(min-width: 881px)");
  desktopLayout.addEventListener("change", () => closeMenu());
}

// Local filtering only: search terms stay in the browser and are not tracked.
const publicationSearch = document.querySelector("#publication-search");
const publicationResults = document.querySelector("#publication-results");
const publicationEmpty = document.querySelector("#publication-empty");
const clearPublicationSearch = document.querySelector("#clear-publication-search");

if (publicationSearch && publicationResults && clearPublicationSearch) {
  const publications = [...document.querySelectorAll("[data-publication]")];
  const yearGroups = [...document.querySelectorAll("[data-year-group]")];
  const peerReviewedHeading = document.querySelector("#peer-reviewed .section-heading");
  const preprintSection = document.querySelector("#preprints");
  const searchable = publications.map((element) => ({
    element,
    text: element.textContent.toLocaleLowerCase()
  }));
  const filterPublications = () => {
    const query = publicationSearch.value.trim().toLocaleLowerCase();
    const words = query.split(/\s+/).filter(Boolean);
    let shown = 0;
    searchable.forEach(({ element, text }) => {
      const matches = words.every((word) => text.includes(word));
      element.hidden = !matches;
      if (matches) shown += 1;
    });
    yearGroups.forEach((group) => {
      group.hidden = ![...group.querySelectorAll("[data-publication]")].some((entry) => !entry.hidden);
    });
    if (peerReviewedHeading) {
      peerReviewedHeading.hidden = Boolean(query) && !publications.some((entry) => entry.dataset.publication === "article" && !entry.hidden);
    }
    if (preprintSection) {
      preprintSection.hidden = Boolean(query) && !publications.some((entry) => entry.dataset.publication === "preprint" && !entry.hidden);
    }
    clearPublicationSearch.hidden = !query;
    if (publicationEmpty) publicationEmpty.hidden = shown > 0;
    publicationResults.textContent = query
      ? `${shown} matching ${shown === 1 ? "publication" : "publications"}`
      : `Showing all ${publications.length} publications`;
  };
  publicationSearch.addEventListener("input", filterPublications);
  clearPublicationSearch.addEventListener("click", () => {
    publicationSearch.value = "";
    filterPublications();
    publicationSearch.focus();
  });
  document.querySelectorAll('.anchor-links a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      publicationSearch.value = "";
      filterPublications();
    });
  });
}
