document.addEventListener("DOMContentLoaded", () => {
  const headings = Array.from(document.querySelectorAll(".post-content > h2"));
  const outline = document.getElementById("outline-list");
  const outlineScroller = document.querySelector(".sidebar-outline");
  const sidebar = document.getElementById("article-sidebar");
  const sidebarOpen = document.getElementById("sidebar-open");
  const sidebarClose = document.getElementById("sidebar-close");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const currentPosition = document.getElementById("current-position");
  const currentTitle = document.getElementById("current-title");
  const backToTop = document.querySelector(".back-to-top");
  const mobileQuery = window.matchMedia("(max-width: 900px)");

  if (!outline || headings.length === 0) return;

  document.querySelectorAll('.post-content a[href^="https://news.ycombinator.com/item?id="]').forEach((link) => {
    const itemId = new URL(link.href).searchParams.get("id");
    link.textContent = itemId ? `查看原始讨论 · #${itemId}` : "查看原始讨论";
    link.classList.add("hn-discussion-link");
    link.setAttribute("aria-label", itemId
      ? `前往 Hacker News 查看原始讨论，条目 ${itemId}`
      : "前往 Hacker News 查看原始讨论");
    link.parentElement?.classList.add("hn-discussion-label");
    link.closest("p")?.classList.add("hn-discussion-row");
  });

  const setSidebarOpen = (open) => {
    if (!sidebar || !mobileQuery.matches) return;
    sidebar.classList.toggle("is-open", open);
    sidebarOverlay?.classList.toggle("is-visible", open);
    sidebarOpen?.setAttribute("aria-expanded", String(open));
    sidebar.setAttribute("aria-hidden", String(!open));
    sidebar.inert = !open;
    document.body.classList.toggle("sidebar-open", open);
    if (open) sidebarClose?.focus();
  };

  const syncSidebarMode = () => {
    if (!sidebar) return;
    if (mobileQuery.matches) {
      setSidebarOpen(false);
      return;
    }

    sidebar.classList.remove("is-open");
    sidebar.removeAttribute("aria-hidden");
    sidebar.inert = false;
    sidebarOverlay?.classList.remove("is-visible");
    sidebarOpen?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("sidebar-open");
  };

  const links = headings.map((heading, index) => {
    const number = String(index + 1).padStart(2, "0");
    const title = heading.textContent.replace(/^\d+[.、]\s*/, "").trim();
    heading.id = `article-${index + 1}`;
    heading.dataset.number = number;
    heading.textContent = title;

    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.dataset.number = number;
    link.textContent = title;
    link.setAttribute("aria-label", `第 ${index + 1} 篇：${title}`);
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (mobileQuery.matches) setSidebarOpen(false);
      history.pushState(null, "", link.hash);
      heading.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    item.appendChild(link);
    outline.appendChild(item);
    return link;
  });

  let framePending = false;
  let previousIndex = -1;

  const keepActiveLinkVisible = (link) => {
    if (!outlineScroller || !link) return;
    const scrollerRect = outlineScroller.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    if (linkRect.top < scrollerRect.top + 8) {
      outlineScroller.scrollTop -= scrollerRect.top + 8 - linkRect.top;
    } else if (linkRect.bottom > scrollerRect.bottom - 8) {
      outlineScroller.scrollTop += linkRect.bottom - scrollerRect.bottom + 8;
    }
  };

  const updateReadingState = () => {
    const mobileNavBottom = document.querySelector(".mobile-reader-nav")
      ?.getBoundingClientRect().bottom || 0;
    const threshold = Math.max(160, mobileNavBottom + 32);
    let currentIndex = 0;

    headings.forEach((heading, index) => {
      if (heading.getBoundingClientRect().top <= threshold) currentIndex = index;
    });

    links.forEach((link, index) => {
      const active = index === currentIndex;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });

    if (currentIndex !== previousIndex) {
      keepActiveLinkVisible(links[currentIndex]);
      previousIndex = currentIndex;
    }

    if (currentPosition) {
      currentPosition.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${headings.length}`;
    }
    if (currentTitle) currentTitle.textContent = headings[currentIndex].textContent.trim();
    backToTop?.classList.toggle("visible", window.scrollY > 700);
    framePending = false;
  };

  window.addEventListener("scroll", () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateReadingState);
  }, { passive: true });

  sidebarOpen?.addEventListener("click", () => setSidebarOpen(true));
  sidebarClose?.addEventListener("click", () => {
    setSidebarOpen(false);
    sidebarOpen?.focus();
  });
  sidebarOverlay?.addEventListener("click", () => {
    setSidebarOpen(false);
    sidebarOpen?.focus();
  });
  mobileQuery.addEventListener("change", syncSidebarMode);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sidebar?.classList.contains("is-open")) {
      setSidebarOpen(false);
      sidebarOpen?.focus();
    }
  });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  syncSidebarMode();
  updateReadingState();

  if (window.location.hash.startsWith("#article-")) {
    window.setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (!target) return;

      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      target.scrollIntoView({ block: "start" });
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    }, 0);
  }
});
