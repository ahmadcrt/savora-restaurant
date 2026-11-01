/* Savora — all interactivity. Vanilla JS, no dependencies. */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  // Images come from Unsplash; if one fails, swap in an inline burgundy placeholder (no broken images).
  const FALLBACK = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"><rect width="4" height="3" fill="#5e1424"/><text x="2" y="1.7" fill="#d9b98a" font-size=".4" text-anchor="middle" font-family="Georgia">Savora</text></svg>');
  const url = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
  const setImg = (img, id, w) => { img.onerror = () => { img.onerror = null; img.src = FALLBACK; }; img.src = url(id, w); };
  document.querySelectorAll('img[data-src]').forEach(i => setImg(i, i.dataset.src, i.dataset.w));
  const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };

  /* Mobile navigation */
  const burger = $('.burger'), links = $('#links');
  const closeNav = () => { links.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => burger.setAttribute('aria-expanded', links.classList.toggle('open')));
  links.addEventListener('click', e => e.target.closest('a') && closeNav());

  /* Menu data (fictional prices) */
  const MENU = [
    ['Starters','1540189549336-e6e99c3679fe','Burrata & Roasted Beet','Whipped burrata, honey-roast beets, pistachio, basil oil.',14],
    ['Starters','1546069901-ba9599a7e63c','Garden Harvest Bowl','Shaved seasonal vegetables, citrus dressing, toasted seeds.',12],
    ['Starters','1476224203421-9ac39bcb3327','Charred Octopus','Smoked paprika, crushed potato, lemon, parsley.',17],
    ['Main Courses','1544025162-d76694265947','Wine-Braised Short Rib','Eight-hour braise, truffle mash, red wine jus.',34],
    ['Main Courses','1467003909585-2f8a72700288','Pan-Seared Salmon','Crisp skin, fennel purée, saffron beurre blanc.',29],
    ['Main Courses','1565299624946-b28f40a0ae38','Wood-Fired Margherita','San Marzano tomato, fior di latte, basil.',21],
    ['Desserts','1551218808-94e220e084d2','Dark Chocolate Fondant','Molten centre, vanilla bean cream, sea salt.',12],
    ['Desserts','1565958011703-44f9829ba187','Berry Celebration Cake','Layered sponge, mascarpone, macerated berries.',11],
    ['Desserts','1551024601-bec78aea704b','Warm Sugared Doughnuts','Cinnamon sugar, salted caramel dip.',10],
    ['Drinks','1470337458703-46ad1756a187','Savora Negroni','Gin, vermouth, bitter orange, a single large cube.',13],
    ['Drinks','1551024709-8f23befc6f87','Garden Spritz','Elderflower, cucumber, sparkling wine.',12],
    ['Drinks','1514362545857-3bc16c4c7d1b','Cellar Red, by the glass','Ask your server for tonight\'s pour.',11]
  ];
  const CHEF = [
    ['1544025162-d76694265947','Wine-Braised Short Rib','Our signature: slow, deep and deeply comforting.',34],
    ['1467003909585-2f8a72700288','Pan-Seared Salmon','Bright, buttery, finished at the table.',29],
    ['1551218808-94e220e084d2','Dark Chocolate Fondant','Order it with the first course; it takes 15 minutes.',12]
  ];
  const GALLERY = [['1414235077428-338989a2e8c0','Set table'],['1517248135467-4c7edcad34c4','Dining room'],['1544025162-d76694265947','Short rib'],['1551218808-94e220e084d2','Chocolate fondant'],['1470337458703-46ad1756a187','Negroni'],['1565299624946-b28f40a0ae38','Margherita'],['1467003909585-2f8a72700288','Salmon'],['1540189549336-e6e99c3679fe','Burrata'],['1476224203421-9ac39bcb3327','Octopus'],['1565958011703-44f9829ba187','Berry cake']];
  const price = n => `$${n}`;

  /* Menu rendering + category filter */
  const grid = $('#menuGrid'), bar = $('.filters');
  const cats = ['All', ...new Set(MENU.map(m => m[0]))];
  cats.forEach((c, i) => bar.append(el(`<button role="tab" aria-selected="${i === 0}" data-cat="${c}">${c}</button>`)));
  function renderMenu(cat) {
    grid.replaceChildren();
    MENU.filter(m => cat === 'All' || m[0] === cat).forEach(([, id, name, desc, p]) => {
      const card = el(`<article class="item"><img alt="${name}" width="500" height="375" loading="lazy"><div><h3>${name}<span>${price(p)}</span></h3><p>${desc}</p></div></article>`);
      setImg($('img', card), id, 500); grid.append(card);
    });
  }
  bar.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    bar.querySelectorAll('button').forEach(x => x.setAttribute('aria-selected', x === b));
    renderMenu(b.dataset.cat);
  });
  renderMenu('All');

  /* Chef's special */
  CHEF.forEach(([id, name, desc, p]) => {
    const c = el(`<article><img alt="${name}" width="600" height="800" loading="lazy"><h3>${name}<span>${price(p)}</span></h3><p>${desc}</p></article>`);
    setImg($('img', c), id, 600); $('#chefGrid').append(c);
  });

  /* Gallery + lightbox */
  const lb = $('#lb'), lbImg = $('img', lb); let cur = 0, opener = null;
  GALLERY.forEach(([id, alt], i) => {
    const b = el(`<button aria-label="Enlarge photo: ${alt}"><img alt="${alt}" loading="lazy"></button>`);
    setImg($('img', b), id, 600); b.addEventListener('click', () => open(i, b)); $('#galleryGrid').append(b);
  });
  function show(i) { cur = (i + GALLERY.length) % GALLERY.length; lbImg.alt = GALLERY[cur][1]; lbImg.onerror = () => { lbImg.onerror = null; lbImg.src = FALLBACK; }; lbImg.src = url(GALLERY[cur][0], 1400); }
  function open(i, b) { opener = b; show(i); lb.hidden = false; document.body.style.overflow = 'hidden'; $('.lb-close').focus(); }
  function close() { lb.hidden = true; document.body.style.overflow = ''; opener && opener.focus(); }
  $('.lb-close').onclick = close; $('.prev').onclick = () => show(cur - 1); $('.next').onclick = () => show(cur + 1);
  lb.addEventListener('click', e => e.target === lb && close());
  document.addEventListener('keydown', e => { if (lb.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });

  /* Reservation form: validation + demo confirmation */
  const form = $('#resForm'), ok = $('#resOk');
  form.date.min = new Date().toISOString().slice(0, 10);
  const rules = {
    name: v => v.trim().length >= 2 || 'Enter your full name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
    phone: v => /^[+\d][\d\s().-]{6,}$/.test(v.trim()) || 'Enter a valid phone number.',
    date: v => (v && v >= form.date.min) || 'Choose today or a future date.',
    time: v => !!v || 'Choose a time.', guests: v => !!v || 'Choose the number of guests.'
  };
  const check = f => { const r = rules[f.name](f.value), box = f.closest('label'); box.classList.toggle('bad', r !== true); $('small', box).textContent = r === true ? '' : r; return r === true; };
  Object.keys(rules).forEach(n => form[n].addEventListener('blur', () => check(form[n])));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const valid = Object.keys(rules).map(n => check(form[n])).every(Boolean);
    if (!valid) { form.querySelector('.bad input, .bad select').focus(); return; }
    const d = new Date(form.date.value + 'T00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    ok.textContent = `Demo confirmation: thank you, ${form.name.value.trim()}. A table for ${form.guests.value} on ${d} at ${form.time.value} would be requested. This is a portfolio demonstration — no real booking was made and no data was sent.`;
    ok.hidden = false; ok.focus(); form.reset();
  });
})();
