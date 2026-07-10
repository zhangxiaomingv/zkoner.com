// ── Mobile Nav Toggle ──
document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function() {
      navLinks.classList.toggle('open');
    });
  }

  // ── Dropdowns on mobile ──
  document.querySelectorAll('.nav-dropdown > a').forEach(function(link) {
    link.addEventListener('click', function(e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        this.parentElement.classList.toggle('open');
      }
    });
  });

  // ── FAQ toggle ──
  document.querySelectorAll('.faq-question').forEach(function(q) {
    q.addEventListener('click', function() {
      this.parentElement.classList.toggle('open');
    });
  });

  // ── Scroll Fade-in ──
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(function(el) {
    observer.observe(el);
  });
});
