// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initCollapsibles();
  initBackToTop();
  initActiveNav();
});

// ===== 移动端导航切换 =====
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
  });

  // 点击链接后自动关闭
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.textContent = '☰';
    });
  });
}

// ===== 可折叠内容块 =====
function initCollapsibles() {
  document.querySelectorAll('.collapsible-header').forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const isOpen = header.classList.toggle('open');
      body.classList.toggle('open', isOpen);

      // Re-typeset math when collapsible is opened
      // MathJax can't properly measure elements inside display:none,
      // so we must re-render after the content becomes visible.
      if (isOpen && window.MathJax) {
        if (MathJax.typesetPromise) {
          MathJax.typesetPromise([body]);
        } else {
          MathJax.startup.promise.then(function () {
            MathJax.typesetPromise([body]);
          });
        }
      }
    });
  });
}

// ===== 回到顶部按钮 =====
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== 高亮当前页面导航链接 =====
function initActiveNav() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage) {
      a.classList.add('active');
    }
  });
}
