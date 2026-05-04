(function () {
  const root = document.getElementById("hhc-gallery");
  if (!root || !Array.isArray(window.HHCGallery)) return;

  const frag = document.createDocumentFragment();
  window.HHCGallery.forEach(function (item) {
    if (!item || !item.file) return;
    const fig = document.createElement("figure");
    fig.setAttribute("role", "listitem");
    var cls = "project-gallery__item";
    if (item.wide) cls += " project-gallery__item--wide";
    if (item.logo) cls += " project-gallery__item--logo";
    if (item.hero) cls += " project-gallery__item--hero";
    fig.className = cls;
    const img = document.createElement("img");
    img.src = item.file;
    img.alt = item.alt || "HHC project image";
    img.loading = item.hero ? "eager" : "lazy";
    img.decoding = "async";
    fig.appendChild(img);
    frag.appendChild(fig);
  });
  root.appendChild(frag);
})();
