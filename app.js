/* =====================================================================
   KYM DESIGN OFFICE — アニメーション制御（Phase 1–4）
   - Lenis: 慣性スクロール
   - IntersectionObserver: スクロール出現
   - prefers-reduced-motion を尊重
   ===================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- スクロール出現 ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    // モーション無効時は即表示
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- ヒーローの罫線アニメ開始 ---------- */
  var hero = document.querySelector('.hero');
  if (hero) {
    // 次フレームで is-ready を付与（初期状態を確実に描画させてから遷移）
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { hero.classList.add('is-ready'); });
    });
  }

  /* ---------- 慣性スクロール（Lenis）---------- */
  if (!reduceMotion && window.Lenis) {
    var lenis = new Lenis({
      duration: 0.8,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ページ内アンカーは Lenis 経由でスムーズに移動（ナビ高さ分のオフセット）
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        if (id.length > 1) {
          var target = document.querySelector(id);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -90 });
          }
        }
      });
    });
  }
})();
