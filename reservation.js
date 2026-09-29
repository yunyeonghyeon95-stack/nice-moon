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
  let current = 0;

  const pad = (number) => String(number).padStart(2, '0');

  function validateStep() {
    if (current === 1) {
      const checked = form.querySelectorAll('input[name="experience"]:checked').length > 0;
      experienceError.classList.toggle('is-visible', !checked);
      return checked;
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
      ['CABIN & STAY', data.get('cabin') || '—'],
      ['PASSENGER', data.get('name') || '—'],
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

  const today = new Date();
  today.setDate(today.getDate() + 1);
  form.elements.departure.min = today.toISOString().slice(0, 10);
  updateStep();
})();
