// Dark/light theme toggle (no persistence — some hosting/preview contexts
  // block localStorage; add it yourself if you want the choice to stick
  // once this is live on your own domain).
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const isLight = html.getAttribute('data-theme') === 'light';
    html.setAttribute('data-theme', isLight ? 'dark' : 'light');
    themeToggle.setAttribute('aria-pressed', String(isLight));
  });

// Mobile hamburger menu
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

// Scroll-reveal: fade+rise elements into view as they enter the viewport
  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el, i) => {
      el.style.setProperty('--stagger', `${(i % 3) * 90}ms`);
      el.classList.add('reveal-stagger');
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

// Active nav-link highlighting as sections scroll into view
  const navAnchors = [...document.querySelectorAll('.nav-links a, .mobile-menu a')];
  const sections = navAnchors
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if('IntersectionObserver' in window && sections.length){
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = '#' + entry.target.id;
        const links = navAnchors.filter(a => a.getAttribute('href') === id);
        if(entry.isIntersecting){
          navAnchors.forEach(a => a.classList.remove('active'));
          links.forEach(a => a.classList.add('active'));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => navObserver.observe(s));
  }

// Typing animation for the hero code snippet — respects reduced-motion preference
  const codeLines = [
    { html: '<span class="kw">public async</span> <span class="type">Task</span>&lt;<span class="type">Result</span>&gt; <span class="type">ReserveSlotAsync</span>(<span class="type">int</span> slotId)' },
    { html: '{' },
    { html: '&nbsp;&nbsp;<span class="kw">var</span> slot = <span class="kw">await</span> _db.Slots' },
    { html: '&nbsp;&nbsp;&nbsp;&nbsp;.FirstAsync(s => s.Id == slotId);' },
    { html: '' },
    { html: '&nbsp;&nbsp;<span class="cmt">// RowVersion enforces optimistic concurrency</span>' },
    { html: '&nbsp;&nbsp;slot.Status = <span class="type">BookingStatus</span>.Reserved;' },
    { html: '' },
    { html: '&nbsp;&nbsp;<span class="kw">try</span>' },
    { html: '&nbsp;&nbsp;{' },
    { html: '&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">await</span> _db.SaveChangesAsync();' },
    { html: '&nbsp;&nbsp;}' },
    { html: '&nbsp;&nbsp;<span class="kw">catch</span> (<span class="type">DbUpdateConcurrencyException</span>)' },
    { html: '&nbsp;&nbsp;{' },
    { html: '&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">return</span> <span class="type">Result</span>.Conflict(<span class="str">"Slot just taken."</span>);' },
    { html: '&nbsp;&nbsp;}' },
    { html: '}' },
  ];

  const target = document.getElementById('typedCode');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function renderStatic(){
    target.innerHTML = codeLines.map((l,i) =>
      `<span class="ln">${i+1}</span>${l.html || '&nbsp;'}`
    ).join('\n');
  }

  function typeCode(){
    let i = 0;
    function nextLine(){
      if(i >= codeLines.length){
        // hold, then loop
        setTimeout(() => { target.innerHTML=''; i=0; nextLine(); }, 2400);
        return;
      }
      const lineHtml = codeLines[i].html || '&nbsp;';
      const lnNum = `<span class="ln">${i+1}</span>`;
      target.innerHTML += lnNum + lineHtml + (i < codeLines.length-1 ? '\n' : '');
      i++;
      setTimeout(nextLine, 220);
    }
    nextLine();
  }

  if(reduceMotion){
    renderStatic();
  } else {
    typeCode();
  }
