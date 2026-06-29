/* ============================================================
   Persistent background music across pages via sessionStorage
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

  /* Restore position + playing state from previous page */
  const savedTime    = parseFloat(sessionStorage.getItem('musicTime') || '0');
  const wasPlaying   = sessionStorage.getItem('musicPlaying') !== 'false';

  if (savedTime > 0) audio.currentTime = savedTime;

  function setUIPlaying(playing) {
    if (!bar) return;
    bar.classList.add('show');
    if (eqMini)    eqMini.classList.toggle('paused', !playing);
    if (iconPlay)  iconPlay.style.display  = playing ? 'none' : '';
    if (iconPause) iconPause.style.display = playing ? ''     : 'none';
  }

  if (wasPlaying) {
    audio.play().then(() => {
      setUIPlaying(true);
    }).catch(() => {
      /* Autoplay blocked — show bar with play button */
      setUIPlaying(false);
      if (bar) bar.classList.add('show');
    });
  } else {
    setUIPlaying(false);
    if (bar) bar.classList.add('show');
  }

  /* Save state before leaving the page */
  window.addEventListener('pagehide', save);
  window.addEventListener('beforeunload', save);
  function save() {
    sessionStorage.setItem('musicTime',    audio.currentTime);
    sessionStorage.setItem('musicPlaying', (!audio.paused).toString());
  }

  /* Toggle button */
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().then(() => setUIPlaying(true));
      } else {
        audio.pause();
        setUIPlaying(false);
      }
    });
  }
})();
