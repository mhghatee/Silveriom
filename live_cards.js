/**
 * Silveriom Media Card System — Shared Reference Implementation v1.0
 * Include in every page that shows media/structure cards.
 * window.renderMediaCard(media, options) → HTML string
 * window.renderMediaShowcase(containerId, filterPageId, options) → load + render from DB
 */
(function () {

/* ── CSS injected once ─────────────────────────────────────────── */
const CSS = `
.media-showcase-card{background:rgba(13,22,45,.4);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:1.25rem;transition:all .3s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;position:relative;overflow:hidden;text-align:right;direction:rtl}
.media-showcase-card:hover{transform:translateY(-5px);border-color:rgba(182,255,0,.4);box-shadow:0 15px 35px rgba(0,0,0,.3),0 0 20px rgba(182,255,0,.1)}
.msc-img-wrapper{position:relative;border-radius:16px;overflow:hidden;margin-bottom:16px;height:220px;width:100%}
.msc-img-wrapper img{width:100%;height:100%;object-fit:cover;transition:transform .5s ease}
.media-showcase-card:hover .msc-img-wrapper img{transform:scale(1.05)}
.msc-code-badge{position:absolute;top:12px;right:12px;background:rgba(2,6,23,.85);backdrop-filter:blur(8px);border:1px solid #B6FF00;color:#B6FF00;padding:6px 12px;border-radius:50px;font-size:13px;font-weight:800;z-index:10}
.msc-status-badge{position:absolute;bottom:12px;left:12px;background:#00d287;color:#fff;padding:6px 14px;border-radius:50px;font-size:13px;font-weight:800;z-index:10;box-shadow:0 4px 12px rgba(0,210,135,.4)}
.msc-status-badge.active{background:#38bdf8;box-shadow:0 4px 12px rgba(56,189,248,.4)}
.msc-status-badge.reserved{background:#FF9500;box-shadow:0 4px 12px rgba(255,149,0,.4)}
.msc-location{color:#00d287;font-size:13px;font-weight:800;margin-bottom:8px;display:flex;align-items:center;gap:6px}
.msc-title{font-size:1.45rem;font-weight:900;color:#fff;margin-bottom:16px;line-height:1.4}
.msc-tariff-box{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;background:#0E1629;padding:14px 16px;border-radius:14px;border:1px solid rgba(204,255,0,.3)}
.msc-tariff-label{color:#94A3B8;font-size:13px;font-weight:600}
.msc-tariff-value{color:#B6FF00;font-weight:900;font-size:18px}
.msc-specs-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;background:#121A2F;padding:16px;border-radius:14px;font-size:13px;color:#CBD5E1;margin-bottom:24px}
.msc-specs-grid div{display:flex;align-items:center;gap:6px}
.msc-specs-grid div strong{color:#F8FAFC}
.msc-reserve-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;background:transparent;border:1px solid rgba(182,255,0,.5);color:#B6FF00;padding:14px;border-radius:14px;font-size:15px;font-weight:800;cursor:pointer;transition:all .3s ease;margin-top:auto;font-family:inherit}
.msc-reserve-btn:hover{background:#B6FF00;color:#020617;box-shadow:0 0 20px rgba(182,255,0,.3)}
.msc-reserve-btn.in-cart{background:rgba(204,255,0,.1);border-color:#B6FF00}
.msc-reserve-btn.in-cart:hover{background:#B6FF00;color:#020617}
`;
if (!document.getElementById('silveriom-card-css')) {
  const s = document.createElement('style');
  s.id = 'silveriom-card-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}

/* ── Venue map ─────────────────────────────────────────────────── */
const VENUE_MAP = {
  't10':'مجموعه T10 (آجودانیه)', 'ajudaniyeh':'مجموعه T10 (آجودانیه)',
  'arena':'مجموعه Arena (آزادی)', 'azadi':'مجموعه Arena (آزادی)',
  'iran-zamin':'مجموعه Iran Zamin (شهرک غرب)', 'shahrak':'مجموعه Iran Zamin (شهرک غرب)',
  'netra':'مجموعه Netra (لواسان)', 'lavasan':'مجموعه Netra (لواسان)',
  'asayesh':'مجموعه آسایش (ساری)', 'sari':'مجموعه آسایش (ساری)',
  'olympic':'مجموعه Olympic (کیش)',
  'enghelab':'مجموعه انقلاب (تهران)',
};

/* ── Icons ─────────────────────────────────────────────────────── */
const I = {
  loc:  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  dims: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>',
  prnt: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  plus: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
  chk:  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  cal:  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><path d="M3 10h18"/><path d="M16 19h6"/><path d="M19 16v6"/></svg>',
};

/* ── Core card renderer ────────────────────────────────────────── */
window.renderMediaCard = function (media, opts) {
  opts = opts || {};
  const btnMode = opts.btnMode || 'cart'; // 'cart' | 'reserve'

  const title   = media.title || media.name || 'بدون عنوان';
  const code    = media.code  || media.id   || 'SIL-000';
  const type    = media.type  || media.structureType || '';
  const venueId = media.venue || '';

  // Location text
  const location = (media.location && !VENUE_MAP[media.location])
    ? media.location
    : (VENUE_MAP[venueId] || media.location || '');

  // Absolute image URL
  let image = media.image || '/assets/placeholder_media.jpg';
  if (!image.startsWith('http')) {
    image = 'https://silveriom.ir/' + image.replace(/^(\.\.\/|\/)/, '');
  }

  const tariff    = media.tariff ? media.tariff + ' میلیون تومان' : 'تماس بگیرید';
  const dims      = media.dimensions || media.specs || 'نامشخص';
  const printType = media.print_type || 'وینیل/مش';

  let sClass = '', sText = 'قابل رزرو / اکران';
  if (media.status === 'reserved')    { sClass = 'reserved'; sText = 'رزرو شده'; }
  else if (media.status === 'active') { sClass = 'active';   sText = 'در حال اکران'; }

  // Button
  let btn = '';
  if (btnMode === 'reserve') {
    btn = `<button class="msc-reserve-btn" onclick="typeof openMainReservationModal==='function'&&openMainReservationModal('${code}','${title.replace(/'/g,"\\'")}')">${I.cal}<span>رزرو رسانه</span></button>`;
  } else {
    const cart = JSON.parse(localStorage.getItem('silveriom_cart') || '[]');
    const inC  = cart.includes(code);
    btn = `<button class="msc-reserve-btn${inC?' in-cart':''}" onclick="typeof toggleCartItem==='function'&&toggleCartItem('${code}')">${inC?I.chk:I.plus}<span>${inC?'حذف از مدیا کیت':'اضافه کردن به مدیا کیت'}</span></button>`;
  }

  return `
  <article class="media-showcase-card" data-id="${media.id||code}" data-type="${type}" data-venue="${venueId}">
    <div class="msc-img-wrapper">
      <img src="${image}" alt="${title}" loading="lazy">
      <span class="msc-code-badge">کد: ${code}</span>
      <span class="msc-status-badge ${sClass}">${sText}</span>
    </div>
    ${location?`<div class="msc-location">${I.loc}<span class="msc-location-text" style="display:none">${venueId}</span>${location}</div>`:''}
    <h3 class="msc-title">${title}</h3>
    <div class="msc-tariff-box">
      <span class="msc-tariff-label">تعرفه ماهانه:</span>
      <span class="msc-tariff-value">${tariff}</span>
    </div>
    <div class="msc-specs-grid">
      <div>${I.dims}<span>ابعاد: <strong>${dims}</strong></span></div>
      <div>${I.prnt}<span>چاپ: <strong>${printType}</strong></span></div>
    </div>
    ${btn}
  </article>`;
};

/* ── Showcase loader ───────────────────────────────────────────── */
window.renderMediaShowcase = function (containerId, filterPageId, opts) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#94a3b8;padding:3rem;font-family:YekanBakh,sans-serif">در حال بارگذاری...</div>';

  const p = window.dbFetchPromise
    || fetch('/data/silveriom_db.json?t=' + Date.now()).then(r => r.json());

  p.then(db => {
    let items = db.mediaInventory || [];
    if (filterPageId && filterPageId !== 'all') {
      items = items.filter(m => m.display_pages && m.display_pages.includes(filterPageId));
    }
    if (!items.length) {
      el.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#8E8E93;padding:2rem;font-family:YekanBakh,sans-serif">هیچ رسانه‌ای برای این بخش یافت نشد.</div>';
      return;
    }
    el.innerHTML = items.map(m => window.renderMediaCard(m, opts)).join('');
    if (typeof lucide !== 'undefined') lucide.createIcons();
    if (typeof filterAssets === 'function') setTimeout(filterAssets, 50);
    if (typeof updateCartButtons === 'function') updateCartButtons();
  }).catch(err => {
    console.error('silveriom-cards: DB error', err);
    el.innerHTML = '';
  });
};

})();
