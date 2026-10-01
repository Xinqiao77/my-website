/* ==========================================================================
   Assisi Care — site JavaScript (no frameworks)
   --------------------------------------------------------------------------
   1. Mobile menu (hamburger button)
   2. Dropdown menus in the navigation
   3. Header shadow when the page is scrolled
   4. Current year in the footer
   5. Publications filter
   6. Forms: contact form validation + newsletter
   ========================================================================== */

/* --------------------------------------------------------------------------
   FORM SETTINGS — the forms are not connected to an email service yet.
   To make them send messages, create a free form endpoint (for example at
   https://formspree.io) and paste its URL between the quotes below.
   -------------------------------------------------------------------------- */
const FORM_ENDPOINT = '';            // e.g. 'https://formspree.io/f/abcdwxyz'
const NEWSLETTER_ENDPOINT = '';      // can be the same or a different endpoint
const CONTACT_EMAIL = 'contact@example.com'; // TODO: replace with the real address

// The script tag uses "defer", so the page is fully built when this runs.
setupMobileMenu();
setupDropdowns();
setupHeaderShadow();
setupFooterYear();
setupPublicationFilter();
setupContactForm();
setupNewsletterForms();


/* 1. MOBILE MENU
   ========================================================================== */
function setupMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.querySelector('.menu-toggle__label').textContent = 'Close';
    nav.classList.add('is-open');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('.menu-toggle__label').textContent = 'Menu';
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }

  toggle.addEventListener('click', function () {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Escape closes the menu and puts focus back on the button
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });

  // Close the menu after a link is chosen (useful for links to #sections)
  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) closeMenu();
  });

  // If the window is widened to desktop size, reset the mobile menu
  const desktop = window.matchMedia('(min-width: 1024px)');
  desktop.addEventListener('change', function (event) {
    if (event.matches) closeMenu();
  });
}


/* 2. DROPDOWN MENUS
   Each dropdown is a <button> that shows or hides the list after it.
   ========================================================================== */
function setupDropdowns() {
  const buttons = document.querySelectorAll('.submenu-toggle');

  function closeAll(except) {
    buttons.forEach(function (button) {
      if (button !== except) setDropdown(button, false);
    });
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      closeAll(button);
      setDropdown(button, !isOpen);
    });
  });

  // Escape closes an open dropdown and returns focus to its button
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    buttons.forEach(function (button) {
      if (button.getAttribute('aria-expanded') === 'true') {
        setDropdown(button, false);
        button.focus();
      }
    });
  });

  // Clicking anywhere outside the navigation closes dropdowns
  document.addEventListener('click', function (event) {
    if (!event.target.closest('.nav-list')) closeAll();
  });

  // On desktop, moving keyboard focus out of a dropdown closes it
  document.querySelectorAll('.has-submenu').forEach(function (item) {
    item.addEventListener('focusout', function (event) {
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
      if (isDesktop && !item.contains(event.relatedTarget)) {
        setDropdown(item.querySelector('.submenu-toggle'), false);
      }
    });
  });
}

function setDropdown(button, open) {
  const menu = document.getElementById(button.getAttribute('aria-controls'));
  button.setAttribute('aria-expanded', open ? 'true' : 'false');
  menu.hidden = !open;
}


/* 3. HEADER SHADOW
   ========================================================================== */
function setupHeaderShadow() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function update() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
}


/* 4. FOOTER YEAR
   ========================================================================== */
function setupFooterYear() {
  document.querySelectorAll('[data-current-year]').forEach(function (element) {
    element.textContent = new Date().getFullYear();
  });
}


/* 5. PUBLICATIONS FILTER
   Buttons have data-filter="all|paper|poster|patent"; list items have
   data-type with the same values.
   ========================================================================== */
function setupPublicationFilter() {
  const bar = document.querySelector('.filter-bar');
  if (!bar) return;

  const buttons = bar.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.pub');
  const status = document.getElementById('filter-status');

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      const filter = button.dataset.filter;
      let shown = 0;

      buttons.forEach(function (other) {
        other.setAttribute('aria-pressed', other === button ? 'true' : 'false');
      });

      items.forEach(function (item) {
        const match = filter === 'all' || item.dataset.type === filter;
        item.hidden = !match;
        if (match) shown++;
      });

      // Announce the result to screen reader users
      if (status) status.textContent = 'Showing ' + shown + ' item' + (shown === 1 ? '' : 's') + '.';
    });
  });
}


/* 6. FORMS
   ========================================================================== */
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = form.querySelector('.form-status');

  // Pre-select the inquiry type from the link, e.g. contact.html?type=investor
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  const select = form.querySelector('#inquiry');
  if (type && select.querySelector('option[value="' + CSS.escape(type) + '"]')) {
    select.value = type;
  }

  // Check a field as soon as the visitor leaves it
  form.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('blur', function () {
      if (field.hasAttribute('aria-invalid')) validateField(field);
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Validate every required field and focus the first problem
    const fields = form.querySelectorAll('[required]');
    let firstInvalid = null;
    fields.forEach(function (field) {
      if (!validateField(field) && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      showStatus(status, 'error', 'Please fix the highlighted fields and try again.');
      firstInvalid.focus();
      return;
    }

    // Bots fill in the hidden "website" field; people never see it
    if (form.querySelector('[name="website"]').value) return;

    sendForm(form, FORM_ENDPOINT, status,
      'Thank you — your message has been sent. We usually reply within two business days.');
  });
}

// Shows or clears the error message under one field. Returns true if valid.
function validateField(field) {
  const error = document.getElementById(field.id + '-error');
  let message = '';

  if (field.validity.valueMissing) {
    message = field.type === 'checkbox'
      ? 'Please tick this box so we can reply to you.'
      : 'This field is required.';
  } else if (field.validity.typeMismatch && field.type === 'email') {
    message = 'Please enter a valid email address, like name@company.com.';
  }

  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (error) error.textContent = message;
  return !message;
}

function setupNewsletterForms() {
  document.querySelectorAll('.newsletter-form').forEach(function (form) {
    const status = form.querySelector('.form-status');
    const email = form.querySelector('input[type="email"]');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!email.checkValidity()) {
        showStatus(status, 'error', 'Please enter a valid email address.');
        email.focus();
        return;
      }
      sendForm(form, NEWSLETTER_ENDPOINT, status, 'Thanks for subscribing. Look out for our next update.');
    });
  });
}

// Sends a form to the endpoint, or explains that forms are not connected yet.
function sendForm(form, endpoint, status, successMessage) {
  if (!endpoint) {
    showStatus(status, 'info',
      'This form is not connected yet, so nothing was sent. Please email us at ' +
      CONTACT_EMAIL + ' instead.');
    return;
  }

  const button = form.querySelector('[type="submit"]');
  button.disabled = true;

  fetch(endpoint, {
    method: 'POST',
    body: new FormData(form),
    headers: { Accept: 'application/json' }
  })
    .then(function (response) {
      if (!response.ok) throw new Error('Request failed');
      form.reset();
      showStatus(status, 'success', successMessage);
    })
    .catch(function () {
      showStatus(status, 'error',
        'Sorry, something went wrong. Please try again or email us at ' + CONTACT_EMAIL + '.');
    })
    .finally(function () {
      button.disabled = false;
    });
}

function showStatus(element, kind, message) {
  if (!element) return;
  element.className = 'form-status form-status--' + kind;
  element.textContent = message;
}
