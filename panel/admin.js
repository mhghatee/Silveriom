window.addEventListener('error', function(event) {
    alert("JS Error: " + event.message + "\nFile: " + event.filename + "\nLine: " + event.lineno);
});
window.addEventListener('unhandledrejection', function(event) {
    alert("Promise Error: " + event.reason);
});
/* ==========================================================================
   SILVERIOM — Executive Glassmorphism Admin CMS JavaScript Engine
   Includes Direct Image File Upload, Dual Auth, & About Us Page CMS Engine
   ========================================================================== */

let state = {
  settings: {},
  aboutUs: {},
  metrics: [],
  venues: [],
  mediaInventory: [],
  portfolio: [],
  inquiries: [],
  users: []
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  // 1. Enforce Auth Guard
  const user = checkAuth();
  if (!user) return;

  // 2. Fetch State & Setup
  fetchState();
  setupTabNavigation();
  setupFormHandlers();
  setupGlobalSearch();
});

function normalizeDigits(s) {
  if (!s) return "";
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  const englishDigits = "0123456789";
  return String(s).replace(/[۰-۹٠-٩]/g, w => {
    let idx = "۰۱۲۳۴۵۶۷۸۹".indexOf(w);
    if (idx !== -1) return "0123456789"[idx];
    idx = "٠١٢٣٤٥٦٧٨٩".indexOf(w);
    if (idx !== -1) return "0123456789"[idx];
    return w;
  }).trim();
}

function handleDirectFileUpload(fileInput, targetInputId, previewImgId) {
  if (!fileInput.files || !fileInput.files[0]) return;
  const file = fileInput.files[0];

  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64Data = e.target.result;

    const previewImg = document.getElementById(previewImgId);
    if (previewImg) {
      previewImg.src = base64Data;
      previewImg.style.display = 'block';
    }

    showToast('در حال آپلود تصویر روی سرور...', 'info');

    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('upload.php', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.url) {
        document.getElementById(targetInputId).value = data.url;
        showToast('تصویر با موفقیت روی هاست ذخیره شد', 'success');
        return;
      }
    } catch (err) {}

    try {
      const resApi = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: base64Data })
      });
      const dataApi = await resApi.json();
      if (dataApi.success && dataApi.url) {
        document.getElementById(targetInputId).value = dataApi.url;
        showToast('تصویر با موفقیت آپلود شد', 'success');
        return;
      }
    } catch (err) {}

    document.getElementById(targetInputId).value = base64Data;
    showToast('تصویر آماده ذخیره‌سازی است', 'success');
  };
  reader.readAsDataURL(file);
}

function checkAuth() {
  const sessionStr = localStorage.getItem('silveriom_session') || sessionStorage.getItem('silveriom_session');
  if (!sessionStr) {
    window.location.href = 'login.html';
    return null;
  }
  try {
    const session = JSON.parse(sessionStr);
    const user = session.user;
    if (!user || (user.status && user.status !== 'تایید شده')) {
      logoutUser();
      return null;
    }
    if (user.role && user.role !== 'مدیر ارشد') {
      window.location.href = 'login.html?action=mediakit';
      return null;
    }
    const nameEl = document.getElementById('user-display-name');
    const roleEl = document.getElementById('user-display-role');
    if (nameEl) nameEl.textContent = user.name || user.email || 'مدیر سیستم';
    if (roleEl) roleEl.textContent = user.role || 'مدیر ارشد';
    return user;
  } catch (e) {
    logoutUser();
  }
  return null;
}

function logoutUser() {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (e) {}
  localStorage.removeItem('silveriom_session');
  sessionStorage.removeItem('silveriom_session');
  showToast('از حساب کاربری خارج شدید', 'info');
  setTimeout(() => {
    window.location.href = 'login.html?logout=true';
  }, 400);
}

async function fetchState() {
  try {
    let res = await fetch('api.php?action=load');
    if (!res.ok) throw new Error('API offline');
    state = await res.json();
    renderAll();
  } catch (err) {
    try {
      let resStatic = await fetch('../data/silveriom_db.json');
      if (resStatic.ok) {
        state = await resStatic.json();
        renderAll();
        return;
      }
    } catch (e) {
      console.error(e);
    }
    showToast('خطا در دریافت اطلاعات از سرور', 'danger');
  }
}

function renderAll() {
  renderOverview();
  renderVenues();
  renderMedia();
  renderPortfolio();
  renderInquiries();
  renderUsers();
  renderSettings();
  renderAboutUs();
  renderContactUs();
  renderPortfolioPage();
  renderAudience();
  renderHomePage();
  renderMediaPlanner();
  if (window.lucide) lucide.createIcons();
}

function setupTabNavigation() {
  document.querySelectorAll('.menu-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active');
}

function switchTab(tabId) {
  document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

  const activeNav = document.querySelector(`.menu-item[data-tab="${tabId}"]`);
  const activePanel = document.getElementById(tabId);

  if (activeNav && activePanel) {
    activeNav.classList.add('active');
    activePanel.classList.add('active');

    const titleMap = {
      'tab-overview': 'پیشخوان و آمار کلی',
      'tab-home': 'مدیریت محتوای صفحه اصلی (خانه)',
      'tab-venues': 'مدیریت باشگاه‌ها و کورت‌ها',
      'tab-media': 'سازه‌ها و رسانه‌های تبلیغاتی',
      'tab-portfolio': 'مدیریت صفحه نمونه‌کارها',
      'tab-audience': 'مدیریت آمار و هوش مخاطب',
      'tab-planner': 'مدیریت مدیاپلنر و پکیج‌های تبلیغاتی',
      'tab-about-us': 'مدیریت کامل صفحه درباره ما',
      'tab-contact-us': 'مدیریت کامل صفحه تماس با ما',
      'tab-inquiries': 'پیام‌ها و درخواست‌های لید',
      'tab-users': 'مدیریت کاربران و دسترسی‌ها',
      'tab-settings': 'تنظیمات عمومی وب‌سایت'
    };
    const titleEl = document.getElementById('page-current-title') || document.getElementById('page-title');
    if (titleEl) {
      titleEl.textContent = titleMap[tabId] || 'پنل مدیریت سیلوریوم';
    }
  }

  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar && sidebar.classList.contains('open')) sidebar.classList.remove('open');
  if (overlay && overlay.classList.contains('active')) overlay.classList.remove('active');
  if (window.lucide) lucide.createIcons();
}

/* --------------------------------------------------------------------------
   TAB 1: OVERVIEW RENDER
   -------------------------------------------------------------------------- */
function renderOverview() {
  const grid = document.getElementById('dashboard-metrics-grid');
  if (grid) {
    grid.innerHTML = (state.metrics || []).map(m => `
      <div class="metric-card">
        <div class="metric-info">
          <h4>${m.label}</h4>
          <div class="value">${m.value}</div>
        </div>
        <div class="metric-icon-wrap">
          <i data-lucide="${m.icon || 'star'}" style="width:22px; height:22px;"></i>
        </div>
      </div>
    `).join('');
  }

  const inqTable = document.getElementById('overview-inquiries-tbody');
  if (inqTable) {
    const recent = (state.inquiries || []).slice(0, 4);
    if (recent.length === 0) {
      inqTable.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--color-silver-dim); padding:1rem;">هیچ پیامی ثبت نشده است.</td></tr>`;
    } else {
      inqTable.innerHTML = recent.map(i => `
        <tr>
          <td>${i.date || '—'}</td>
          <td style="font-weight:700; color:#fff;">${i.name}</td>
          <td>${i.venue || '—'}</td>
          <td><span class="badge badge-gold">${i.media || '—'}</span></td>
          <td><span class="badge ${i.status === 'جدید' ? 'badge-warning' : 'badge-success'}">${i.status}</span></td>
        </tr>
      `).join('');
    }
  }
}

/* --------------------------------------------------------------------------
   TAB 2: VENUES RENDER & MODAL
   -------------------------------------------------------------------------- */
