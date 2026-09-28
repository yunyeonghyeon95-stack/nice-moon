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
  const aboutPanorama = document.querySelector('.about__visual--panorama');
  const aboutFleet = document.querySelector('.about__visual--fleet');
  const aboutSpaceport = document.querySelector('.about__visual--spaceport');
  const storyProgress = document.querySelector('.story-progress span');
  const experiencesSection = document.querySelector('.experiences');
  const experiencesIntro = document.querySelector('.experiences__intro');
  const experienceCards = [...document.querySelectorAll('.experience-card')];
  const experienceVideos = [...document.querySelectorAll('.experience-card__video')];
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
  const experienceVideoTargets = experienceVideos.map(() => 0);
  const experienceVideoTimes = experienceVideos.map(() => 0);

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
    const panoramaIn = smoothstep(0.02, 0.14, aboutProgress);
    const panoramaOut = smoothstep(0.24, 0.39, aboutProgress);
    const fleetIn = smoothstep(0.27, 0.43, aboutProgress);
    const fleetOut = smoothstep(0.55, 0.7, aboutProgress);
    const spaceportIn = smoothstep(0.61, 0.79, aboutProgress);

    aboutHeadline.style.opacity = String(1 - headlineOut);
    aboutHeadline.style.transform = `translateY(${-headlineOut * 70}px) scale(${1 - headlineOut * 0.04})`;
    aboutStory.style.opacity = String(storyIn * (1 - storyOut));
    aboutStory.style.transform = `translateY(${(1 - storyIn) * 70 - storyOut * 55}px)`;
    aboutStats.style.opacity = String(statsIn);
    aboutStats.style.transform = `translateY(${(1 - statsIn) * 70}px)`;
    aboutPanorama.style.opacity = String(panoramaIn * (1 - panoramaOut));
    aboutPanorama.style.transform = `translateY(${(1 - panoramaIn) * 10}%) scale(${1.04 - panoramaIn * 0.04})`;
    aboutFleet.style.opacity = String(fleetIn * (1 - fleetOut));
    aboutFleet.style.transform = `scale(${1.08 - fleetIn * 0.08 + fleetOut * 0.03})`;
    aboutSpaceport.style.opacity = String(spaceportIn);
    aboutSpaceport.style.transform = `translateY(${(1 - spaceportIn) * -4}%) scale(${1.04 - spaceportIn * 0.04})`;
    storyProgress.style.transform = `scaleX(${aboutProgress})`;

    const experienceSectionProgress = getSectionProgress(experiencesSection);
    const cardEntrance = smoothstep(0.09, 0.16, experienceSectionProgress);
    const introDim = smoothstep(0.08, 0.2, experienceSectionProgress);
    const contentProgress = clamp((experienceSectionProgress - 0.13) / 0.82, 0, 1);
    const cardPhase = contentProgress * experienceCards.length;
    const activeCard = clamp(Math.floor(cardPhase), 0, experienceCards.length - 1);

    experiencesIntro.style.opacity = String(1 - introDim);
    experiencesIntro.style.transform = `translateY(${-introDim * 34}px)`;
    document.querySelector('.experiences__eyebrow').style.color = contentProgress > 0.015 ? '#fff' : '#0a0a0a';
    document.querySelector('.experience-progress').style.opacity = String(introDim);

    experienceCards.forEach((card, index) => {
      const localProgress = clamp(cardPhase - index, 0, 1);
      const fadeIn = smoothstep(-0.08, 0.08, cardPhase - index);
      const fadeOut = index === experienceCards.length - 1
        ? 1
        : 1 - smoothstep(0.88, 1.04, cardPhase - index);
      const visibility = fadeIn * fadeOut * cardEntrance;
      card.style.opacity = String(visibility);
      card.style.transform = `scale(${1.025 - localProgress * 0.025})`;
      card.style.pointerEvents = visibility > 0.75 ? 'auto' : 'none';
      card.style.zIndex = String(index + 1);

      const clip = experienceVideos[index];
      const clipDuration = Number.isFinite(clip.duration) && clip.duration > 0 ? clip.duration : 8;
      experienceVideoTargets[index] = localProgress * Math.max(clipDuration - 0.05, 0);
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

    experienceVideos.forEach((clip, index) => {
      const delta = experienceVideoTargets[index] - experienceVideoTimes[index];
      experienceVideoTimes[index] += delta * 0.2;
      if (clip.readyState >= 1 && Math.abs(clip.currentTime - experienceVideoTimes[index]) > 0.025) {
        clip.currentTime = experienceVideoTimes[index];
      }
    });

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
    experienceVideos.forEach((clip) => clip.play().then(() => clip.pause()).catch(() => {}));
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
