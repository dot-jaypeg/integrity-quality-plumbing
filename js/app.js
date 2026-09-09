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

  // Gallery carousel
  document.querySelectorAll('.carousel-wrap').forEach(function (wrap) {
    var carousel = wrap.querySelector('.carousel');
    var track = carousel.querySelector('.carousel-track');
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-slide'));
    var dotsWrap = wrap.querySelector('.carousel-dots');
    var prevBtn = wrap.querySelector('.carousel-arrow.prev');
    var nextBtn = wrap.querySelector('.carousel-arrow.next');
    var index = 0;
    var timer;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function render() {
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('active', i === index); });
    }
    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
      resetAutoplay();
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }
    function resetAutoplay() {
      clearInterval(timer);
      timer = setInterval(next, 5000);
    }

    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);
    carousel.addEventListener('mouseenter', function () { clearInterval(timer); });
    carousel.addEventListener('mouseleave', resetAutoplay);

    var startX = null;
    carousel.addEventListener('pointerdown', function (e) { startX = e.clientX; });
    carousel.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var delta = e.clientX - startX;
      if (delta > 50) prev();
      else if (delta < -50) next();
      startX = null;
    });

    render();
    resetAutoplay();
  });

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
