
(() => {
  "use strict";

  // CURRENT PAGE
  const currentPage = document.body.dataset.page;

  const navTargets = {
    home: ["index.html"],
    about: ["about.html"],
    services: ["services.html"],
    "portable-cabins": ["portable-cabins.html"],
    "office-cabins": ["office-cabins.html"],
    "interior-work": ["interior-work.html"],
    projects: ["projects.html"],
    contact: ["contact.html"]
  };

  document.querySelectorAll(".primary-nav a").forEach((link) => {
    if ((navTargets[currentPage] || []).includes(link.getAttribute("href"))) {
      link.setAttribute("aria-current", "page");
    }
  });

  // FOOTER YEAR
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  // MOBILE MENU
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-nav");

  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
    };

    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";

      menuButton.setAttribute("aria-expanded", String(!open));
      navigation.classList.toggle("is-open", !open);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 767) closeMenu();
    });
  }

  // FAQ ACCORDION
  document.querySelectorAll(".faq-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded =
        trigger.getAttribute("aria-expanded") === "true";

      const panel = document.getElementById(
        trigger.getAttribute("aria-controls")
      );

      trigger.setAttribute("aria-expanded", String(!expanded));

      if (panel) panel.hidden = expanded;
    });
  });

  // GALLERY FILTER
  const filterButtons = [
    ...document.querySelectorAll(".filter-button")
  ];

  const galleryCards = [
    ...document.querySelectorAll(".gallery-card")
  ];

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => {
        const active = item === button;

        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      galleryCards.forEach((card) => {
        card.hidden =
          filter !== "all" &&
          card.dataset.category !== filter;
      });
    });
  });

  // GALLERY LIGHTBOX
  const dialog = document.querySelector(".lightbox");

  if (dialog && galleryCards.length) {
    const image = dialog.querySelector("img");
    const caption = dialog.querySelector("p");

    let activeCards = [];
    let activeIndex = 0;
    let priorFocus = null;

    const showImage = (index) => {
      if (!activeCards.length) return;

      activeIndex =
        (index + activeCards.length) % activeCards.length;

      const card = activeCards[activeIndex];

      image.src = card.dataset.full;
      image.alt = card.querySelector("img").alt;
      caption.textContent = card.dataset.caption;
    };

    const visibleGalleryCards = () =>
      galleryCards.filter((card) => !card.hidden);

    galleryCards.forEach((card) => {
      card.addEventListener("click", () => {
        activeCards = visibleGalleryCards();
        priorFocus = card;

        showImage(activeCards.indexOf(card));

        dialog.showModal();
      });
    });

    dialog
      .querySelector(".lightbox-close")
      .addEventListener("click", () => dialog.close());

    dialog
      .querySelector(".lightbox-prev")
      .addEventListener("click", () => {
        showImage(activeIndex - 1);
      });

    dialog
      .querySelector(".lightbox-next")
      .addEventListener("click", () => {
        showImage(activeIndex + 1);
      });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener("close", () => {
      image.removeAttribute("src");

      if (priorFocus && document.contains(priorFocus)) {
        priorFocus.focus();
      }
    });

    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        showImage(activeIndex + 1);
      }

      if (event.key === "ArrowLeft") {
        showImage(activeIndex - 1);
      }
    });
  }

  // CONTACT FORM
  // Email submission is handled by normal HTML POST.
  // No AJAX, fetch(), or preventDefault() is required.

  const form = document.querySelector("#enquiry-form");

  if (form) {
    const name = form.querySelector("#name");
    const email = form.querySelector("#email");

    // NAME VALIDATION
    if (name) {
      name.addEventListener("input", () => {
        name.setCustomValidity("");

        if (name.value.trim().length < 2 && name.value.length > 0) {
          name.setCustomValidity(
            "Please enter at least 2 characters."
          );
        }
      });
    }

    // EMAIL VALIDATION
    if (email) {
      email.addEventListener("input", () => {
        email.setCustomValidity("");
      });
    }

    // NORMAL FORM SUBMISSION
    // Browser submits directly to FormSubmit.
    // Successful submission redirects to the configured _next URL.
  }

})();
