(() => {
  "use strict";

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
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

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

  document.querySelectorAll(".faq-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      const panel = document.getElementById(trigger.getAttribute("aria-controls"));
      trigger.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });

  const filterButtons = [...document.querySelectorAll(".filter-button")];
  const galleryCards = [...document.querySelectorAll(".gallery-card")];
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      galleryCards.forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.category !== filter;
      });
    });
  });

  const dialog = document.querySelector(".lightbox");
  if (dialog && galleryCards.length) {
    const image = dialog.querySelector("img");
    const caption = dialog.querySelector("p");
    let activeCards = [];
    let activeIndex = 0;
    let priorFocus = null;
    const showImage = (index) => {
      if (!activeCards.length) return;
      activeIndex = (index + activeCards.length) % activeCards.length;
      const card = activeCards[activeIndex];
      image.src = card.dataset.full;
      image.alt = card.querySelector("img").alt;
      caption.textContent = card.dataset.caption;
    };
    const visibleGalleryCards = () => galleryCards.filter((card) => !card.hidden);
    galleryCards.forEach((card) => {
      card.addEventListener("click", () => {
        activeCards = visibleGalleryCards();
        priorFocus = card;
        showImage(activeCards.indexOf(card));
        dialog.showModal();
      });
    });
    dialog.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
    dialog.querySelector(".lightbox-prev").addEventListener("click", () => showImage(activeIndex - 1));
    dialog.querySelector(".lightbox-next").addEventListener("click", () => showImage(activeIndex + 1));
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => {
      image.removeAttribute("src");
      if (priorFocus && document.contains(priorFocus)) priorFocus.focus();
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") showImage(activeIndex + 1);
      if (event.key === "ArrowLeft") showImage(activeIndex - 1);
    });
  }

  const form = document.querySelector("#enquiry-form");
  if (form) {
    const status = document.querySelector("#form-status");
    const shareActions = document.querySelector("#share-actions");
    const whatsappLink = document.querySelector("#whatsapp-share");
    const copyButton = document.querySelector("#copy-message");
    let preparedMessage = "";
    const setError = (field, message) => {
      const error = document.getElementById(`${field.id}-error`);
      field.setAttribute("aria-invalid", String(Boolean(message)));
      if (error) error.textContent = message;
    };
    form.querySelectorAll("input, textarea").forEach((field) => {
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") setError(field, "");
      });
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      status.textContent = "";
      shareActions.hidden = true;
      const name = form.elements.name;
      const email = form.elements.email;
      const message = form.elements.message;
      let valid = true;
      [name, email, message].forEach((field) => setError(field, ""));
      if (name.value.trim().length < 2) {
        setError(name, "Please enter your name (at least 2 characters).");
        valid = false;
      }
      if (!email.validity.valid || !email.value.trim()) {
        setError(email, "Please enter a valid email address.");
        valid = false;
      }
      if (message.value.trim().length < 12) {
        setError(message, "Please add a little more detail (at least 12 characters).");
        valid = false;
      }
      if (!valid) {
        status.textContent = "Please review the highlighted fields.";
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
      const project = form.elements.project.value || "Not specified";
      const timing = form.elements.timing.value || "Not specified";
      preparedMessage = [
        "Hello QDR Cabin & Interior,",
        "",
        `My name is ${name.value.trim()}.`,
        `Email: ${email.value.trim()}`,
        `Project type: ${project}`,
        `Timing: ${timing}`,
        "",
        message.value.trim()
      ].join("\n");
      whatsappLink.href = `https://wa.me/919833605267?text=${encodeURIComponent(preparedMessage)}`;
      shareActions.hidden = false;
      status.textContent = "Your message is ready. Nothing has been sent or saved.";
    });
    copyButton.addEventListener("click", async () => {
      if (!preparedMessage) return;
      try {
        await navigator.clipboard.writeText(preparedMessage);
        status.textContent = "Prepared message copied to your clipboard.";
      } catch {
        status.textContent = "Clipboard access is unavailable here. Select the prepared text through WhatsApp share instead.";
      }
    });
  }
})();
