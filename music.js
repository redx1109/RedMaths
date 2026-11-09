/* ============================================================
   MUSIC PLAYER & AUTOPLAY HANDLING
   ============================================================ */
const music = document.getElementById('bg-music');
const musicPlayer = document.getElementById('musicPlayer');
const musicText = document.querySelector('.music-text');
const audioPrompt = document.getElementById('audioPrompt');

music.volume = 0.35;
music.addEventListener('error', () => { musicPlayer.style.display = 'none'; });

function updateMusicUI(isPlaying) {
  if (isPlaying) {
    musicPlayer.classList.add('playing');
    musicText.textContent = 'Pause';
    audioPrompt.classList.remove('show');
  } else {
    musicPlayer.classList.remove('playing');
    musicText.textContent = 'Play';
  }
}

function attemptPlay() {
  const playPromise = music.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      updateMusicUI(true);
      document.removeEventListener('click', attemptPlay);
      document.removeEventListener('keydown', attemptPlay);
      window.removeEventListener('scroll', attemptPlay);
    }).catch(e => {
      audioPrompt.classList.add('show');
      if (!window.audioInteractionAdded) {
        window.audioInteractionAdded = true;
        document.addEventListener('click', attemptPlay);
        document.addEventListener('keydown', attemptPlay);
        window.addEventListener('scroll', attemptPlay);
      }
    });
  }
}

function toggleMusic() {
  if (music.paused) {
    music.play().then(() => updateMusicUI(true)).catch(() => {});
  } else {
    music.pause();
    updateMusicUI(false);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  attemptPlay();
});