function renderVenues() {
  const tbody = document.getElementById('venues-tbody');
  if (!tbody) return;
  const venues = state.venues || [];

  if (venues.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--color-silver-dim); padding:1.5rem;">هیچ باشگاهی ثبت نشده است.</td></tr>`;
    return;
  }

  tbody.innerHTML = venues.map(v => `
    <tr>
      <td>
        <img src="${v.image || 'assets/silveriom_logo_transparent.png'}" class="table-thumb" onerror="this.src='assets/silveriom_logo_transparent.png'">
      </td>
      <td style="font-weight:700; color:#fff;">
        ${v.title}
        ${v.badge ? `<br><span style="font-size:0.72rem; color:var(--color-neon); font-weight:normal;">${v.badge}</span>` : ''}
      </td>
      <td style="max-width:220px; white-space:normal; font-size:0.8rem; color:var(--color-silver-dim);">${v.location || '—'}</td>
      <td><span class="badge badge-gold">🎾 ${v.courts || '—'}</span></td>
      <td style="font-weight:700; color:var(--color-neon);">👁️ ${v.impressions || '۰'}</td>
      <td><span class="badge ${v.active !== false ? 'badge-success' : 'badge-warning'}">${v.active !== false ? 'فعال' : 'غیرفعال'}</span></td>
      <td>
        <div class="table-actions-cell">
          <button class="btn-glass-outline" style="padding:0.35rem 0.6rem;" onclick="openVenueModal('${v.id}')" title="ویرایش">
            <i data-lucide="edit-2" style="width:14px; height:14px;"></i>
          </button>
          <button class="btn-glass-outline btn-glass-danger" style="padding:0.35rem 0.6rem;" onclick="deleteVenue('${v.id}')" title="حذف">
            <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function openVenueModal(id = null) {
  const modal = document.getElementById('modal-venue');
  const title = document.getElementById('modal-venue-title');
  const form = document.getElementById('venue-form');
  form.reset();

  const preview = document.getElementById('venue-image-preview');
  if (preview) preview.style.display = 'none';

  if (id) {
    const v = state.venues.find(item => item.id === id);
    if (v) {
      title.textContent = 'ویرایش مجموعه پدل';
      document.getElementById('venue-id').value = v.id;
      document.getElementById('venue-title').value = v.title || '';
      document.getElementById('venue-badge').value = v.badge || '';
      document.getElementById('venue-location').value = v.location || '';
      document.getElementById('venue-courts').value = v.courts || '';
      document.getElementById('venue-impressions').value = v.impressions || '';
      document.getElementById('venue-lat').value = v.lat || 35.8;
      document.getElementById('venue-lng').value = v.lng || 51.4;
      document.getElementById('venue-image').value = v.image || '';
      document.getElementById('venue-desc').value = v.desc || '';
      if (v.image && preview) {
        preview.src = v.image;
        preview.style.display = 'block';
      }
    }
  } else {
    title.textContent = 'افزودن باشگاه جدید';
    document.getElementById('venue-id').value = '';
  }

  modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

async function deleteVenue(id) {
  if (!confirm('آیا از حذف این مجموعه اطمینان دارید؟')) return;
  try {
    const res = await fetch('/api/venues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    });
    const data = await res.json();
    if (data.success) state.venues = data.venues;
  } catch (err) {
    state.venues = state.venues.filter(v => v.id !== id);
  }
  renderVenues();
  showToast('مجموعه از لیست حذف شد', 'success');
}

/* --------------------------------------------------------------------------
   TAB 3: MEDIA INVENTORY RENDER
   -------------------------------------------------------------------------- */

function renderMedia() {
  const grid = document.getElementById('media-cards-grid');
  if (!grid) return;
  const media = state.mediaInventory || [];

  if (media.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:var(--color-silver-dim); padding:2rem;">هیچ رسانه/سازه‌ای ثبت نشده است.</div>`;
    return;
  }

  grid.innerHTML = media.map(m => `
    <div class="inventory-card" style="display:flex; flex-direction:column; gap: 10px;">
      
      <div style="position:relative; width:100%; height:140px; border-radius:10px; overflow:hidden; background:#0f172a; border: 1px solid rgba(255,255,255,0.1);">
        <img src="${m.image && m.image.startsWith('/') ? m.image : (m.image ? '../'+m.image : '../assets/placeholder_media.jpg')}" style="width:100%; height:100%; object-fit:cover;" id="media-img-${m.id}" />
        <div style="position:absolute; bottom:5px; right:5px;">
           <label class="btn-glass-gold" style="cursor:pointer; font-size:11px; padding: 4px 8px;">
              <i data-lucide="upload" style="width:12px; height:12px;"></i> آپلود عکس
              <input type="file" style="display:none;" accept="image/*" onchange="compressAndUploadMediaImage(event, '${m.id}')">
           </label>
        </div>
      </div>

      <div>
        <div class="inventory-tag" style="font-size: 10px;">${m.code || m.id} | ${m.location || 'لوکیشن نامشخص'}</div>
        <h3 class="inventory-title" style="font-size: 14px; margin-top:5px;">${m.title}</h3>
      </div>

      <div style="display:flex; flex-wrap: wrap; gap: 5px; font-size: 11px; color: #94a3b8; margin: 10px 0;">
          <span style="background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 4px;">تعرفه: ${m.tariff || '?'}</span>
          <span style="background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 4px;">ابعاد: ${m.dimensions || '?'}</span>
          <span style="background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 4px;">صفحات: ${(m.display_pages || []).join(', ')}</span>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top: auto;">
        <span class="badge ${m.status === 'reserved' ? 'badge-danger' : 'badge-gold'}" style="font-size: 11px;">
           ${m.status === 'reserved' ? 'رزرو شده' : 'موجود'}
        </span>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn-glass-outline" style="padding:0.35rem 0.65rem;" onclick="openMediaModal('${m.id}')" title="ویرایش">
            <i data-lucide="edit-2" style="width:14px; height:14px;"></i>
          </button>
          <button class="btn-glass-outline btn-glass-danger" style="padding:0.35rem 0.65rem;" onclick="deleteMedia('${m.id}')" title="حذف">
            <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

async function compressAndUploadMediaImage(event, mediaId) {
  const file = event.target.files[0];
  if (!file) return;

  // Validate image
  if (!file.type.startsWith('image/')) {
    showToast('لطفا یک فایل تصویری انتخاب کنید', 'error');
    return;
  }

  showToast('در حال بهینه‌سازی و تبدیل به WebP...', 'info');

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = async function() {
      // 1. Setup Canvas for resizing
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 1200; // max width to prevent heavy images
      
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // 2. Compress to WebP with 0.75 quality
      const webpBase64 = canvas.toDataURL('image/webp', 0.75);

      // 3. Upload to server
      try {
        const response = await fetch('upload.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_base64: webpBase64 })
        });
        
        const data = await response.json();
        
        if (data.success && data.url) {
           // 4. Update JSON DB
           const mIndex = state.mediaInventory.findIndex(m => m.id === mediaId);
           if (mIndex > -1) {
             state.mediaInventory[mIndex].image = data.url;
             await saveStateToServer(); // Save to DB
             
             // Update image instantly on UI
             document.getElementById('media-img-' + mediaId).src = data.url.startsWith('/') ? data.url : '../' + data.url;
             showToast('تصویر با موفقیت فشرده و آپلود شد!', 'success');
           }
        } else {
           showToast('خطا در آپلود: ' + (data.error || 'Unknown'), 'error');
        }
      } catch (err) {
        showToast('ارتباط با سرور قطع شد', 'error');
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}


function openMediaModal(id = null) {
  const modal = document.getElementById('modal-media');
  const title = document.getElementById('modal-media-title');
  const form = document.getElementById('media-form');
  form.reset();

  if (id) {
    const m = state.mediaInventory.find(item => item.id === id);
    if (m) {
      title.textContent = 'ویرایش سازه تبلیغاتی';
      document.getElementById('media-id').value = m.id;
      document.getElementById('media-title').value = m.title || '';
      document.getElementById('media-zoneTag').value = m.tag || '';
      document.getElementById('media-m1').value = m.impact || '';
      document.getElementById('media-m2').value = m.specs || '';
      document.getElementById('media-m3').value = m.avail || '';
      document.getElementById('media-desc').value = m.desc || '';
      document.getElementById('media-status').value = m.avail || 'موجود برای رزرو';
    }
  } else {
    title.textContent = 'افزودن سازه تبلیغاتی جدید';
    document.getElementById('media-id').value = '';
  }

  modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

async function deleteMedia(id) {
  if (!confirm('آیا از حذف این سازه تبلیغاتی اطمینان دارید؟')) return;
  try {
    const res = await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    });
    const data = await res.json();
    if (data.success) state.mediaInventory = data.mediaInventory;
  } catch (err) {
    state.mediaInventory = state.mediaInventory.filter(m => m.id !== id);
  }
  renderMedia();
  showToast('سازه تبلیغاتی حذف شد', 'success');
}

/* --------------------------------------------------------------------------
   TAB 4: PORTFOLIO RENDER
   -------------------------------------------------------------------------- */
function renderPortfolio() {
  const grid = document.getElementById('portfolio-cards-grid');
  if (!grid) return;
  const portfolio = state.portfolio || [];

  if (portfolio.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:var(--color-silver-dim); padding:2rem;">هیچ نمونه‌کاری ثبت نشده است.</div>`;
    return;
  }

  grid.innerHTML = portfolio.map(p => `
    <div class="inventory-card">
      <div>
        <div class="inventory-tag">${p.category || 'برندینگ'}</div>
        <h3 class="inventory-title">${p.title}</h3>
        <p class="inventory-desc" style="font-weight:700; color:var(--color-neon); margin-top:0.2rem;">برند: ${p.brand}</p>
        <p class="inventory-desc">${p.desc || ''}</p>
      </div>

      <div>
        ${p.image ? `<img src="${p.image}" class="table-thumb" style="width:100% !important; height:120px !important; max-width:100% !important; max-height:120px !important; border-radius:10px; margin-bottom:0.85rem; object-fit:cover;" onerror="this.style.display='none'">` : ''}

        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.75rem; color:var(--color-silver-dim);">${p.date || ''}</span>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn-glass-outline" style="padding:0.35rem 0.65rem;" onclick="openPortfolioModal('${p.id}')" title="ویرایش">
              <i data-lucide="edit-2" style="width:14px; height:14px;"></i>
            </button>
            <button class="btn-glass-outline btn-glass-danger" style="padding:0.35rem 0.65rem;" onclick="deletePortfolio('${p.id}')" title="حذف">
              <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function openPortfolioModal(id = null) {
  const modal = document.getElementById('modal-portfolio');
  const title = document.getElementById('modal-portfolio-title');
  const form = document.getElementById('portfolio-form');
  form.reset();

  const preview = document.getElementById('port-image-preview');
  if (preview) preview.style.display = 'none';

  if (id) {
    const p = state.portfolio.find(item => item.id === id);
    if (p) {
      title.textContent = 'ویرایش نمونه‌کار / کمپین';
      document.getElementById('port-id').value = p.id;
      document.getElementById('port-brand').value = p.brand || '';
      document.getElementById('port-title').value = p.title || '';
      document.getElementById('port-category').value = p.category || '';
      document.getElementById('port-desc').value = p.desc || '';
      document.getElementById('port-image').value = p.image || '';
      document.getElementById('port-date').value = p.date || '';
      if (p.image && preview) {
        preview.src = p.image;
        preview.style.display = 'block';
      }
    }
  } else {
    title.textContent = 'افزودن کمپین جدید';
    document.getElementById('port-id').value = '';
  }

  modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

async function deletePortfolio(id) {
  if (!confirm('آیا از حذف این کمپین اطمینان دارید؟')) return;
  try {
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    });
    const data = await res.json();
    if (data.success) state.portfolio = data.portfolio;
  } catch (err) {
    state.portfolio = state.portfolio.filter(p => p.id !== id);
  }
  renderPortfolio();
  showToast('نمونه‌کار از لیست حذف شد', 'success');
}

/* --------------------------------------------------------------------------
   TAB 5: INQUIRIES RENDER
   -------------------------------------------------------------------------- */
function renderInquiries() {
  const tbody = document.getElementById('inquiries-table-body');
  if (!tbody) return;
  const inqs = state.inquiries || [];

  if (inqs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--color-silver-dim); padding:1.5rem;">هیچ پیامی ثبت نشده است.</td></tr>`;
    return;
  }

  tbody.innerHTML = inqs.map(i => `
    <tr>
      <td style="font-weight:700; color:#fff;">${i.name}</td>
      <td dir="ltr" style="text-align:right;">${i.phone || '—'}</td>
      <td>${i.venue || '—'}</td>
      <td><span class="badge badge-gold">${i.media || '—'}</span></td>
      <td style="max-width:200px; white-space:normal; font-size:0.8rem;">${i.message || '—'}</td>
      <td>${i.date}</td>
      <td>
        <select class="glass-input-field" style="padding:0.25rem 0.5rem; font-size:0.75rem;" onchange="updateInquiryStatus('${i.id}', this.value)">
          <option value="جدید" ${i.status === 'جدید' ? 'selected' : ''}>جدید</option>
          <option value="در حال بررسی" ${i.status === 'در حال بررسی' ? 'selected' : ''}>در حال بررسی</option>
          <option value="تکمیل شده" ${i.status === 'تکمیل شده' ? 'selected' : ''}>تکمیل شده</option>
        </select>
      </td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

async function updateInquiryStatus(id, status) {
  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_status', id, status })
    });
    const data = await res.json();
    if (data.success) state.inquiries = data.inquiries;
  } catch (err) {
    const inq = state.inquiries.find(item => item.id === id);
    if (inq) inq.status = status;
  }
  showToast('وضعیت درخواست به‌روزرسانی شد', 'success');
}

/* --------------------------------------------------------------------------
   TAB 6: USERS RENDER & MANAGEMENT
   -------------------------------------------------------------------------- */
function renderUsers() {
  const tbody = document.getElementById('users-table-body');
  if (!tbody) return;
  const users = state.users || [];

  if (users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--color-silver-dim); padding:1.5rem;">هیچ کاربری در سیستم وجود ندارد.</td></tr>`;
    return;
  }

  tbody.innerHTML = users.map(u => {
    const statusClass = (u.status === 'تایید شده') ? 'badge-success' : ((u.status === 'در انتظار تایید') ? 'badge-warning' : 'badge-gold');
    const isApproved = u.status === 'تایید شده';
    return `
      <tr>
        <td style="font-weight:700; color:#fff;">${u.name || 'کاربر سیستم'}</td>
        <td dir="ltr" style="text-align:right;">${u.email || '—'}</td>
        <td dir="ltr" style="text-align:right;">
          ${u.phone ? `<a href="tel:${u.phone}" style="color:var(--color-neon); text-decoration:none;">${u.phone}</a>` : '—'}
        </td>
        <td><span class="badge badge-gold">${u.role || 'کاربر پنل'}</span></td>
        <td><span class="badge ${statusClass}">${u.status || 'در انتظار تایید'}</span></td>
        <td>
          <div class="table-actions-cell">
            ${!isApproved ? `
              <button class="btn-glass-gold" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="approveUser('${u.id}')" title="تایید کاربر">
                <i data-lucide="check" style="width:13px; height:13px;"></i>
                <span>تایید</span>
              </button>
            ` : `
              <button class="btn-glass-outline btn-glass-danger" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="blockUser('${u.id}')" title="مسدودسازی">
                <i data-lucide="shield-off" style="width:13px; height:13px;"></i>
                <span>مسدود</span>
              </button>
            `}
            <button class="btn-glass-outline" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="openPasswordModal('${u.id}')" title="تغییر رمز">
              <i data-lucide="key" style="width:13px; height:13px;"></i>
            </button>
            <button class="btn-glass-outline" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="openUserModal('${u.id}')" title="ویرایش">
              <i data-lucide="edit-3" style="width:13px; height:13px;"></i>
            </button>
            <button class="btn-glass-outline btn-glass-danger" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="deleteUser('${u.id}')" title="حذف">
              <i data-lucide="trash-2" style="width:13px; height:13px;"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function openUserModal(id = null) {
  const modal = document.getElementById('modal-user');
  const title = document.getElementById('modal-user-title');
  const form = document.getElementById('user-form');
  const passGroup = document.getElementById('user-password-group');
  form.reset();

  if (id) {
    const u = state.users.find(item => item.id === id);
    if (u) {
      title.textContent = 'ویرایش مشخصات کاربر';
      document.getElementById('user-id').value = u.id;
      document.getElementById('user-name').value = u.name || '';
      document.getElementById('user-email').value = u.email || '';
      document.getElementById('user-phone').value = u.phone || '';
      document.getElementById('user-role').value = u.role || 'کاربر پنل';
      document.getElementById('user-status').value = u.status || 'تایید شده';
      if (passGroup) passGroup.style.display = 'none';
      document.getElementById('user-password').removeAttribute('required');
    }
  } else {
    title.textContent = 'افزودن کاربر جدید';
    document.getElementById('user-id').value = '';
    if (passGroup) passGroup.style.display = 'block';
    document.getElementById('user-password').setAttribute('required', 'true');
  }

  modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

async function approveUser(id) {
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve', id })
    });
    const data = await res.json();
    if (data.success) state.users = data.users;
  } catch (err) {
    const u = state.users.find(item => item.id === id);
    if (u) u.status = 'تایید شده';
  }
  renderUsers();
  showToast('حساب کاربری با موفقیت تایید شد', 'success');
}

async function blockUser(id) {
  if (!confirm('آیا از مسدودسازی این کاربر اطمینان دارید؟')) return;
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'block', id })
    });
    const data = await res.json();
    if (data.success) state.users = data.users;
  } catch (err) {
    const u = state.users.find(item => item.id === id);
    if (u) u.status = 'مسدود / رد شده';
  }
  renderUsers();
  showToast('حساب کاربری مسدود شد', 'warning');
}

function openPasswordModal(id) {
  const modal = document.getElementById('modal-password');
  document.getElementById('pass-user-id').value = id;
  document.getElementById('password-form').reset();
  modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

async function deleteUser(id) {
  if (!confirm('آیا از حذف این کاربر اطمینان دارید؟')) return;
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    });
    const data = await res.json();
    if (data.success) state.users = data.users;
  } catch (err) {}
  state.users = state.users.filter(u => u.id !== id);
  renderUsers();
  showToast('کاربر از لیست حذف شد', 'success');
}

/* --------------------------------------------------------------------------
   TAB 7: SETTINGS RENDER & SAVE
   -------------------------------------------------------------------------- */
function renderSettings() {
  const s = state.settings || {};
  document.getElementById('set-siteTitle').value = s.siteTitle || '';
  document.getElementById('set-heroBadge').value = s.heroBadge || '';
  document.getElementById('set-heroTitle').value = s.heroTitle || '';
  document.getElementById('set-heroSubtitle').value = s.heroSubtitle || '';
  document.getElementById('set-contactPhone').value = s.contactPhone || '';
  document.getElementById('set-contactEmail').value = s.contactEmail || '';
  document.getElementById('set-contactAddress').value = s.contactAddress || '';
}

/* --------------------------------------------------------------------------
   TAB 8: ABOUT US CMS RENDER & SAVE
   -------------------------------------------------------------------------- */
function renderAboutUs() {
  const ab = state.aboutUs || {};
  document.getElementById('about-heroTitle').value = ab.heroTitle || '';
  document.getElementById('about-heroSubtitle').value = ab.heroSubtitle || '';
  document.getElementById('about-heroDesc').value = ab.heroDesc || '';
  document.getElementById('about-heroImage').value = ab.heroImage || '';
  
  if (ab.heroImage) {
    const p = document.getElementById('about-heroImage-preview');
    if (p) { p.src = ab.heroImage; p.style.display = 'block'; }
  }

  document.getElementById('about-storyTitle').value = ab.storyTitle || '';
  document.getElementById('about-storyContent').value = ab.storyContent || '';
  document.getElementById('about-mission').value = ab.mission || '';
  document.getElementById('about-vision').value = ab.vision || '';

  const stats = ab.stats || [];
  if (stats[0]) {
    document.getElementById('about-stat1-label').value = stats[0].label || '';
    document.getElementById('about-stat1-val').value = stats[0].value || '';
  }
  if (stats[1]) {
    document.getElementById('about-stat2-label').value = stats[1].label || '';
    document.getElementById('about-stat2-val').value = stats[1].value || '';
  }
  if (stats[2]) {
    document.getElementById('about-stat3-label').value = stats[2].label || '';
    document.getElementById('about-stat3-val').value = stats[2].value || '';
  }
  if (stats[3]) {
    document.getElementById('about-stat4-label').value = stats[3].label || '';
    document.getElementById('about-stat4-val').value = stats[3].value || '';
  }

  document.getElementById('about-ctaTitle').value = ab.ctaTitle || '';
  document.getElementById('about-ctaSubtitle').value = ab.ctaSubtitle || '';
  document.getElementById('about-ctaBtnText').value = ab.ctaBtnText || '';
  document.getElementById('about-ctaBtnLink').value = ab.ctaBtnLink || '';

  renderTeamTable();
}

function renderTeamTable() {
  const tbody = document.getElementById('team-table-body');
  if (!tbody) return;
  const team = (state.aboutUs && state.aboutUs.team) ? state.aboutUs.team : [];

  if (team.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--color-silver-dim); padding:1.5rem;">هیچ عضوی ثبت نشده است.</td></tr>`;
    return;
  }

  tbody.innerHTML = team.map(m => `
    <tr>
      <td><img src="${m.image || 'assets/silveriom_logo_transparent.png'}" class="table-thumb" onerror="this.src='assets/silveriom_logo_transparent.png'"></td>
      <td style="font-weight:700; color:#fff;">${m.name}</td>
      <td><span class="badge badge-gold">${m.role}</span></td>
      <td style="max-width:250px; white-space:normal; font-size:0.8rem; color:var(--color-silver-dim);">${m.bio || '—'}</td>
      <td>
        <div class="table-actions-cell">
          <button class="btn-glass-outline" style="padding:0.35rem 0.6rem;" onclick="openTeamModal('${m.id}')" title="ویرایش">
            <i data-lucide="edit-3" style="width:14px; height:14px;"></i>
          </button>
          <button class="btn-glass-outline btn-glass-danger" style="padding:0.35rem 0.6rem;" onclick="deleteTeamMember('${m.id}')" title="حذف">
            <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function openTeamModal(id = null) {
  const modal = document.getElementById('modal-team');
  const title = document.getElementById('modal-team-title');
  const form = document.getElementById('team-form');
  form.reset();

  const preview = document.getElementById('team-image-preview');
  if (preview) preview.style.display = 'none';

  if (id) {
    const team = (state.aboutUs && state.aboutUs.team) ? state.aboutUs.team : [];
    const member = team.find(m => m.id === id);
    if (member) {
      title.textContent = 'ویرایش اطلاعات عضو تیم';
      document.getElementById('team-id').value = member.id;
      document.getElementById('team-name').value = member.name || '';
      document.getElementById('team-role').value = member.role || '';
      document.getElementById('team-bio').value = member.bio || '';
      document.getElementById('team-image').value = member.image || '';
      if (member.image && preview) {
        preview.src = member.image;
        preview.style.display = 'block';
      }
    }
  } else {
    title.textContent = 'افزودن عضو جدید تیم';
    document.getElementById('team-id').value = '';
  }

  modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

async function deleteTeamMember(id) {
  if (!confirm('آیا از حذف این عضو تیم اطمینان دارید؟')) return;
  try {
    const res = await fetch('/api/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    });
    const data = await res.json();
    if (data.success && data.aboutUs) {
      state.aboutUs = data.aboutUs;
    }
  } catch (err) {
    if (state.aboutUs && state.aboutUs.team) {
      state.aboutUs.team = state.aboutUs.team.filter(m => m.id !== id);
    }
  }
  renderTeamTable();
  showToast('عضو تیم حذف گردید', 'success');
}

/* --------------------------------------------------------------------------
   FORM SUBMISSION HANDLERS
   -------------------------------------------------------------------------- */
function setupFormHandlers() {
  // Venue Form
  const vForm = document.getElementById('venue-form'); if(vForm) vForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const venue = {
      id: document.getElementById('venue-id').value || ('v_' + Date.now()),
      title: document.getElementById('venue-title').value,
      badge: document.getElementById('venue-badge').value,
      location: document.getElementById('venue-location').value,
      courts: document.getElementById('venue-courts').value,
      impressions: document.getElementById('venue-impressions').value,
      lat: parseFloat(document.getElementById('venue-lat').value) || 35.8,
      lng: parseFloat(document.getElementById('venue-lng').value) || 51.4,
      image: document.getElementById('venue-image').value,
      desc: document.getElementById('venue-desc').value,
      active: true
    };

    try {
      const res = await fetch('/api/venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', venue })
      });
      const data = await res.json();
      if (data.success) state.venues = data.venues;
    } catch (err) {
      const idx = state.venues.findIndex(v => v.id === venue.id);
      if (idx >= 0) state.venues[idx] = venue;
      else state.venues.push(venue);
    }
    renderVenues();
    closeModal('modal-venue');
    showToast('اطلاعات باشگاه با موفقیت ذخیره شد', 'success');
  });

  // Media Form
  const mForm = document.getElementById('media-form'); if(mForm) mForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const media = {
      id: document.getElementById('media-id').value || ('mi_' + Date.now()),
      title: document.getElementById('media-title').value,
      tag: document.getElementById('media-zoneTag').value,
      impact: document.getElementById('media-m1').value,
      specs: document.getElementById('media-m2').value,
      avail: document.getElementById('media-m3').value || document.getElementById('media-status').value,
      desc: document.getElementById('media-desc').value
    };

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', media })
      });
      const data = await res.json();
      if (data.success) state.mediaInventory = data.mediaInventory;
    } catch (err) {
      const idx = state.mediaInventory.findIndex(m => m.id === media.id);
      if (idx >= 0) state.mediaInventory[idx] = media;
      else state.mediaInventory.push(media);
    }
    renderMedia();
    closeModal('modal-media');
    showToast('اطلاعات سازه تبلیغاتی ذخیره شد', 'success');
  });

  // Portfolio Form
  const pForm = document.getElementById('portfolio-form'); if(pForm) pForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const portfolio = {
      id: document.getElementById('port-id').value || ('p_' + Date.now()),
      brand: document.getElementById('port-brand').value,
      title: document.getElementById('port-title').value,
      category: document.getElementById('port-category').value,
      desc: document.getElementById('port-desc').value,
      image: document.getElementById('port-image').value,
      date: document.getElementById('port-date').value
    };

    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', portfolio })
      });
      const data = await res.json();
      if (data.success) state.portfolio = data.portfolio;
    } catch (err) {
      const idx = state.portfolio.findIndex(p => p.id === portfolio.id);
      if (idx >= 0) state.portfolio[idx] = portfolio;
      else state.portfolio.push(portfolio);
    }
    renderPortfolio();
    closeModal('modal-portfolio');
    showToast('نمونه‌کار جدید ذخیره شد', 'success');
  });

  // User Add/Edit Form
  const uForm = document.getElementById('user-form'); if(uForm) uForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('user-id').value;
    const user_item = {
      id: id || ('u_' + Date.now()),
      name: document.getElementById('user-name').value,
      email: normalizeDigits(document.getElementById('user-email').value).toLowerCase(),
      phone: normalizeDigits(document.getElementById('user-phone').value),
      role: document.getElementById('user-role').value,
      status: document.getElementById('user-status').value
    };
    if (!id) {
      user_item.password = document.getElementById('user-password').value;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', user: user_item })
      });
      const data = await res.json();
      if (data.success) state.users = data.users;
    } catch (err) {
      const idx = state.users.findIndex(u => u.id === user_item.id);
      if (idx >= 0) state.users[idx] = user_item;
      else state.users.push(user_item);
    }
    renderUsers();
    closeModal('modal-user');
    showToast('اطلاعات کاربر با موفقیت ذخیره شد', 'success');
  });

  // Change Password Form
  const pwdForm = document.getElementById('password-form'); if(pwdForm) pwdForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('pass-user-id').value;
    const newPass = document.getElementById('new-password').value;
    const confirmPass = document.getElementById('confirm-new-password').value;

    if (newPass !== confirmPass) {
      showToast('رمز عبور جدید و تکرار آن مطابقت ندارند', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change_password', id, password: newPass })
      });
      const data = await res.json();
      if (data.success) state.users = data.users;
    } catch (err) {}
    closeModal('modal-password');
    showToast('رمز عبور جدید کاربر اعمال شد', 'success');
  });

  // Settings Form
  const sForm = document.getElementById('settings-form'); if(sForm) sForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    state.settings = {
      siteTitle: document.getElementById('set-siteTitle').value,
      heroBadge: document.getElementById('set-heroBadge').value,
      heroTitle: document.getElementById('set-heroTitle').value,
      heroSubtitle: document.getElementById('set-heroSubtitle').value,
      contactPhone: document.getElementById('set-contactPhone').value,
      contactEmail: document.getElementById('set-contactEmail').value,
      contactAddress: document.getElementById('set-contactAddress').value
    };

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: state.settings, metrics: state.metrics })
      });
    } catch (err) {}
    showToast('تنظیمات عمومی با موفقیت ذخیره شد', 'success');
  });

  // About Us Form Handler
  const aboutForm = document.getElementById('about-us-form');
  if (aboutForm) {
    aboutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const aboutData = {
        heroTitle: document.getElementById('about-heroTitle').value,
        heroSubtitle: document.getElementById('about-heroSubtitle').value,
        heroDesc: document.getElementById('about-heroDesc').value,
        heroImage: document.getElementById('about-heroImage').value,
        storyTitle: document.getElementById('about-storyTitle').value,
        storyContent: document.getElementById('about-storyContent').value,
        mission: document.getElementById('about-mission').value,
        vision: document.getElementById('about-vision').value,
        stats: [
          { label: document.getElementById('about-stat1-label').value, value: document.getElementById('about-stat1-val').value },
          { label: document.getElementById('about-stat2-label').value, value: document.getElementById('about-stat2-val').value },
          { label: document.getElementById('about-stat3-label').value, value: document.getElementById('about-stat3-val').value },
          { label: document.getElementById('about-stat4-label').value, value: document.getElementById('about-stat4-val').value }
        ],
        team: (state.aboutUs && state.aboutUs.team) ? state.aboutUs.team : [],
        ctaTitle: document.getElementById('about-ctaTitle').value,
        ctaSubtitle: document.getElementById('about-ctaSubtitle').value,
        ctaBtnText: document.getElementById('about-ctaBtnText').value,
        ctaBtnLink: document.getElementById('about-ctaBtnLink').value
      };

      try {
        const res = await fetch('/api/about_us', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ aboutUs: aboutData })
        });
        const data = await res.json();
        if (data.success && data.aboutUs) {
          state.aboutUs = data.aboutUs;
        }
      } catch (err) {
        state.aboutUs = aboutData;
      }

      showToast('اطلاعات صفحه درباره ما با موفقیت به‌روزرسانی شد', 'success');
    });
  }

  // Team Form Handler
  const teamForm = document.getElementById('team-form');
  if (teamForm) {
    teamForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const member = {
        id: document.getElementById('team-id').value || ('t_' + Date.now()),
        name: document.getElementById('team-name').value,
        role: document.getElementById('team-role').value,
        bio: document.getElementById('team-bio').value,
        image: document.getElementById('team-image').value
      };

      try {
        const res = await fetch('/api/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'save', member })
        });
        const data = await res.json();
        if (data.success && data.aboutUs) {
          state.aboutUs = data.aboutUs;
        }
      } catch (err) {
        const team = state.aboutUs.team || [];
        const idx = team.findIndex(m => m.id === member.id);
        if (idx >= 0) team[idx] = member;
        else team.push(member);
        state.aboutUs.team = team;
      }

      renderTeamTable();
      closeModal('modal-team');
      showToast('مشخصات عضو تیم ذخیره شد', 'success');
    });
  }

  // Contact Us Form Handler
  const contactForm = document.getElementById('contact-us-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const contactData = {
        heroBadge: document.getElementById('cnt-heroBadge').value,
        heroTitle: document.getElementById('cnt-heroTitle').value,
        heroSubtitle: document.getElementById('cnt-heroSubtitle').value,
        cards: [
          {
            id: 'c1',
            title: document.getElementById('cnt-card1-title').value,
            detail: document.getElementById('cnt-card1-detail').value,
            subdetail: document.getElementById('cnt-card1-subdetail').value,
            icon: 'phone'
          },
          {
            id: 'c2',
            title: document.getElementById('cnt-card2-title').value,
            detail: document.getElementById('cnt-card2-detail').value,
            subdetail: document.getElementById('cnt-card2-subdetail').value,
            icon: 'building'
          },
          {
            id: 'c3',
            title: document.getElementById('cnt-card3-title').value,
            detail: document.getElementById('cnt-card3-detail').value,
            subdetail: document.getElementById('cnt-card3-subdetail').value,
            icon: 'mail'
          },
          {
            id: 'c4',
            title: document.getElementById('cnt-card4-title').value,
            detail: document.getElementById('cnt-card4-detail').value,
            subdetail: document.getElementById('cnt-card4-subdetail').value,
            icon: 'map-pin'
          }
        ],
        mapTitle: document.getElementById('cnt-mapTitle').value,
        mapLat: document.getElementById('cnt-mapLat').value,
        mapLng: document.getElementById('cnt-mapLng').value,
        workingHoursText: document.getElementById('cnt-workingHoursText').value
      };

      try {
        const res = await fetch('/api/contact_us', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contactUs: contactData })
        });
        const data = await res.json();
        if (data.success && data.contactUs) {
          state.contactUs = data.contactUs;
        }
      } catch (err) {
        state.contactUs = contactData;
      }

      showToast('اطلاعات صفحه تماس با ما به‌روزرسانی شد', 'success');
    });
  }

  // Portfolio Page Form Handler
  const portPageForm = document.getElementById('portfolio-page-form');
  if (portPageForm) {
    portPageForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const portData = {
        heroBadge: document.getElementById('port-heroBadge').value,
        heroTitle: document.getElementById('port-heroTitle').value,
        heroSubtitle: document.getElementById('port-heroSubtitle').value,
        impactMetrics: [
          { id: 'im1', label: document.getElementById('port-stat1-label').value, value: document.getElementById('port-stat1-value').value },
          { id: 'im2', label: document.getElementById('port-stat2-label').value, value: document.getElementById('port-stat2-value').value },
          { id: 'im3', label: document.getElementById('port-stat3-label').value, value: document.getElementById('port-stat3-value').value },
          { id: 'im4', label: document.getElementById('port-stat4-label').value, value: document.getElementById('port-stat4-value').value }
        ],
        campaigns: (state.portfolioPage && state.portfolioPage.campaigns) ? state.portfolioPage.campaigns : []
      };

      try {
        const res = await fetch('/api/portfolio_page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ portfolioPage: portData })
        });
        const data = await res.json();
        if (data.success && data.portfolioPage) {
          state.portfolioPage = data.portfolioPage;
        }
      } catch (err) {
        state.portfolioPage = portData;
      }

      showToast('تنظیمات صفحه نمونه‌کارها به‌روزرسانی شد', 'success');
    });
  }

  // Campaign Modal Form Handler
  const campaignForm = document.getElementById('campaign-form');
  if (campaignForm) {
    campaignForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const campaign = {
        id: document.getElementById('camp-id').value || ('camp_' + Date.now()),
        brand: document.getElementById('camp-brand').value,
        title: document.getElementById('camp-title').value,
        category: document.getElementById('camp-category').value,
        location: document.getElementById('camp-location').value,
        media: document.getElementById('camp-media').value,
        desc: document.getElementById('camp-desc').value,
        date: document.getElementById('camp-date').value,
        impressions: document.getElementById('camp-impressions').value,
        image: document.getElementById('camp-image').value
      };

      try {
        const res = await fetch('/api/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'save', campaign })
        });
        const data = await res.json();
        if (data.success && data.portfolioPage) {
          state.portfolioPage = data.portfolioPage;
        }
      } catch (err) {
        if (!state.portfolioPage) state.portfolioPage = { campaigns: [] };
        if (!state.portfolioPage.campaigns) state.portfolioPage.campaigns = [];
        const idx = state.portfolioPage.campaigns.findIndex(c => c.id === campaign.id);
        if (idx >= 0) state.portfolioPage.campaigns[idx] = campaign;
        else state.portfolioPage.campaigns.push(campaign);
      }

      renderCampaignsTable();
      closeModal('modal-campaign');
      showToast('اطلاعات کمپین برند ذخیره گردید', 'success');
    });
  }

  // Home Page Form Handler
  const homeForm = document.getElementById('home-page-form');
  if (homeForm) {
    homeForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const homeData = {
        heroBadge: document.getElementById('hm-heroBadge').value,
        heroTitle: document.getElementById('hm-heroTitle').value,
        heroSubtitle: document.getElementById('hm-heroSubtitle').value,
        ctaPrimaryText: document.getElementById('hm-ctaPrimaryText').value,
        ctaPrimaryLink: document.getElementById('hm-ctaPrimaryLink').value,
        ctaSecondaryText: document.getElementById('hm-ctaSecondaryText').value,
        ctaSecondaryLink: document.getElementById('hm-ctaSecondaryLink').value,
        reelVideoUrl: document.getElementById('hm-reelVideoUrl').value,
        highlights: [
          { id: 'h1', title: document.getElementById('hm-hl1-title').value, value: document.getElementById('hm-hl1-value').value, desc: document.getElementById('hm-hl1-desc').value },
          { id: 'h2', title: document.getElementById('hm-hl2-title').value, value: document.getElementById('hm-hl2-value').value, desc: document.getElementById('hm-hl2-desc').value },
          { id: 'h3', title: document.getElementById('hm-hl3-title').value, value: document.getElementById('hm-hl3-value').value, desc: document.getElementById('hm-hl3-desc').value },
          { id: 'h4', title: document.getElementById('hm-hl4-title').value, value: document.getElementById('hm-hl4-value').value, desc: document.getElementById('hm-hl4-desc').value }
        ]
      };

      try {
        const res = await fetch('/api/home_page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ homePage: homeData })
        });
        const data = await res.json();
        if (data.success && data.homePage) {
          state.homePage = data.homePage;
        }
      } catch (err) {
        state.homePage = homeData;
      }

      showToast('اطلاعات صفحه اصلی (خانه) با موفقیت به‌روزرسانی شد', 'success');
    });
  }

  // Media Planner Main Form Handler
  const plannerForm = document.getElementById('media-planner-form');
  if (plannerForm) {
    plannerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const plannerData = {
        title: document.getElementById('pln-title').value,
        subtitle: document.getElementById('pln-subtitle').value,
        packages: (state.mediaPlanner && state.mediaPlanner.packages) ? state.mediaPlanner.packages : []
      };

      try {
        const res = await fetch('/api/media_planner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mediaPlanner: plannerData })
        });
        const data = await res.json();
        if (data.success && data.mediaPlanner) {
          state.mediaPlanner = data.mediaPlanner;
        }
      } catch (err) {
        state.mediaPlanner = plannerData;
      }

      showToast('تنظیمات بخش مدیاپلنر ذخیره گردید', 'success');
    });
  }

  // Planner Package Form Handler
  const pkgForm = document.getElementById('planner-pkg-form');
  if (pkgForm) {
    pkgForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const rawFeatures = document.getElementById('pkg-features').value || '';
      const features = rawFeatures.split('\n').map(s => s.trim()).filter(Boolean);

      const packageObj = {
        id: document.getElementById('pkg-id').value || ('pkg_' + Date.now()),
        name: document.getElementById('pkg-name').value,
        badge: document.getElementById('pkg-badge').value,
        duration: document.getElementById('pkg-duration').value,
        price: document.getElementById('pkg-price').value,
        impressions: document.getElementById('pkg-impressions').value,
        discount: document.getElementById('pkg-discount').value,
        features: features
      };

      try {
        const res = await fetch('/api/planner_packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'save', package: packageObj })
        });
        const data = await res.json();
        if (data.success && data.mediaPlanner) {
          state.mediaPlanner = data.mediaPlanner;
        }
      } catch (err) {
        if (!state.mediaPlanner) state.mediaPlanner = { packages: [] };
        if (!state.mediaPlanner.packages) state.mediaPlanner.packages = [];
        const idx = state.mediaPlanner.packages.findIndex(p => p.id === packageObj.id);
        if (idx >= 0) state.mediaPlanner.packages[idx] = packageObj;
        else state.mediaPlanner.packages.push(packageObj);
      }

      renderPlannerTable();
      closeModal('modal-planner');
      showToast('مشخصات پکیج تبلیغاتی با موفقیت ذخیره گردید', 'success');
    });
  }
}

function renderHomePage() {
  const hm = state.homePage || {};
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };

  setVal('hm-heroBadge', hm.heroBadge);
  setVal('hm-heroTitle', hm.heroTitle);
  setVal('hm-heroSubtitle', hm.heroSubtitle);
  setVal('hm-ctaPrimaryText', hm.ctaPrimaryText);
  setVal('hm-ctaPrimaryLink', hm.ctaPrimaryLink);
  setVal('hm-ctaSecondaryText', hm.ctaSecondaryText);
  setVal('hm-ctaSecondaryLink', hm.ctaSecondaryLink);
  setVal('hm-reelVideoUrl', hm.reelVideoUrl);

  const hls = hm.highlights || [];
  if (hls[0]) { setVal('hm-hl1-title', hls[0].title); setVal('hm-hl1-value', hls[0].value); setVal('hm-hl1-desc', hls[0].desc); }
  if (hls[1]) { setVal('hm-hl2-title', hls[1].title); setVal('hm-hl2-value', hls[1].value); setVal('hm-hl2-desc', hls[1].desc); }
  if (hls[2]) { setVal('hm-hl3-title', hls[2].title); setVal('hm-hl3-value', hls[2].value); setVal('hm-hl3-desc', hls[2].desc); }
  if (hls[3]) { setVal('hm-hl4-title', hls[3].title); setVal('hm-hl4-value', hls[3].value); setVal('hm-hl4-desc', hls[3].desc); }
}

function renderMediaPlanner() {
  const pln = state.mediaPlanner || {};
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };

  setVal('pln-title', pln.title);
  setVal('pln-subtitle', pln.subtitle);

  renderPlannerTable();
}

function renderPlannerTable() {
  const tbody = document.getElementById('planner-tbody');
  if (!tbody) return;
  const packages = (state.mediaPlanner && state.mediaPlanner.packages) ? state.mediaPlanner.packages : [];

  if (packages.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--color-silver-dim); padding:2rem;">هیچ پکیج تبلیغاتی ثبت نشده است.</td></tr>`;
    return;
  }

  tbody.innerHTML = packages.map(p => `
    <tr>
      <td style="font-weight:700; color:#fff;">${p.name || '---'}</td>
      <td><span class="badge-tag">${p.badge || 'عادی'}</span></td>
      <td>${p.duration || '---'}</td>
      <td style="color:var(--color-neon); font-weight:700;">${p.price || '---'}</td>
      <td><span class="badge-gold">${p.discount || '---'}</span></td>
      <td>${p.impressions || '---'}</td>
      <td>
        <div style="display:flex; gap:0.5rem;">
          <button class="action-icon-btn" onclick="openPlannerModal('${p.id}')" title="ویرایش"><i data-lucide="edit"></i></button>
          <button class="action-icon-btn danger" onclick="deletePlannerPackage('${p.id}')" title="حذف"><i data-lucide="trash-2"></i></button>
        </div>
      </td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function openPlannerModal(id = null) {
  const modal = document.getElementById('modal-planner');
  if (!modal) return;

  document.getElementById('planner-pkg-form').reset();
  document.getElementById('pkg-id').value = '';

  if (id && state.mediaPlanner && state.mediaPlanner.packages) {
    const p = state.mediaPlanner.packages.find(item => item.id === id);
    if (p) {
      document.getElementById('modal-planner-title').textContent = 'ویرایش پکیج: ' + p.name;
      document.getElementById('pkg-id').value = p.id;
      document.getElementById('pkg-name').value = p.name || '';
      document.getElementById('pkg-badge').value = p.badge || '';
      document.getElementById('pkg-duration').value = p.duration || '';
      document.getElementById('pkg-price').value = p.price || '';
      document.getElementById('pkg-impressions').value = p.impressions || '';
      document.getElementById('pkg-discount').value = p.discount || '';
      document.getElementById('pkg-features').value = (p.features || []).join('\n');
    }
  } else {
    document.getElementById('modal-planner-title').textContent = 'ثبت پکیج جدید';
  }

  modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

async function deletePlannerPackage(id) {
  if (!confirm('آیا از حذف این پکیج تبلیغاتی اطمینان دارید؟')) return;
  try {
    const res = await fetch('/api/planner_packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    });
    const data = await res.json();
    if (data.success && data.mediaPlanner) {
      state.mediaPlanner = data.mediaPlanner;
    }
  } catch (err) {
    if (state.mediaPlanner && state.mediaPlanner.packages) {
      state.mediaPlanner.packages = state.mediaPlanner.packages.filter(p => p.id !== id);
    }
  }
  renderPlannerTable();
  showToast('پکیج تبلیغاتی حذف گردید', 'info');
}

function renderContactUs() {
  const cnt = state.contactUs || {};
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };

  setVal('cnt-heroBadge', cnt.heroBadge);
  setVal('cnt-heroTitle', cnt.heroTitle);
  setVal('cnt-heroSubtitle', cnt.heroSubtitle);

  const cards = cnt.cards || [];
  if (cards[0]) {
    setVal('cnt-card1-title', cards[0].title);
    setVal('cnt-card1-detail', cards[0].detail);
    setVal('cnt-card1-subdetail', cards[0].subdetail);
  }
  if (cards[1]) {
    setVal('cnt-card2-title', cards[1].title);
    setVal('cnt-card2-detail', cards[1].detail);
    setVal('cnt-card2-subdetail', cards[1].subdetail);
  }
  if (cards[2]) {
    setVal('cnt-card3-title', cards[2].title);
    setVal('cnt-card3-detail', cards[2].detail);
    setVal('cnt-card3-subdetail', cards[2].subdetail);
  }
  if (cards[3]) {
    setVal('cnt-card4-title', cards[3].title);
    setVal('cnt-card4-detail', cards[3].detail);
    setVal('cnt-card4-subdetail', cards[3].subdetail);
  }

  setVal('cnt-mapTitle', cnt.mapTitle);
  setVal('cnt-mapLat', cnt.mapLat);
  setVal('cnt-mapLng', cnt.mapLng);
  setVal('cnt-workingHoursText', cnt.workingHoursText);
}

function renderPortfolioPage() {
  const port = state.portfolioPage || {};
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };

  setVal('port-heroBadge', port.heroBadge);
  setVal('port-heroTitle', port.heroTitle);
  setVal('port-heroSubtitle', port.heroSubtitle);

  const metrics = port.impactMetrics || [];
  if (metrics[0]) { setVal('port-stat1-label', metrics[0].label); setVal('port-stat1-value', metrics[0].value); }
  if (metrics[1]) { setVal('port-stat2-label', metrics[1].label); setVal('port-stat2-value', metrics[1].value); }
  if (metrics[2]) { setVal('port-stat3-label', metrics[2].label); setVal('port-stat3-value', metrics[2].value); }
  if (metrics[3]) { setVal('port-stat4-label', metrics[3].label); setVal('port-stat4-value', metrics[3].value); }

  renderCampaignsTable();
}

function renderCampaignsTable() {
  const tbody = document.getElementById('campaigns-tbody');
  if (!tbody) return;
  const campaigns = (state.portfolioPage && state.portfolioPage.campaigns) ? state.portfolioPage.campaigns : [];
  
  if (campaigns.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--color-silver-dim); padding:2rem;">هیچ کمپینی ثبت نشده است.</td></tr>`;
    return;
  }

  tbody.innerHTML = campaigns.map(c => `
    <tr>
      <td>
        <img src="${c.image || 'assets/silveriom_logo_transparent.png'}" class="table-thumb" onerror="this.src='assets/silveriom_logo_transparent.png'">
      </td>
      <td style="font-weight:700; color:#fff;">${c.brand || '---'}</td>
      <td>${c.title || '---'}</td>
      <td><span class="badge-tag">${c.category || 'عام'}</span></td>
      <td>${c.location || '---'}</td>
      <td>${c.media || '---'}</td>
      <td><span style="color:var(--color-neon); font-weight:700;">${c.impressions || '---'}</span></td>
      <td>
        <div style="display:flex; gap:0.5rem;">
          <button class="action-icon-btn" onclick="openCampaignModal('${c.id}')" title="ویرایش"><i data-lucide="edit"></i></button>
          <button class="action-icon-btn danger" onclick="deleteCampaign('${c.id}')" title="حذف"><i data-lucide="trash-2"></i></button>
        </div>
      </td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function openCampaignModal(id = null) {
  const modal = document.getElementById('modal-campaign');
  if (!modal) return;

  document.getElementById('campaign-form').reset();
  document.getElementById('camp-id').value = '';
  document.getElementById('camp-image-preview').style.display = 'none';

  if (id && state.portfolioPage && state.portfolioPage.campaigns) {
    const c = state.portfolioPage.campaigns.find(item => item.id === id);
    if (c) {
      document.getElementById('modal-campaign-title').textContent = 'ویرایش کمپین: ' + c.brand;
      document.getElementById('camp-id').value = c.id;
      document.getElementById('camp-brand').value = c.brand || '';
      document.getElementById('camp-title').value = c.title || '';
      document.getElementById('camp-category').value = c.category || '';
      document.getElementById('camp-location').value = c.location || '';
      document.getElementById('camp-media').value = c.media || '';
      document.getElementById('camp-desc').value = c.desc || '';
      document.getElementById('camp-date').value = c.date || '';
      document.getElementById('camp-impressions').value = c.impressions || '';
      document.getElementById('camp-image').value = c.image || '';

      if (c.image) {
        const prev = document.getElementById('camp-image-preview');
        prev.src = c.image;
        prev.style.display = 'block';
      }
    }
  } else {
    document.getElementById('modal-campaign-title').textContent = 'ثبت کمپین جدید';
  }

  modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

async function deleteCampaign(id) {
  if (!confirm('آیا از حذف این کمپین اطمینان دارید؟')) return;
  try {
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    });
    const data = await res.json();
    if (data.success && data.portfolioPage) {
      state.portfolioPage = data.portfolioPage;
    }
  } catch (err) {
    if (state.portfolioPage && state.portfolioPage.campaigns) {
      state.portfolioPage.campaigns = state.portfolioPage.campaigns.filter(c => c.id !== id);
    }
  }
  renderCampaignsTable();
  showToast('کمپین حذف گردید', 'info');
}

function setupGlobalSearch() {
  const searchInput = document.getElementById('global-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      renderAll();
      return;
    }

    const matchedVenues = state.venues.filter(v => 
      v.title.toLowerCase().includes(q) || (v.location && v.location.toLowerCase().includes(q))
    );
    state.venues = matchedVenues;
    renderVenues();
  });
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const iconMap = {
    success: 'check-circle',
    danger: 'alert-triangle',
    warning: 'alert-circle',
    info: 'info'
  };

  toast.innerHTML = `
    <i data-lucide="${iconMap[type] || 'info'}" style="color:${type === 'success' ? 'var(--color-neon)' : 'var(--color-neon)'}"></i>
    <span>${msg}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function renderAudience() {
  const aud = state.audience || {};
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };
  setVal('aud-title', aud.title);
  setVal('aud-subtitle', aud.subtitle);
  setVal('aud-stat1-label', aud.stat1?.label);
  setVal('aud-stat1-value', aud.stat1?.value);
  setVal('aud-stat2-label', aud.stat2?.label);
  setVal('aud-stat2-value', aud.stat2?.value);
}

// Attach event listener for Audience Form
document.addEventListener('DOMContentLoaded', () => {
  // wait for elements to exist
  setTimeout(() => {
    const audForm = document.getElementById('audience-form');
    if (audForm) {
      audForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        state.audience = {
          title: document.getElementById('aud-title').value,
          subtitle: document.getElementById('aud-subtitle').value,
          stat1: { label: document.getElementById('aud-stat1-label').value, value: document.getElementById('aud-stat1-value').value },
          stat2: { label: document.getElementById('aud-stat2-label').value, value: document.getElementById('aud-stat2-value').value }
        };
        await saveStateToServer();
        showToast('اطلاعات هوش مخاطب ذخیره شد', 'success');
      });
    }
  }, 500);
});

