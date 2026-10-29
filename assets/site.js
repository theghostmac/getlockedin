// Mobile menu, scroll reveals, and the word by word tagline.
(() => {
  const body = document.body;
  const button = document.querySelector(".menu-btn");
  if (button) {
    const toggle = (open) => {
      body.classList.toggle("menu-open", open);
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    button.addEventListener("click", () => toggle(!body.classList.contains("menu-open")));
    document.querySelectorAll(".mobile-menu a").forEach((a) => a.addEventListener("click", () => toggle(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggle(false); });
  }

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".rise").forEach((el) => el.classList.add("in"));
    document.querySelectorAll(".tagline .w").forEach((el) => el.classList.add("on"));
    return;
  }

  // Each section rises once and stays.
  const riseObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      riseObserver.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  document.querySelectorAll(".rise").forEach((el) => riseObserver.observe(el));

  // Split the tagline into words; each lights up as it crosses a line
  // 40% up from the bottom of the viewport, in reading order.
  const tagline = document.querySelector(".tagline");
  if (tagline) {
    const lines = tagline.innerHTML.split(/<br\s*\/?>/i);
    tagline.innerHTML = lines
      // Words on one line cross together, so a small stagger keeps them in order.
      .map((line) => line.trim().split(/\s+/).map((w, i) => `<span class="w" style="transition-delay:${i * 70}ms">${w}</span>`).join(" "))
      .join("<br>");
    const wordObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("on", entry.boundingClientRect.top < window.innerHeight * 0.6 || entry.isIntersecting));
    }, { rootMargin: "0px 0px -40% 0px" });
    tagline.querySelectorAll(".w").forEach((w) => wordObserver.observe(w));
  }
})();
