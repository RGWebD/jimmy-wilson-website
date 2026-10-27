(() => {
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const menuLabel = document.querySelector('[data-menu-label]');

  const setMenuState = (isOpen) => {
    if (!menuToggle || !menu) return;
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menu.classList.toggle('is-open', isOpen);
    if (menuLabel) menuLabel.textContent = isOpen ? 'Close navigation' : 'Open navigation';
  };

  const closeMenu = () => {
    setMenuState(false);
  };

  menuToggle?.addEventListener('click', () => {
    const nextState = menuToggle.getAttribute('aria-expanded') !== 'true';
    setMenuState(nextState);
  });

  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 780) closeMenu();
  });
  document.addEventListener('click', (event) => {
    if (!menu?.classList.contains('is-open') || !(event.target instanceof Node)) return;
    if (!menu.contains(event.target) && !menuToggle?.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !menu?.classList.contains('is-open')) return;
    closeMenu();
    menuToggle?.focus();
  });

  const cards = [...document.querySelectorAll('[data-gallery] .project-card')];
  const filters = [...document.querySelectorAll('[data-filter]')];

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filters.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      cards.forEach((card) => {
        const categories = (card.dataset.category || '').split(' ');
        card.hidden = filter !== 'all' && !categories.includes(filter);
      });
    });
  });

  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImage = document.querySelector('[data-lightbox-image]');
  const lightboxCaption = document.querySelector('[data-lightbox-caption]');
  let currentCard = 0;

  const visibleCards = () => cards.filter((card) => !card.hidden);

  const showCard = (index) => {
    const available = visibleCards();
    if (!available.length || !lightboxImage || !lightboxCaption) return;
    currentCard = (index + available.length) % available.length;
    const card = available[currentCard];
    const sourceImage = card.querySelector('img');
    lightboxImage.src = card.dataset.image || sourceImage?.src || '';
    lightboxImage.alt = sourceImage?.alt || 'JW project photo';
    lightboxCaption.textContent = card.dataset.caption || '';
  };

  const openLightbox = (card) => {
    if (!lightbox) return;
    currentCard = visibleCards().indexOf(card);
    showCard(currentCard);
    if (typeof lightbox.showModal === 'function') {
      lightbox.showModal();
      document.body.classList.add('is-locked');
    }
  };

  const closeLightbox = () => {
    lightbox?.close();
    document.body.classList.remove('is-locked');
  };

  cards.forEach((card) => card.addEventListener('click', () => openLightbox(card)));
  document.querySelector('[data-lightbox-close]')?.addEventListener('click', closeLightbox);
  document.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => showCard(currentCard - 1));
  document.querySelector('[data-lightbox-next]')?.addEventListener('click', () => showCard(currentCard + 1));
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox?.addEventListener('close', () => document.body.classList.remove('is-locked'));
  document.addEventListener('keydown', (event) => {
    if (!lightbox?.open) return;
    if (event.key === 'ArrowLeft') showCard(currentCard - 1);
    if (event.key === 'ArrowRight') showCard(currentCard + 1);
  });

  document.querySelectorAll('[data-estimate-form]').forEach((estimateForm) => {
    const formNote = estimateForm.querySelector('[data-form-note]');
    estimateForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!estimateForm.reportValidity()) return;
      const formData = new FormData(estimateForm);
      const name = String(formData.get('name') || '').trim();
      const phone = String(formData.get('phone') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const reply = String(formData.get('reply') || '').trim();
      const project = String(formData.get('project') || '').trim();
      const zip = String(formData.get('zip') || '').trim();
      const location = String(formData.get('location') || '').trim();
      const timing = String(formData.get('timing') || '').trim();
      const details = String(formData.get('details') || '').trim();

      if (reply === 'Email' && !email) {
        if (formNote) {
          formNote.classList.add('is-error');
          formNote.textContent = 'Add an email address or choose call or text as the best way to reply.';
        }
        estimateForm.querySelector('[name="email"]')?.focus();
        return;
      }

      const message = [
        'Hi Jimmie, I found JW Painting & Flooring online and would like to request an estimate.',
        `Name: ${name}`,
        `Phone: ${phone}`,
        email ? `Email: ${email}` : '',
        `Best reply: ${reply}`,
        `Project: ${project}`,
        `ZIP: ${zip}`,
        location ? `Location: ${location}` : '',
        `Timing: ${timing}`,
        `Details: ${details}`
      ].filter(Boolean).join('\n');
      const smsUrl = `sms:+19042332110?body=${encodeURIComponent(message)}`;
      if (formNote) {
        formNote.classList.remove('is-error');
        formNote.textContent = 'Opening your messaging app now. Review the complete request, then press Send.';
      }
      window.location.href = smsUrl;
    });
  });

  document.querySelectorAll('[data-year]').forEach((item) => {
    item.textContent = String(new Date().getFullYear());
  });
})();
