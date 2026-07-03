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

  /* Quote form -> submits to Web3Forms, which emails the lead to the business inbox */
  var form = document.getElementById('quoteForm');
  if (form) {
    var ok = form.querySelector('.form-ok');
    function showMsg(text, isError) {
      if (!ok) return;
      ok.textContent = text;
      ok.style.display = 'block';
      if (isError) {
        // soft amber notice (not alarming red) with a call-to-action fallback
        ok.style.background = '#fff6e6'; ok.style.borderColor = '#e0a63c'; ok.style.color = '#8a5a12';
      } else {
        // reset to the default green success styling from the stylesheet
        ok.style.background = ''; ok.style.borderColor = ''; ok.style.color = '';
      }
      ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      fetch(form.getAttribute('action'), {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (r) { return r.json(); })
        .then(function (json) {
          if (json && (json.success === true || json.success === 'true')) {
            showMsg("Thanks! We've got your request — we'll get right back to you. 🪟", false);
            form.reset();
          } else {
            showMsg('Sorry, something went wrong. Please call or text us at (708) 701-1906.', true);
          }
        })
        .catch(function () {
          showMsg('Sorry, something went wrong. Please call or text us at (708) 701-1906.', true);
        })
        .finally(function () { if (btn) { btn.disabled = false; btn.textContent = label; } });
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