// === GLOBAL PERSISTENCE ENGINE ===
window.saveStateToServer = async function() {
  try {
    await fetch('api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save_all', state: state })
    });
  } catch (e) {
    console.error("Save failed", e);
  }
};

// Intercept all UI actions that update state (by overriding fetch)
// When any of the original fetch('/api/...') fails, they update the state locally in catch block.
// We intercept all those original fetches, wait for them to finish (and run their catch blocks),
// and THEN we save the global state to api.php!
const originalFetch = window.fetch;
window.fetch = async function(url, options) {
  const result = await originalFetch(url, options);
  
  if (typeof url === 'string' && url.startsWith('/api/')) {
    // Wait for the caller's catch block to finish mutating the state
    setTimeout(() => {
      window.saveStateToServer();
    }, 100);
  }
  
  return result;
};

// Also attach to delete buttons
document.addEventListener('click', (e) => {
  if (e.target.closest('.danger') || e.target.closest('[onclick^="delete"]')) {
    setTimeout(() => window.saveStateToServer(), 200);
  }
});

function clearSystemCache() {
  if(confirm("آیا از پاک کردن کش سیستم اطمینان دارید؟ این کار اطلاعات ذخیره نشده را پاک می‌کند.")){
    localStorage.clear();
    sessionStorage.clear();
    showToast("کش سیستم پاک شد. در حال بارگذاری مجدد...", "info");
    setTimeout(() => {
      window.location.reload(true);
    }, 1500);
  }
}


