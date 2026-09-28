(() => {
  const body = document.body;
  const filmSection = document.querySelector('.film');
  const video = document.querySelector('#moonFilm');
  const loader = document.querySelector('.loader');
  const loaderBar = document.querySelector('.loader__track span');
  const loaderPercent = document.querySelector('.loader__percent');
  const progressBar = document.querySelector('.progress__bar');
  const scrollCue = document.querySelector('.scroll-cue');
  const chapterNumber = document.querySelector('.chapter__number');
  const chapterName = document.querySelector('.chapter__name');

  const chapters = [
    { at: 0, number: '01', name: 'NEW RESORT' },
    { at: 0.25, number: '02', name: 'MOON STONE' },
    { at: 0.49, number: '03', name: 'PREMIUM SERVICE' },
    { at: 0.72, number: '04', name: 'UNIQUE FOOD' },
    { at: 0.91, number: '05', name: 'NICE MOON' }
  ];

  let targetTime = 0;
  let displayedTime = 0;
  let duration = 0;
  let lastChapter = -1;
  let rafId;

  body.classList.add('is-loading');

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  function getProgress() {
    const start = filmSection.offsetTop;
    const distance = filmSection.offsetHeight - window.innerHeight;
    return distance > 0 ? clamp((window.scrollY - start) / distance, 0, 1) : 0;
  }

  function updateChapter(progress) {
    let active = 0;
    chapters.forEach((chapter, index) => {
      if (progress >= chapter.at) active = index;
    });

    if (active === lastChapter) return;
    lastChapter = active;
    chapterNumber.textContent = chapters[active].number;
    chapterName.style.opacity = '0';
    window.setTimeout(() => {
      chapterName.textContent = chapters[active].name;
      chapterName.style.opacity = '1';
    }, 130);
  }

  function syncTarget() {
    const progress = getProgress();
    targetTime = progress * Math.max(duration - 0.05, 0);
    progressBar.style.transform = `scaleX(${progress})`;
    scrollCue.style.opacity = progress > 0.035 ? '0' : '1';
    updateChapter(progress);
  }

  function render() {
    const delta = targetTime - displayedTime;
    displayedTime += delta * 0.18;

    if (Math.abs(video.currentTime - displayedTime) > 0.025) {
      video.currentTime = displayedTime;
    }

    rafId = requestAnimationFrame(render);
  }

  function reveal() {
    if (duration) return;
    duration = Number.isFinite(video.duration) ? video.duration : 30.66;
    displayedTime = targetTime = getProgress() * duration;
    video.currentTime = displayedTime;
    loaderBar.style.width = '100%';
    loaderPercent.textContent = '100%';
    window.setTimeout(() => {
      loader.classList.add('is-hidden');
      body.classList.remove('is-loading');
    }, 250);
    syncTarget();
    render();
  }

  function updateLoadProgress() {
    if (!video.duration || !video.buffered.length) return;
    const end = video.buffered.end(video.buffered.length - 1);
    const percent = Math.min(Math.round((end / video.duration) * 100), 99);
    loaderBar.style.width = `${percent}%`;
    loaderPercent.textContent = `${percent}%`;
  }

  video.addEventListener('loadedmetadata', reveal, { once: true });
  video.addEventListener('progress', updateLoadProgress);
  video.addEventListener('error', () => {
    loader.querySelector('.loader__label').textContent = 'FILM COULD NOT LOAD';
    loaderPercent.textContent = '새로고침해 주세요';
  });

  window.addEventListener('scroll', syncTarget, { passive: true });
  window.addEventListener('resize', syncTarget, { passive: true });

  const unlockVideo = () => {
    video.play().then(() => video.pause()).catch(() => {});
    window.removeEventListener('touchstart', unlockVideo);
    window.removeEventListener('pointerdown', unlockVideo);
  };
  window.addEventListener('touchstart', unlockVideo, { passive: true });
  window.addEventListener('pointerdown', unlockVideo, { passive: true });

  window.addEventListener('pagehide', () => cancelAnimationFrame(rafId));

  window.setTimeout(() => {
    if (!duration && video.readyState >= 1) reveal();
  }, 3000);
})();
