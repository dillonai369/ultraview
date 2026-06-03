/* Ultra View — shared interactions */
document.addEventListener('DOMContentLoaded', function () {

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () { links.classList.toggle('open'); });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  /* Before / After sliders (drag the handle) */
  document.querySelectorAll('.ba').forEach(function (ba) {
    var after = ba.querySelector('.after');
    var divider = ba.querySelector('.divider');
    var handle = ba.querySelector('.handle');
    function setPos(pct) {
      pct = Math.max(2, Math.min(98, pct));
      after.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
      divider.style.left = pct + '%';
      handle.style.left = pct + '%';
    }
    function fromEvent(e) {
      var rect = ba.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      setPos((x / rect.width) * 100);
    }
    var dragging = false;
    ba.addEventListener('mousedown', function (e) { dragging = true; fromEvent(e); });
    window.addEventListener('mousemove', function (e) { if (dragging) fromEvent(e); });
    window.addEventListener('mouseup', function () { dragging = false; });
    ba.addEventListener('touchstart', function (e) { dragging = true; fromEvent(e); }, {passive:true});
    ba.addEventListener('touchmove', function (e) { if (dragging) fromEvent(e); }, {passive:true});
    ba.addEventListener('touchend', function () { dragging = false; });
    setPos(50);
  });

  /* Quote form -> opens email with prefilled details (placeholder until a backend/Formspree is connected) */
  var form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var subject = encodeURIComponent('Window Cleaning Quote Request — ' + (f.name.value || 'New lead'));
      var body = encodeURIComponent(
        'Name: ' + f.name.value +
        '\nPhone: ' + f.phone.value +
        '\nEmail: ' + (f.email ? f.email.value : '') +
        '\nAddress / Town: ' + (f.address ? f.address.value : '') +
        '\nService: ' + (f.service ? f.service.value : '') +
        '\n\nDetails:\n' + (f.message ? f.message.value : '')
      );
      // TODO: replace with the business email once set up (e.g. hello@ultraview.today)
      window.location.href = 'mailto:hello@ultraview.today?subject=' + subject + '&body=' + body;
      var ok = document.querySelector('.form-ok');
      if (ok) { ok.style.display = 'block'; }
    });
  }

  /* Footer year */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* Reveal-on-scroll: fade/slide elements in as they enter the viewport */
  var revealSel = '.svc-card, .card, .price-card, .step, .ba, .owner, .quote, ' +
                  '.feature-text, .feature > img, .deal, .town, .faq details, ' +
                  'section > .wrap.center, .contact-info, .form';
  var items = Array.prototype.slice.call(document.querySelectorAll(revealSel));
  // Don't hide anything inside the hero (it has its own entrance animation)
  items = items.filter(function (el) { return !el.closest('.hero'); });

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    items.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var el = e.target;
          // small stagger for groups of sibling cards
          var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
          el.style.transitionDelay = Math.min(sibs, 6) * 70 + 'ms';
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* Header gains a shadow once the page is scrolled */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 12); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
});