/* ==========================================================================
   EXCEL IMPORT LOGIC (MEDIA INVENTORY)
   ========================================================================== */
let pendingExcelMedia = [];

function handleExcelUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, {type: 'array'});
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);
    
    // Map Excel columns to our JSON structure
    pendingExcelMedia = json.map(row => {
      return {
        id: row['کد رسانه'] || 'SIL-' + Math.floor(Math.random()*10000),
        code: row['کد رسانه'] || '',
        title: row['عنوان سازه'] || '',
        tariff: row['تعرفه ماهانه'] || '',
        dimensions: row['ابعاد'] || '',
        views: row['بازدید ماهانه'] || '',
        print_type: row['نوع چاپ/متریال'] || '',
        audience: row['مخاطب'] || '',
        status: row['وضعیت'] === 'رزرو شده' ? 'reserved' : 'available',
        image: row['لینک تصویر'] || 'assets/placeholder_media.jpg',
        type: 'digital', // default
        location: 'tehran', // default
        display_pages: ['inventory'] // default
      };
    });

    renderExcelPreview();
  };
  reader.readAsArrayBuffer(file);
}

function renderExcelPreview() {
  const area = document.getElementById('excel-preview-area');
  const tbody = document.getElementById('excel-preview-tbody');
  
  if(pendingExcelMedia.length === 0) {
    area.style.display = 'none';
    return;
  }
  
  area.style.display = 'block';
  
  const typeOptions = `
    <option value="digital_board">بیلبورد دیجیتال</option>
    <option value="lightbox">لایت‌باکس</option>
    <option value="straboard">استرابورد</option>
    <option value="wall">دیواره تبلیغاتی</option>
  `;
  
  const locationOptions = `
    <option value="enghelab">پدل کلاب انقلاب</option>
    <option value="ajudaniyeh">کلاب آجودانیه</option>
    <option value="t10">کلاب T10</option>
    <option value="arena">آرنا کلاب</option>
    <option value="iran-zamin">ایران زمین</option>
    <option value="netra">نترا کلاب</option>
  `;

  // Provide multi-select for pages (we will use simple text input or select multiple for simplicity, but a nice UI is better.
  // We'll use a multiple select)
  const pageOptions = `
    <option value="home">صفحه اصلی (Home)</option>
    <option value="inventory" selected>نمایشگاه (Inventory)</option>
    <option value="club-enghelab">کلاب انقلاب</option>
    <option value="club-ajudaniyeh">کلاب آجودانیه</option>
    <option value="club-t10">کلاب T10</option>
    <option value="club-arena">کلاب آرنا</option>
    <option value="club-iran-zamin">ایران زمین</option>
    <option value="club-netra">نترا کلاب</option>
  `;

  let html = '';
  pendingExcelMedia.forEach((media, index) => {
    html += `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
        <td style="padding: 10px; font-weight: bold;">
            <div style="font-size: 11px; color: var(--color-neon);">${media.code}</div>
            <div>${media.title}</div>
        </td>
        <td style="padding: 10px;">
          <select class="glass-input-field" style="padding: 5px; font-size: 12px; height: auto;" onchange="pendingExcelMedia[${index}].type = this.value">
            ${typeOptions}
          </select>
        </td>
        <td style="padding: 10px;">
          <select class="glass-input-field" style="padding: 5px; font-size: 12px; height: auto;" onchange="pendingExcelMedia[${index}].location = this.value">
            ${locationOptions}
          </select>
        </td>
        <td style="padding: 10px;">
          <select class="glass-input-field" style="padding: 5px; font-size: 12px; height: auto;" multiple onchange="
            pendingExcelMedia[${index}].display_pages = Array.from(this.selectedOptions).map(o => o.value)
          ">
            ${pageOptions}
          </select>
          <div style="font-size: 10px; color:#888;">با Ctrl/Cmd چندتا انتخاب کنید</div>
        </td>
      </tr>
    `;
  });
  
  tbody.innerHTML = html;
}

async function saveExcelData() {
  if (!pendingExcelMedia || pendingExcelMedia.length === 0) return;
  
  try {
    showToast('در حال ذخیره‌سازی رسانه‌ها...', 'info');
    
    // Check if mediaInventory exists
    if (!state.mediaInventory) state.mediaInventory = [];
    
    // Append or replace?
    // We will update existing by code, or append new
    pendingExcelMedia.forEach(newMedia => {
      const idx = state.mediaInventory.findIndex(m => m.code === newMedia.code);
      if (idx >= 0) {
        state.mediaInventory[idx] = { ...state.mediaInventory[idx], ...newMedia };
      } else {
        state.mediaInventory.push(newMedia);
      }
    });
    
    await saveStateToServer();
    
    // Hide preview
    pendingExcelMedia = [];
    document.getElementById('excel-preview-area').style.display = 'none';
    
    renderMediaInventory();
    showToast('رسانه‌ها با موفقیت آپدیت و ذخیره شدند!', 'success');
  } catch (error) {
    showToast('خطا در ذخیره‌سازی: ' + error.message, 'error');
  }
}
