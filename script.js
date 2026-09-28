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
  const reveals = document.querySelectorAll('.reveal');
  const aboutSection = document.querySelector('.about');
  const aboutHeadline = document.querySelector('.about__headline');
  const aboutStory = document.querySelector('.about__story');
  const aboutStats = document.querySelector('.stats');
  const storyProgress = document.querySelector('.story-progress span');
  const experiencesSection = document.querySelector('.experiences');
  const experiencesIntro = document.querySelector('.experiences__intro');
  const experienceCards = [...document.querySelectorAll('.experience-card')];
  const experienceProgress = document.querySelector('.experience-progress b');
  const experienceCurrent = document.querySelector('.experience-progress__current');

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
  const smoothstep = (start, end, value) => {
    const x = clamp((value - start) / (end - start), 0, 1);
    return x * x * (3 - 2 * x);
  };

  function getSectionProgress(section) {
    const distance = section.offsetHeight - window.innerHeight;
    if (distance <= 0) return 0;
    return clamp((window.scrollY - section.offsetTop) / distance, 0, 1);
  }

  function syncNarrative() {
    const aboutProgress = getSectionProgress(aboutSection);
    const headlineOut = smoothstep(0.18, 0.4, aboutProgress);
    const storyIn = smoothstep(0.23, 0.43, aboutProgress);
    const storyOut = smoothstep(0.55, 0.7, aboutProgress);
    const statsIn = smoothstep(0.6, 0.79, aboutProgress);

    aboutHeadline.style.opacity = String(1 - headlineOut);
    aboutHeadline.style.transform = `translateY(${-headlineOut * 70}px) scale(${1 - headlineOut * 0.04})`;
    aboutStory.style.opacity = String(storyIn * (1 - storyOut));
    aboutStory.style.transform = `translateY(${(1 - storyIn) * 70 - storyOut * 55}px)`;
    aboutStats.style.opacity = String(statsIn);
    aboutStats.style.transform = `translateY(${(1 - statsIn) * 70}px)`;
    storyProgress.style.transform = `scaleX(${aboutProgress})`;

    const experienceSectionProgress = getSectionProgress(experiencesSection);
    const cardEntrance = smoothstep(0.09, 0.17, experienceSectionProgress);
    const introDim = smoothstep(0.08, 0.2, experienceSectionProgress);
    const cardPhase = clamp((experienceSectionProgress - 0.13) / 0.76, 0, 1) * 3;
    const activeCard = clamp(Math.round(cardPhase), 0, 3);

    experiencesIntro.style.opacity = String(1 - introDim * 0.88);
    experiencesIntro.style.transform = `translateY(${-introDim * 34}px)`;

    experienceCards.forEach((card, index) => {
      const distance = Math.abs(cardPhase - index);
      const visibility = clamp(1 - distance * 1.35, 0, 1) * cardEntrance;
      const offset = (index - cardPhase) * 90;
      card.style.opacity = String(visibility);
      card.style.transform = `translateY(${offset}px) scale(${0.94 + visibility * 0.06})`;
      card.style.pointerEvents = visibility > 0.75 ? 'auto' : 'none';
      card.style.zIndex = String(10 - Math.round(distance * 2));
    });

    experienceProgress.style.transform = `scaleX(${experienceSectionProgress})`;
    experienceCurrent.textContent = String(activeCard + 1).padStart(2, '0');
  }

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
    syncNarrative();
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

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  reveals.forEach((element) => revealObserver.observe(element));

  window.setTimeout(() => {
    if (!duration && video.readyState >= 1) reveal();
  }, 3000);
})();
