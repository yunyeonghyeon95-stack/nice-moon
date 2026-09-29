(() => {
  const form = document.querySelector('#reservationForm');
  const steps = [...document.querySelectorAll('.form-step')];
  const nextButton = document.querySelector('#nextButton');
  const backButton = document.querySelector('#backButton');
  const actions = document.querySelector('#formActions');
  const stepNumber = document.querySelector('#stepNumber');
  const progressBar = document.querySelector('#progressBar');
  const summary = document.querySelector('#summary');
  const success = document.querySelector('#success');
  const experienceError = document.querySelector('#experienceError');
  const genderSelect = document.querySelector('#genderSelect');
const maleSuitField = document.querySelector('#maleSuitField');
const femaleShoeField = document.querySelector('#femaleShoeField');
const suitSize = document.querySelector('#suitSize');
const shoeSize = document.querySelector('#shoeSize');
  const massageChoice = form.querySelector('input[value="Lunar Massage Lounge"]');
  const massageCourseField = document.querySelector('#massageCourseField');
  const massageCourse = document.querySelector('#massageCourse');
  const spaceTraffic = document.querySelector('#spaceTraffic');
  let current = 0;

  const pad = (number) => String(number).padStart(2, '0');

  function validateStep() {
    if (current === 1) {
      const checked = form.querySelectorAll('input[name="experience"]:checked').length > 0;
      experienceError.classList.toggle('is-visible', !checked);
      if (!checked) return false;
      if (massageChoice.checked && !massageCourse.value) {
        massageCourse.reportValidity();
        return false;
      }
      return true;
    }

    const fields = [...steps[current].querySelectorAll('input[required], select[required], textarea[required]')];
    const invalid = fields.find((field) => !field.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      return false;
    }
    return true;
  }

  function updateStep() {
    steps.forEach((step, index) => step.classList.toggle('is-active', index === current));
    stepNumber.textContent = pad(current + 1);
    progressBar.style.transform = `scaleX(${(current + 1) / steps.length})`;
    backButton.style.visibility = current === 0 ? 'hidden' : 'visible';
    nextButton.querySelector('span').textContent = current === steps.length - 1 ? 'REQUEST MY JOURNEY' : 'NEXT STEP';
    window.scrollTo({ top: document.querySelector('.booking-panel').offsetTop, behavior: 'smooth' });
  }

  function buildSummary() {
    const data = new FormData(form);
    const experiences = data.getAll('experience').join(' · ');
    const rows = [
      ['DEPARTURE', data.get('departure') || '—'],
      ['PASSENGERS', data.get('passengers') || '—'],
      ['EXPERIENCE', experiences || '—'],
      ['MASSAGE COURSE', data.get('massageCourse') || '선택 안 함'],
      ['CABIN & STAY', data.get('cabin') || '—'],
      ['PASSENGER', data.get('name') || '—'],
      [
  'GENDER / FIT',
  `${data.get('gender') || '—'} · ${
    data.get('gender') === '남성'
      ? data.get('suitSize') || '—'
      : data.get('gender') === '여성'
        ? data.get('shoeSize') || '—'
        : '—'
  }`
],
      ['CONTACT', `${data.get('phone') || '—'} · ${data.get('email') || '—'}`]
    ];
    summary.innerHTML = rows.map(([title, value]) => `<div><dt>${title}</dt><dd>${value}</dd></div>`).join('');
  }

  nextButton.addEventListener('click', () => {
    if (!validateStep()) return;
    if (current < steps.length - 1) {
      current += 1;
      if (current === steps.length - 1) buildSummary();
      updateStep();
      return;
    }
    steps[current].classList.remove('is-active');
    actions.style.display = 'none';
    document.querySelector('.progress-head').style.opacity = '0';
    success.classList.add('is-active');
  });

  backButton.addEventListener('click', () => {
    if (current === 0) return;
    current -= 1;
    updateStep();
  });

  function toggleMassageCourse() {
    const isSelected = massageChoice.checked;
    massageCourseField.classList.toggle('is-visible', isSelected);
    massageCourse.required = isSelected;
    if (!isSelected) massageCourse.value = '';
  }

  massageChoice.addEventListener('change', toggleMassageCourse);
  function updateGenderField() {
  const isMale = genderSelect.value === '남성';
  const isFemale = genderSelect.value === '여성';

  maleSuitField.hidden = !isMale;
  femaleShoeField.hidden = !isFemale;

  suitSize.required = isMale;
  shoeSize.required = isFemale;

  if (!isMale) {
    suitSize.value = '';
  }

  if (!isFemale) {
    shoeSize.value = '';
  }
}

genderSelect.addEventListener('change', updateGenderField);

  function createSpacecraft() {
    const ship = document.createElement('span');
    ship.className = 'mini-ship';
    ship.innerHTML = '<i></i>';
    ship.style.setProperty('--ship-y', `${8 + Math.random() * 62}%`);
    ship.style.setProperty('--ship-size', `${42 + Math.random() * 66}px`);
    ship.style.setProperty('--ship-scale', (0.55 + Math.random() * 0.75).toFixed(2));
    ship.style.setProperty('--ship-duration', `${4.8 + Math.random() * 7.2}s`);
    ship.style.setProperty('--ship-drift', `${-40 + Math.random() * 80}px`);
    ship.style.setProperty('--ship-angle', `${-5 + Math.random() * 10}deg`);
    ship.style.setProperty('--ship-opacity', (0.45 + Math.random() * 0.5).toFixed(2));
    ship.addEventListener('animationend', () => ship.remove(), { once: true });
    spaceTraffic.appendChild(ship);
  }

  function launchRandomFleet() {
    const count = 1 + Math.floor(Math.random() * 4);
    for (let index = 0; index < count; index += 1) {
      window.setTimeout(createSpacecraft, index * (260 + Math.random() * 900));
    }
    window.setTimeout(launchRandomFleet, 3000 + Math.random() * 5200);
  }

  const today = new Date();
  today.setDate(today.getDate() + 1);
  form.elements.departure.min = today.toISOString().slice(0, 10);
  toggleMassageCourse();
  updateGenderField();
  updateStep();
  window.setTimeout(launchRandomFleet, 700);
})();
