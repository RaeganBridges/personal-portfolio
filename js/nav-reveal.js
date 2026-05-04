(function () {
  const nav = document.querySelector(".site-nav");
  const bridgeHead = document.querySelector(".works-bridge-head");
  if (!nav) return;

  function syncNav() {
    if (!bridgeHead) {
      nav.classList.add("site-nav--revealed");
      return;
    }
    const rect = bridgeHead.getBoundingClientRect();
    /* Reveal shortly before the bridge intro fully clears the top (earlier than bottom < 0) */
    const revealThresholdPx = 72;
    nav.classList.toggle("site-nav--revealed", rect.bottom < revealThresholdPx);
  }

  syncNav();
  window.addEventListener("scroll", syncNav, { passive: true });
  window.addEventListener("resize", syncNav, { passive: true });
  window.addEventListener("load", syncNav, { passive: true });
  window.addEventListener("hashchange", syncNav, { passive: true });
})();
