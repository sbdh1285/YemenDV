document.documentElement.classList.add("js");

const config = window.PORTFOLIO_CONFIG || {};
const projectData = {
  kaboos: {
    title: "بروفايل الكبوس",
    category: "ملف تعريفي",
    description: "مشروع ملف تعريفي للشركة. المعاينة الحالية تكوين بصري مؤقت مبني على اسم المشروع، وليست صفحات ملف الكبوس الأصلي.",
    className: "poster-kaboos",
  },
  rabee: {
    title: "هوية ربيع الحباري للاستيراد",
    category: "هوية بصرية",
    description: "مشروع هوية تجارية لقطاع الاستيراد. استبدل هذه المعاينة المؤقتة بصور الشعار وتطبيقات الهوية الأصلية.",
    className: "poster-rabee",
  },
  ibtiqar: {
    title: "Brand Ibtiqar",
    category: "هوية بصرية",
    description: "مشروع هوية علامة تجارية. بطاقة العرض الحالية مؤقتة، وتُستبدل بصفحات المشروع الأصلية عند توفرها.",
    className: "poster-ibtiqar",
  },
};

function applyConfig() {
  const name = typeof config.name === "string" && config.name.trim() ? config.name.trim() : "Portfolio";
  const role = typeof config.role === "string" && config.role.trim() ? config.role.trim() : "تصميم بصري وهوية تجارية";
  document.querySelectorAll("[data-config-name]").forEach((node) => { node.textContent = name; });
  document.querySelectorAll("[data-config-role]").forEach((node) => { node.textContent = role; });
  document.title = `أعمالي — ${name}`;
  const year = document.querySelector("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());

  const contactLinks = document.querySelector("#contact-links");
  const contactHint = document.querySelector("#contact-hint");
  if (!contactLinks) return;

  const links = [];
  if (config.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email)) {
    links.push({ label: "راسلني بالبريد", value: config.email, href: `mailto:${config.email}`, symbol: "↗" });
  }
  if (config.whatsapp && String(config.whatsapp).replace(/\D/g, "").length >= 8) {
    const number = String(config.whatsapp).replace(/\D/g, "");
    links.push({ label: "تواصل عبر واتساب", value: "WhatsApp", href: `https://wa.me/${number}`, symbol: "↗" });
  }
  if (config.instagram) {
    const handle = String(config.instagram).replace(/^@/, "");
    const href = /^https?:\/\//.test(handle) ? handle : `https://instagram.com/${encodeURIComponent(handle)}`;
    links.push({ label: "إنستغرام", value: handle, href, symbol: "↗" });
  }
  if (config.behance) {
    const profile = String(config.behance).replace(/^@/, "");
    const href = /^https?:\/\//.test(profile) ? profile : `https://www.behance.net/${encodeURIComponent(profile)}`;
    links.push({ label: "Behance", value: profile, href, symbol: "↗" });
  }
  if (config.github) {
    const profile = String(config.github).replace(/^@/, "");
    const href = /^https?:\/\//.test(profile) ? profile : `https://github.com/${encodeURIComponent(profile)}`;
    links.push({ label: "حساب GitHub", value: profile, href, symbol: "↗" });
  }

  contactLinks.replaceChildren(...links.map((item) => {
    const link = document.createElement("a");
    link.className = "contact-link";
    link.href = item.href;
    link.innerHTML = `<span aria-hidden="true">${item.symbol}</span><span class="contact-link-label"></span>`;
    link.querySelector(".contact-link-label").textContent = item.label;
    if (item.href.startsWith("https://")) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    return link;
  }));
  if (contactHint) contactHint.hidden = links.length > 0;
}

function setupMenu() {
  const toggle = document.querySelector("#menu-toggle");
  const nav = document.querySelector("#primary-nav");
  if (!toggle || !nav) return;
  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "فتح القائمة");
    nav.classList.remove("is-open");
  };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
    nav.classList.toggle("is-open", open);
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
  document.addEventListener("click", (event) => {
    if (nav.classList.contains("is-open") && !nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
}

function setupFilters() {
  const buttons = [...document.querySelectorAll("[data-filter]")];
  const cards = [...document.querySelectorAll(".project-card")];
  const visibleCount = document.querySelector("#visible-count");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((button) => button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    buttons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    let count = 0;
    cards.forEach((card) => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-filtered", !visible);
      if (visible) count += 1;
    });
    if (visibleCount) visibleCount.textContent = String(count).padStart(2, "0");
  }));
}

function setupProjectDialog() {
  const dialog = document.querySelector("#project-dialog");
  const preview = document.querySelector("#dialog-preview");
  const close = document.querySelector("#dialog-close");
  if (!dialog || !preview || !close) return;

  const openProject = (id) => {
    const data = projectData[id];
    const source = document.querySelector(`.project-art[data-project="${id}"]`);
    if (!data || !source) return;
    preview.className = `dialog-preview poster ${data.className}`;
    preview.innerHTML = source.innerHTML;
    document.querySelector("#dialog-category").textContent = data.category;
    document.querySelector("#dialog-title").textContent = data.title;
    document.querySelector("#dialog-description").textContent = data.description;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  };

  document.querySelectorAll("[data-project]").forEach((button) => {
    button.addEventListener("click", () => openProject(button.dataset.project));
  });
  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    const inDialog = bounds.top <= event.clientY && event.clientY <= bounds.bottom && bounds.left <= event.clientX && event.clientX <= bounds.right;
    if (!inDialog) dialog.close();
  });
}

function setupScrollEffects() {
  const progress = document.querySelector("#scroll-progress-bar");
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  const revealItems = document.querySelectorAll("[data-reveal]");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    revealItems.forEach((item) => observer.observe(item));
  }

  const sections = [...document.querySelectorAll("#home, #work, #about, #process")];
  const navLinks = [...document.querySelectorAll(".nav-link")];
  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle("is-current", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((section) => navObserver.observe(section));
  }
}

applyConfig();
setupMenu();
setupFilters();
setupProjectDialog();
setupScrollEffects();
