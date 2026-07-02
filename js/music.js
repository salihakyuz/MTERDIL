/* ============================================================
   Persistent background music — single instance across pages
   ============================================================ */
(function () {
  const audio     = document.getElementById('bg-music');
  const bar       = document.getElementById('music-bar');
  const toggleBtn = document.getElementById('music-toggle');
  const eqMini    = document.getElementById('eq-mini');
  const iconPlay  = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  if (!audio) return;

  audio.volume = 0.5;

  const savedTime  = parseFloat(sessionStorage.getItem('musicTime')    || '0');
  const wasPlaying = sessionStorage.getItem('musicPlaying') !== 'false';
  if (savedTime > 0) audio.currentTime = savedTime;

  function setUI(playing) {
    if (bar)       bar.classList.add('show');
    if (eqMini)    eqMini.classList.toggle('paused', !playing);
    if (iconPlay)  iconPlay.style.display  = playing ? 'none' : '';
    if (iconPause) iconPause.style.display = playing ? ''     : 'none';
  }

  function tryPlay() {
    if (!wasPlaying) { setUI(false); return; }
    audio.play().then(() => setUI(true)).catch(() => {
      setUI(false);
      /* Play on first interaction */
      const events = ['click','keydown','touchstart','scroll'];
      function go() {
        audio.play().then(() => setUI(true)).catch(() => {});
        events.forEach(e => document.removeEventListener(e, go));
      }
      events.forEach(e => document.addEventListener(e, go, { once: true, passive: true }));
    });
  }

  tryPlay();

  /* ---- Stop audio BEFORE leaving so next page doesn't overlap ---- */
  function saveAndStop() {
    sessionStorage.setItem('musicTime',    audio.currentTime);
    sessionStorage.setItem('musicPlaying', (!audio.paused).toString());
    audio.pause();   /* stop this page's audio immediately */
  }
  window.addEventListener('pagehide',     saveAndStop);
  window.addEventListener('beforeunload', saveAndStop);

  /* Resume if page restored from bfcache */
  window.addEventListener('pageshow', e => {
    if (e.persisted && sessionStorage.getItem('musicPlaying') === 'true') {
      audio.play().then(() => setUI(true)).catch(() => {});
    }
  });

  /* Toggle button */
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().then(() => {
          setUI(true);
          sessionStorage.setItem('musicPlaying', 'true');
        });
      } else {
        audio.pause();
        setUI(false);
        sessionStorage.setItem('musicPlaying', 'false');
      }
    });
  }
})();

