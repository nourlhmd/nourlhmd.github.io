// Basic interactivity: mobile nav toggle, smooth scroll, active link highlight, year
document.addEventListener('DOMContentLoaded', function(){
  // Ensure the page always shows the presentation (home) on refresh / bfcache restore.
  function ensureShowHome(){
    try{
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      // Remove any hash in the URL so the browser doesn't jump to a section
      if(location.hash){
        history.replaceState(null, '', location.pathname + location.search);
      }
      // Scroll to top immediately and again shortly after to counteract browser behavior
      window.scrollTo(0,0);
      setTimeout(()=> window.scrollTo(0,0), 50);
    }catch(e){
      // silent fallback
    }
  }
  ensureShowHome();
  // Also cover bfcache / back-forward restores and the full load event
  window.addEventListener('pageshow', ensureShowHome);
  window.addEventListener('load', ensureShowHome);
  const nav = document.getElementById('site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelectorAll('.nav-link');
  const sideLinks = document.querySelectorAll('.top-nav .nav-link');

  // Mobile toggle
  toggle.addEventListener('click', ()=>{
    nav.classList.toggle('open');
    toggle.classList.toggle('open');
  });

  // Smooth scroll for internal links
  links.forEach(link=>{
    link.addEventListener('click', (e)=>{
      const href = link.getAttribute('href');
      if(href && href.startsWith('#')){
        e.preventDefault();
        const target = document.querySelector(href);
        if(target){
          const offset = (nav ? nav.getBoundingClientRect().height : 70) + 16; // dynamic offset from nav
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({top,behavior:'smooth'});
        }
        // close mobile nav after click
        if(nav.classList.contains('open')) nav.classList.remove('open');
      }
    });
  });

  // side-nav links should behave the same (smooth scroll)
  sideLinks.forEach(link=>{
    link.addEventListener('click', (e)=>{
      const href = link.getAttribute('href');
      if(href && href.startsWith('#')){
        e.preventDefault();
        const target = document.querySelector(href);
        if(target){
          const offset = (nav ? nav.getBoundingClientRect().height : 70) + 16;
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({top,behavior:'smooth'});
        }
      }
    });
  });

  // Scroll spy: highlight active nav link
  const sections = Array.from(document.querySelectorAll('main section'));
  function onScroll(){
    const scrollPos = window.scrollY + 80;
    let current = sections[0];
    for(const sec of sections){
      if(sec.offsetTop <= scrollPos) current = sec;
    }
    links.forEach(l=> l.classList.toggle('active', l.getAttribute('href') === '#'+current.id));
    sideLinks.forEach(l=> l.classList.toggle('active', l.getAttribute('href') === '#'+current.id));
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // set copyright year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Apply background images for project media from data-bg attribute (if set)
  const projectMedia = document.querySelectorAll('.project-media');
  projectMedia.forEach(pm => {
    const bg = pm.getAttribute('data-bg');
    if(bg && bg.trim() && bg.indexOf('path-to-image') === -1){
      pm.style.backgroundImage = `url('${bg}')`;
    }
  });

  // Language toggle: switch FR/EN, persist selection in localStorage
  const langToggle = document.getElementById('lang-toggle');
  function applyLang(lang){
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('data-lang', lang);
    try{ localStorage.setItem('site-lang', lang); }catch(e){/*ignore*/}
    if(langToggle){
      // update only the textual label inside the button so the icon remains
      const label = langToggle.querySelector('.lang-label');
      if(label) label.textContent = (lang === 'fr') ? 'EN' : 'FR';
    }
  }
  // initialize language from storage or existing html lang
  const storedLang = (function(){ try{ return localStorage.getItem('site-lang') }catch(e){return null} })();
  const initialLang = storedLang || document.documentElement.getAttribute('lang') || 'fr';
  applyLang(initialLang);
  if(langToggle){
    langToggle.addEventListener('click', ()=>{
      const cur = document.documentElement.getAttribute('data-lang') || 'fr';
      const next = cur === 'fr' ? 'en' : 'fr';
      applyLang(next);
    });
  }
});
