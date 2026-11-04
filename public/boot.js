// Runs before first paint: apply the saved theme, and enable motion styles only when JS works and the
// user allows motion.
(function () {
  var d = document.documentElement;
  try { var t = localStorage.getItem('op.theme'); if (t === 'light' || t === 'dark') d.setAttribute('data-theme', t); } catch (e) { /* storage blocked */ }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) d.classList.add('has-motion');
  // Safety net: if the motion bundle fails to load, show everything.
  setTimeout(function () { if (!d.classList.contains('motion-ready')) d.classList.remove('has-motion'); }, 3500);
})();
