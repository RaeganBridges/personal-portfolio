(function () {
  let overlay;
  let items = [];
  let index = 0;
  let imgEl;
  let btnPrev;
  let btnNext;
  let btnClose;
  let backdropEl;

  function wireRefs() {
    imgEl = overlay.querySelector(".gallery-lightbox__img");
    btnPrev = overlay.querySelector(".gallery-lightbox__nav--prev");
    btnNext = overlay.querySelector(".gallery-lightbox__nav--next");
    btnClose = overlay.querySelector(".gallery-lightbox__close");
    backdropEl = overlay.querySelector(".gallery-lightbox__backdrop");
  }

  function buildOverlay() {
    var existing = document.getElementById("gallery-lightbox");
    if (existing) {
      overlay = existing;
      wireRefs();
      return;
    }

    overlay = document.createElement("div");
    overlay.id = "gallery-lightbox";
    overlay.className = "gallery-lightbox";
    overlay.setAttribute("hidden", "");
    overlay.setAttribute("aria-hidden", "true");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "Enlarged gallery image");

    overlay.innerHTML =
      '<div class="gallery-lightbox__backdrop" tabindex="-1"></div>' +
      '<button type="button" class="gallery-lightbox__close" aria-label="Close">&times;</button>' +
      '<button type="button" class="gallery-lightbox__nav gallery-lightbox__nav--prev" aria-label="Previous image">' +
      '<span class="gallery-lightbox__nav-inner" aria-hidden="true">&#8249;</span></button>' +
      '<button type="button" class="gallery-lightbox__nav gallery-lightbox__nav--next" aria-label="Next image">' +
      '<span class="gallery-lightbox__nav-inner" aria-hidden="true">&#8250;</span></button>' +
      '<div class="gallery-lightbox__stage"><img class="gallery-lightbox__img" alt="" /></div>';

    document.body.appendChild(overlay);

    wireRefs();

    btnClose.addEventListener("click", function (e) {
      e.stopPropagation();
      close();
    });
    backdropEl.addEventListener("click", close);
    overlay.querySelector(".gallery-lightbox__stage").addEventListener("click", function (e) {
      e.stopPropagation();
    });

    btnPrev.addEventListener("click", function (e) {
      e.stopPropagation();
      go(-1);
    });
    btnNext.addEventListener("click", function (e) {
      e.stopPropagation();
      go(1);
    });
  }

  function openAt(imgNodes, startIndex) {
    buildOverlay();
    items = Array.prototype.map.call(imgNodes, function (img) {
      return { src: img.currentSrc || img.getAttribute("src") || img.src, alt: img.getAttribute("alt") || "" };
    });
    index = startIndex;
    show();
    btnClose.focus({ preventScroll: true });
  }

  function show() {
    if (!items.length) return;
    const cur = items[index];
    imgEl.src = cur.src;
    imgEl.alt = cur.alt;

    overlay.removeAttribute("hidden");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const single = items.length <= 1;
    btnPrev.hidden = single;
    btnNext.hidden = single;
  }

  function go(delta) {
    if (items.length <= 1) return;
    index = (index + delta + items.length) % items.length;
    show();
  }

  function close() {
    if (!overlay || overlay.hasAttribute("hidden")) return;
    overlay.setAttribute("hidden", "");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    imgEl.removeAttribute("src");
    imgEl.alt = "";
  }

  function onKeydown(e) {
    if (!overlay || overlay.hasAttribute("hidden")) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  }

  function bindGalleries() {
    document.querySelectorAll(".project-gallery").forEach(function (gallery) {
      var imgs = gallery.querySelectorAll("img");
      imgs.forEach(function (img, i) {
        img.addEventListener("click", function (e) {
          e.preventDefault();
          openAt(imgs, i);
        });
      });
    });
  }

  function init() {
    bindGalleries();
    buildOverlay();
    document.addEventListener("keydown", onKeydown);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
