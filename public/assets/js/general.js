"use strict";
document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");
  const pageName = document.querySelector("main[data-page]")?.dataset.page;

  // STICKY HEADER ON HERO SECTION DISSAPPEAR
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

  //ACTIVE HEADER LINKS ACCORDING TO URL
  const navLinks = Array.from(
    document.querySelectorAll(".header__menu .nav-link")
  );

  const routesMap = [
    { href: "/buildestate", match: (path) => path === "/buildestate" },
    {
      href: "/buildestate/properties",
      match: (path) =>
        path.startsWith("/buildestate/properties") ||
        /^\/buildestate\/property\/[^\/]+$/.test(path),
    },
    {
      href: "/buildestate/about",
      match: (path) => path === "/buildestate/about",
    },
    {
      href: "/buildestate/contact",
      match: (path) => path === "/buildestate/contact",
    },
  ];

  const setActiveLink = () => {
    const currentPath = window.location.pathname.replace(/\/$/, ""); // normalize trailing slash

    navLinks.forEach((link) => {
      const linkPath = new URL(
        link.href,
        window.location.origin
      ).pathname.replace(/\/$/, "");
      const route = routesMap.find((r) => r.href === linkPath);

      if (route && route.match(currentPath)) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };

  setActiveLink();

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setTimeout(setActiveLink, 100);
    });
  });

  window.addEventListener("popstate", setActiveLink);

  const hijackHistoryMethod = (methodName) => {
    const original = history[methodName];
    return function (...args) {
      const result = original.apply(this, args);
      window.dispatchEvent(new Event(methodName));
      return result;
    };
  };

  history.pushState = hijackHistoryMethod("pushState");
  history.replaceState = hijackHistoryMethod("replaceState");

  window.addEventListener("pushState", setActiveLink);
  window.addEventListener("replaceState", setActiveLink);

  // USER PROFILE DISPLAY LOGIC

  const loginSection = document.getElementById("loginContainer");
  const profileSection = document.getElementById("profileContainer");

  const showUserProfile = (user) => {
    document
      .querySelectorAll(".username")
      .forEach((el) => (el.textContent = user.name));
    document
      .querySelectorAll(".useremail")
      .forEach((el) => (el.textContent = user.email));
    document
      .querySelectorAll(".avatar")
      .forEach(
        (el) => (el.src = user.avatar || `/assets/media/users/${user.image}`)
      );
    profileSection?.classList.remove("d-none");
    loginSection?.classList.add("d-none");
  };

  const showLoginButton = () => {
    profileSection?.classList.add("d-none");
    loginSection?.classList.remove("d-none");
  };

  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    try {
      if (user.name && user.email) {
        showUserProfile(user);
      } else {
        showLoginButton();
      }
    } catch (err) {
      showLoginButton();
    }
  } else {
    showLoginButton();
  }

  // LOGOUT FUNCTIONALITY
  const logoutButtons = document.querySelectorAll(".logoutBtn");
  logoutButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();

      Swal.fire({
        text: "Are you sure you want to sign out?",
        icon: "warning",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: "Yes, sign out",
        cancelButtonText: "Cancel",
        customClass: {
          confirmButton: "btn btn-danger",
          cancelButton: "btn btn-active-light",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const user = JSON.parse(localStorage.getItem("user"));
          const userId = user?.id;

          fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          })
            .then((res) => res.json())
            .then(() => {
              if (userId) {
                fetch(`/api/user/updateStatus/${userId}`, {
                  method: "PUT",
                })
                  .then((res) => res.json())
                  .then((statusData) => {
                    console.log("User status updated:", statusData);
                  })
                  .catch((err) => {
                    console.error("Status update failed:", err);
                  });
              }
              localStorage.removeItem("user");

              window.location.href = "/signin";
            })
            .catch((err) => {
              console.error("Logout failed", err);
              Swal.fire("Oops!", "Logout failed. Try again.", "error");
            });
        }
      });
    });
  });
});
