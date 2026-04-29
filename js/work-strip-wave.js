/**
 * Replaces straight diagonal clip-paths on .work-strip with a subtle wave along
 * the top and bottom edges (vertical sides stay straight).
 */
(function () {
  var strips;
  var resizeTimer;

  function parseAngleDeg() {
    var raw = getComputedStyle(document.documentElement).getPropertyValue("--strip-angle").trim();
    var n = parseFloat(raw);
    return Number.isFinite(n) ? n : 10;
  }

  function buildPath(W, Htot, angleDeg, ampPx, waveCount) {
    var angleRad = (angleDeg * Math.PI) / 180;
    var offset = W * Math.tan(angleRad);
    var h = Htot - offset;
    var N = 56;
    var freq = waveCount;

    function yTop(x) {
      var t = x / W;
      return offset * (1 - t) + ampPx * Math.sin(2 * Math.PI * freq * t);
    }

    function yBot(x) {
      return offset + h - (offset * x) / W + ampPx * Math.sin(2 * Math.PI * freq * (x / W));
    }

    var d = "M 0 " + yTop(0);
    var i;
    for (i = 1; i <= N; i++) {
      var x = (i / N) * W;
      d += " L " + x + " " + yTop(x);
    }
    d += " L " + W + " " + yBot(W);
    for (i = N - 1; i >= 0; i--) {
      var xb = (i / N) * W;
      d += " L " + xb + " " + yBot(xb);
    }
    d += " Z";
    return d;
  }

  function apply() {
    strips = document.querySelectorAll(".work-strip");
    if (!strips.length) return;

    var angleDeg = parseAngleDeg();
    /* ~2 wave crests across the width; amplitude scales gently with viewport */
    var waveCount = 2;
    var ampPx = Math.min(10, Math.max(3, window.innerWidth * 0.004));

    strips.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var W = r.width;
      var Htot = r.height;
      if (W < 1 || Htot < 1) return;

      var d = buildPath(W, Htot, angleDeg, ampPx, waveCount);
      el.style.clipPath = 'path("' + d + '")';
    });
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(apply, 80);
  }

  if (typeof window.CSS !== "undefined" && CSS.supports && CSS.supports("clip-path", 'path("M0 0 L1 1 Z")')) {
    function run() {
      requestAnimationFrame(function () {
        apply();
      });
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
    window.addEventListener("resize", onResize);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(run).catch(function () {});
    }
  }
})();
