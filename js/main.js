(function () {
  document.documentElement.classList.add("motion-ready");

  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
  const revealItems = Array.from(document.querySelectorAll(".reveal"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const setScrolled = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  const closeNav = () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => link.addEventListener("click", closeNav));

  const revealVisibleItems = () => {
    revealItems.forEach((item) => {
      if (item.classList.contains("is-visible")) return;
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.18 && rect.bottom > -20) {
        item.classList.add("is-visible");
      }
    });
  };

  let revealTicking = false;
  const scheduleReveal = () => {
    if (revealTicking) return;
    revealTicking = true;
    window.requestAnimationFrame(() => {
      revealVisibleItems();
      revealTicking = false;
    });
  };

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  sections.forEach((section) => activeObserver.observe(section));

  const year = document.querySelector("[data-year]");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  setScrolled();
  revealVisibleItems();
  const revealWarmup = window.setInterval(() => {
    revealVisibleItems();
    if (document.querySelectorAll(".reveal:not(.is-visible)").length === 0) {
      window.clearInterval(revealWarmup);
    }
  }, 500);
  window.setTimeout(() => window.clearInterval(revealWarmup), 12000);
  window.addEventListener("scroll", setScrolled, { passive: true });
  window.addEventListener("scroll", scheduleReveal, { passive: true });
  window.addEventListener("resize", scheduleReveal);
})();
