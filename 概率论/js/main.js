// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
  initWatermark();
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

// ===== 水印 =====
function initWatermark() {
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">'
    + '<text x="160" y="105" text-anchor="middle" dominant-baseline="middle"'
    + ' font-family="sans-serif" font-size="22" fill="#000"'
    + ' transform="rotate(-25, 160, 100)">\u8463\u514b\u52e4</text>'
    + '</svg>';
  var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  var style = document.createElement('style');
  style.textContent = 'body::after{content:"";position:fixed;top:0;left:0;right:0;bottom:0;'
    + 'background:url(' + url + ') repeat;'
    + 'pointer-events:none;z-index:9999;opacity:0.05;}';
  document.head.appendChild(style);
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
