document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");
  const pageName = document.querySelector("main[data-page]")?.dataset.page;

  // Sticky Header Logic
  const makeSticky = () => header.classList.add("sticky-header");
  const removeSticky = () => header.classList.remove("sticky-header");

  if (pageName === "home") {
    const firstSection = document.querySelector(".home__section");

    if (firstSection && header) {
      const observer = new IntersectionObserver(
        function (entries) {
          const entry = entries[0];
          if (!entry.isIntersecting) {
            makeSticky();
          } else {
            removeSticky();
          }
        },
        {
          root: null,
          threshold: 0,
        }
      );
      observer.observe(firstSection);
    }
  } else {
    makeSticky();
  }

  // Active Link Logic (Fixed)
  const navLinks = Array.from(
    document.querySelectorAll(".header__menu .nav-link")
  );

  const setActiveLink = () => {
    const currentPath = window.location.pathname;

    const sortedLinks = navLinks.sort((a, b) => {
      const pathA = new URL(a.href, window.location.origin).pathname.length;
      const pathB = new URL(b.href, window.location.origin).pathname.length;
      return pathB - pathA;
    });

    let matched = false;

    sortedLinks.forEach((link) => {
      const linkPath = new URL(link.href, window.location.origin).pathname;
      link.classList.remove("active");

      if (!matched) {
        if (
          currentPath === linkPath ||
          (currentPath.startsWith(linkPath) &&
            currentPath.charAt(linkPath.length) === "/")
        ) {
          link.classList.add("active");
          matched = true;
        }
      }
    });
  };

  setActiveLink();

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      setTimeout(setActiveLink, 100);
    });
  });

  window.addEventListener("popstate", setActiveLink);
});
