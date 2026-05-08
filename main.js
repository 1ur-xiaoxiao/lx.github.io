/**
 * main.js — Data Mining Course Website
 * Main initialization and interaction script.
 *
 * Handles: hero canvas animation, scroll reveal, nav highlighting,
 * side-dot navigation, code copy buttons, dropdown menus,
 * chapter entrance animations, and lazy-loaded visualizations.
 */

(function () {
  'use strict';

  /* ================================================================
     1. DOMContentLoaded — kick off every initializer
     ================================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    initHeroCanvas();
    initScrollReveal();
    initNavHighlight();
    initSideDots();
    initCodeCopy();
    initDropdown();
    initChapterAnimations();
    initVizLazyLoad();
  });

  /* ================================================================
     2. initHeroCanvas — animated floating-math-formulas background
     ================================================================ */
  function initHeroCanvas() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    // Create and insert the canvas
    var canvas = document.createElement('canvas');
    canvas.id = 'hero-canvas';
    // Position behind hero content
    canvas.style.cssText =
      'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    hero.insertBefore(canvas, hero.firstChild);

    var ctx = canvas.getContext('2d');

    // Formulas to float around
    var formulas = [
      'w* = (X^TX)^{-1}X^Ty',
      'P(y|x) = \u03C3(w^Tx)',
      'H(P) = -\u03A3p log p',
      'margin = 2/||w||',
      '\u03B3_{ik} = \u03C0_k N(x|\u03BC_k,\u03A3_k)',
      'L = \u03A3 exp(-yf(x))',
      "K(x,x') = exp(-\u03B3||x-x'||\u00B2)",
      "Q(\u03B8|\u03B8') = E[log P(X,Z|\u03B8)]",
      'Gini = 1 - \u03A3p_k\u00B2',
      'f(x) = sign(w^Tx+b)',
    ];

    // Particle pool
    var particles = [];
    var PARTICLE_COUNT = 18; // number of visible formulas at any time

    // Resize canvas to fill the hero container
    function resize() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Create a single particle with randomized properties
    function spawnParticle() {
      var fontSize = 13 + Math.random() * 10; // 13-23 px
      return {
        text: formulas[Math.floor(Math.random() * formulas.length)],
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, // slow drift
        vy: (Math.random() - 0.5) * 0.25,
        opacity: 0.08 + Math.random() * 0.12, // ~0.08-0.20
        fontSize: fontSize,
      };
    }

    // Seed the initial pool
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(spawnParticle());
    }

    // Animation loop
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -200) p.x = canvas.width + 100;
        if (p.x > canvas.width + 200) p.x = -100;
        if (p.y < -50) p.y = canvas.height + 30;
        if (p.y > canvas.height + 50) p.y = -30;

        // Draw
        ctx.globalAlpha = p.opacity;
        ctx.font = p.fontSize + 'px "Courier New", monospace';
        ctx.fillStyle = '#8884d8';
        ctx.fillText(p.text, p.x, p.y);
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  /* ================================================================
     3. initScrollReveal — IntersectionObserver for .reveal elements
     ================================================================ */
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          var el = entry.target;
          el.classList.add('visible');

          // Staggered children: elements with .stagger get sequential delays
          var staggerChildren = el.querySelectorAll('.stagger');
          if (staggerChildren.length) {
            staggerChildren.forEach(function (child, index) {
              child.style.transitionDelay = index * 0.12 + 's';
              child.classList.add('visible');
            });
          }

          // Once revealed, stop observing
          observer.unobserve(el);
        });
      },
      { threshold: 0.1 }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ================================================================
     4. initNavHighlight — scrollspy for navigation and side-dots
     ================================================================ */
  function initNavHighlight() {
    // Collect all navigable sections
    var sectionIds = [
      'intro', 'outline', 'concepts', 'tools',
      'ch02', 'ch03', 'ch04', 'ch05', 'ch06',
      'ch07', 'ch08', 'ch09', 'ch10', 'ch11',
    ];

    var sections = [];
    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) sections.push({ id: id, el: el });
    });

    if (!sections.length) return;

    // Throttled scroll handler
    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(function () {
        var scrollY = window.scrollY;
        var viewH = window.innerHeight;
        var currentId = '';

        // Find the section closest to the top of the viewport
        for (var i = sections.length - 1; i >= 0; i--) {
          var rect = sections[i].el.getBoundingClientRect();
          if (rect.top <= viewH * 0.35) {
            currentId = sections[i].id;
            break;
          }
        }

        // Update nav links
        var navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(function (link) {
          var href = link.getAttribute('href');
          if (href === '#' + currentId) {
            link.classList.add('active');
            link.style.color = '#6c63ff';
          } else {
            link.classList.remove('active');
            link.style.color = '';
          }
        });

        // Update side-dots
        var dots = document.querySelectorAll('.side-dots .dot-link');
        dots.forEach(function (dot) {
          var target = dot.getAttribute('data-target');
          if (target === currentId) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });

        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial call
  }

  /* ================================================================
     5. initSideDots — fixed dot navigation on the right side
     ================================================================ */
  function initSideDots() {
    var chapterIds = [
      'ch02', 'ch03', 'ch04', 'ch05', 'ch06',
      'ch07', 'ch08', 'ch09', 'ch10', 'ch11',
    ];

    // Labels for tooltips (Chinese short names)
    var labels = {
      ch02: '线性回归',
      ch03: 'K近邻',
      ch04: '朴素贝叶斯',
      ch05: '逻辑回归',
      ch06: '最大熵',
      ch07: '决策树',
      ch08: '感知机',
      ch09: 'SVM',
      ch10: 'EM算法',
      ch11: '提升方法',
    };

    // Only add dots if the corresponding sections actually exist
    var validIds = chapterIds.filter(function (id) {
      return document.getElementById(id);
    });
    if (!validIds.length) return;

    // Build the container
    var container = document.createElement('div');
    container.className = 'side-dots';
    container.style.cssText =
      'position:fixed;right:24px;top:50%;transform:translateY(-50%);' +
      'z-index:90;display:flex;flex-direction:column;gap:12px;';

    validIds.forEach(function (id) {
      var dot = document.createElement('a');
      dot.className = 'dot-link';
      dot.setAttribute('data-target', id);
      dot.setAttribute('title', labels[id] || id);
      dot.href = '#' + id;
      dot.style.cssText =
        'display:block;width:10px;height:10px;border-radius:50%;' +
        'background:rgba(108,99,255,.3);border:2px solid transparent;' +
        'transition:all .3s;cursor:pointer;text-decoration:none;';
      container.appendChild(dot);
    });

    document.body.appendChild(container);

    // Inject minimal CSS for the active state
    var style = document.createElement('style');
    style.textContent =
      '.side-dots .dot-link.active{' +
      'background:#6c63ff;border-color:#6c63ff;' +
      'box-shadow:0 0 8px rgba(108,99,255,.5);transform:scale(1.3);}' +
      '.side-dots .dot-link:hover{' +
      'background:rgba(108,99,255,.6);transform:scale(1.2);}';
    document.head.appendChild(style);
  }

  /* ================================================================
     6. initCodeCopy — add copy buttons to code blocks
     ================================================================ */
  function initCodeCopy() {
    var codeBlocks = document.querySelectorAll('.ch-code pre');
    if (!codeBlocks.length) return;

    codeBlocks.forEach(function (pre) {
      // Make the pre container relative so we can position the button
      pre.style.position = 'relative';

      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = '复制';
      btn.style.cssText =
        'position:absolute;top:8px;right:8px;padding:4px 12px;' +
        'font-size:.78rem;border-radius:6px;border:1px solid rgba(108,99,255,.3);' +
        'background:rgba(108,99,255,.12);color:#6c63ff;cursor:pointer;' +
        'transition:all .2s;';

      btn.addEventListener('mouseenter', function () {
        btn.style.background = 'rgba(108,99,255,.25)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.background = 'rgba(108,99,255,.12)';
      });

      btn.addEventListener('click', function () {
        var text = pre.textContent || pre.innerText;

        // Modern clipboard API with fallback
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(showCopied);
        } else {
          // Fallback for older browsers
          var textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.cssText = 'position:fixed;left:-9999px;';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          showCopied();
        }

        function showCopied() {
          btn.textContent = '已复制!';
          btn.style.background = 'rgba(108,99,255,.3)';
          setTimeout(function () {
            btn.textContent = '复制';
            btn.style.background = 'rgba(108,99,255,.12)';
          }, 2000);
        }
      });

      pre.appendChild(btn);
    });
  }

  /* ================================================================
     7. initDropdown — chapter dropdown menu in nav
     ================================================================ */
  function initDropdown() {
    var dropdown = document.querySelector('.dropdown');
    if (!dropdown) return;

    var toggle = dropdown.querySelector('.dropdown-toggle') || dropdown.querySelector('a');

    // Click to toggle
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    // Close on click outside
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  }

  /* ================================================================
     8. initChapterAnimations — per-chapter entrance animations
     ================================================================ */
  function initChapterAnimations() {
    var chapters = document.querySelectorAll('.ch');
    if (!chapters.length) return;

    // Initially hide chapter children for staggered entrance
    chapters.forEach(function (ch) {
      var children = ch.children;
      for (var i = 0; i < children.length; i++) {
        children[i].style.opacity = '0';
        children[i].style.transform = 'translateY(18px)';
        children[i].style.transition =
          'opacity 0.5s ease-out, transform 0.5s ease-out';
      }
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          var ch = entry.target;
          var children = ch.children;

          // Stagger each child's entrance
          for (var i = 0; i < children.length; i++) {
            (function (child, delay) {
              setTimeout(function () {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
              }, delay);
            })(children[i], i * 100); // 100ms stagger
          }

          observer.unobserve(ch);
        });
      },
      { threshold: 0.15 }
    );

    chapters.forEach(function (ch) {
      observer.observe(ch);
    });
  }

  /* ================================================================
     9. initVizLazyLoad — lazy-load visualization scripts per section
     ================================================================ */
  function initVizLazyLoad() {
    // Map section IDs to the global viz function names defined in viz.js
    var vizMap = {
      ch02: 'vizLinearRegression',
      ch03: 'vizKNN',
      ch04: 'vizNaiveBayes',
      ch05: 'vizLogisticRegression',
      ch06: 'vizMaximumEntropy',
      ch07: 'vizDecisionTree',
      ch08: 'vizPerceptron',
      ch09: 'vizSVM',
      ch10: 'vizEM',
      ch11: 'vizBoosting',
    };

    // Track which visualizations have already been initialized
    var initialized = {};

    // Collect all .ch-viz containers that have a matching viz function
    var vizContainers = [];
    Object.keys(vizMap).forEach(function (sectionId) {
      var section = document.getElementById(sectionId);
      if (!section) return;

      var container = section.querySelector('.ch-viz');
      if (!container) return;

      vizContainers.push({
        el: container,
        sectionId: sectionId,
        fnName: vizMap[sectionId],
      });
    });

    if (!vizContainers.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          var container = entry.target;
          var sectionId = container.getAttribute('data-viz-section');
          var fnName = container.getAttribute('data-viz-fn');

          // Skip if already loaded or function doesn't exist
          if (initialized[sectionId]) return;
          if (typeof window[fnName] !== 'function') return;

          initialized[sectionId] = true;

          try {
            window[fnName](container);
          } catch (err) {
            console.warn('[viz] Error calling ' + fnName + ':', err);
          }

          observer.unobserve(container);
        });
      },
      { threshold: 0.1 }
    );

    vizContainers.forEach(function (item) {
      // Store metadata as data attributes so the observer callback can read them
      item.el.setAttribute('data-viz-section', item.sectionId);
      item.el.setAttribute('data-viz-fn', item.fnName);
      observer.observe(item.el);
    });
  }
})();
