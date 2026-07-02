/* ============================================================
   Persistent background music — continues across page navigation
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

  /* Read saved state */
  const savedTime  = parseFloat(sessionStorage.getItem('musicTime') || '0');
  const savedState = sessionStorage.getItem('musicPlaying');
  /* First visit = null → play. Explicitly paused = 'false' → don't play. */
  const shouldPlay = savedState !== 'false';

  if (savedTime > 0) audio.currentTime = savedTime;

  function setUI(playing) {
    if (bar)       bar.classList.add('show');
    if (eqMini)    eqMini.classList.toggle('paused', !playing);
    if (iconPlay)  iconPlay.style.display  = playing ? 'none' : '';
    if (iconPause) iconPause.style.display = playing ? ''     : 'none';
  }

  function startPlay() {
    audio.play()
      .then(() => setUI(true))
      .catch(() => {
        /* Still blocked — wait for any user gesture on this page */
        setUI(false);
        const events = ['click', 'keydown', 'touchstart', 'scroll'];
        function onGesture() {
          audio.play().then(() => {
            setUI(true);
            sessionStorage.setItem('musicPlaying', 'true');
          }).catch(() => {});
          events.forEach(e => document.removeEventListener(e, onGesture));
        }
        events.forEach(e => document.addEventListener(e, onGesture, { once: true, passive: true }));
      });
  }

  if (shouldPlay) {
    startPlay();
  } else {
    setUI(false);
  }

  /* Save position before leaving — do NOT pause here so next page can resume */
  function saveState() {
    sessionStorage.setItem('musicTime',    audio.currentTime);
    sessionStorage.setItem('musicPlaying', audio.paused ? 'false' : 'true');
  }
  window.addEventListener('pagehide',     saveState);
  window.addEventListener('beforeunload', saveState);

  /* Handle bfcache restore */
  window.addEventListener('pageshow', e => {
    if (e.persisted && sessionStorage.getItem('musicPlaying') === 'true' && audio.paused) {
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
