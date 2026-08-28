(function () {
  const audio = document.getElementById("audio");
  const playBtn = document.getElementById("play-btn");
  const timeline = document.getElementById("timeline");
  const timelineProgress = document.getElementById("timeline-progress");
  const currentTimeEl = document.getElementById("current-time");
  const remainingTimeEl = document.getElementById("remaining-time");

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, "0")}`;
  }

  function updateProgress() {
    if (!isFinite(audio.duration) || audio.duration === 0) return;
    const percent = (audio.currentTime / audio.duration) * 100;
    timelineProgress.style.width = `${percent}%`;
    timeline.setAttribute("aria-valuenow", Math.round(percent));
    currentTimeEl.textContent = formatTime(audio.currentTime);
    remainingTimeEl.textContent = `-${formatTime(audio.duration - audio.currentTime)}`;
  }

  function togglePlay() {
    if (!audio.hasAttribute("src") && !audio.querySelector("source")) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  function seekFromEvent(clientX) {
    if (!isFinite(audio.duration) || audio.duration === 0) return;
    const rect = timeline.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
    updateProgress();
  }

  playBtn.addEventListener("click", togglePlay);

  audio.addEventListener("play", () => {
    playBtn.classList.add("is-playing");
    playBtn.setAttribute("aria-pressed", "true");
    playBtn.setAttribute("aria-label", "Pausieren");
  });

  audio.addEventListener("pause", () => {
    playBtn.classList.remove("is-playing");
    playBtn.setAttribute("aria-pressed", "false");
    playBtn.setAttribute("aria-label", "Abspielen");
  });

  audio.addEventListener("loadedmetadata", updateProgress);
  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("ended", () => playBtn.classList.remove("is-playing"));

  let isDragging = false;

  timeline.addEventListener("pointerdown", (event) => {
    isDragging = true;
    seekFromEvent(event.clientX);
  });

  window.addEventListener("pointermove", (event) => {
    if (isDragging) seekFromEvent(event.clientX);
  });

  window.addEventListener("pointerup", () => {
    isDragging = false;
  });

  timeline.addEventListener("keydown", (event) => {
    if (!isFinite(audio.duration)) return;
    const step = audio.duration * 0.02;
    if (event.key === "ArrowRight") {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + step);
    } else if (event.key === "ArrowLeft") {
      audio.currentTime = Math.max(0, audio.currentTime - step);
    }
  });

  const tracklistToggle = document.getElementById("tracklist-toggle");
  const tracklist = document.getElementById("tracklist");

  if (tracklistToggle && tracklist) {
    tracklistToggle.addEventListener("click", () => {
      const isOpen = tracklist.classList.toggle("is-open");
      tracklistToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }
})();
