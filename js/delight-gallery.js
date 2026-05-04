(function () {
  const root = document.getElementById("delight-gallery");
  if (!root || !Array.isArray(window.DelightGallery)) return;

  const frag = document.createDocumentFragment();
  window.DelightGallery.forEach(function (item) {
    if (!item || !item.file) return;
    const fig = document.createElement("figure");
    fig.setAttribute("role", "listitem");
    var cls = "project-gallery__item";
    if (item.wide) cls += " project-gallery__item--wide";
    if (item.logo) cls += " project-gallery__item--logo";
    fig.className = cls;
    const img = document.createElement("img");
    img.src = item.file;
    img.alt = item.alt || "Delight project image";
    img.loading = "lazy";
    img.decoding = "async";
    fig.appendChild(img);
    frag.appendChild(fig);
  });
  root.appendChild(frag);
})();
