(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var navToggle = document.getElementById('nav-toggle');

  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  navToggle.addEventListener('click', function () {
    var isOpen = header.classList.toggle('nav-open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.querySelectorAll('.main-nav a').forEach(function (link) {
    link.addEventListener('click', function () {
      header.classList.remove('nav-open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Highlight the current page in nav (each page's header markup is
  // copy-pasted, so this avoids hand-maintaining an active class per file)
  var currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    var linkPage = link.getAttribute('href').split('#')[0] || 'index.html';
    if (linkPage === currentPage) {
      link.classList.add('is-active');
    }
  });

  // Scroll-triggered reveal animations
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Contact form — working prototype only, not yet wired to a live inbox
  // (destination CRM/integration to be decided; likely GoHighLevel)
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.classList.add('is-submitted');
    });
  }
})();
