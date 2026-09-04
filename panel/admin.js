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
    const m = state.mediaInventory.find(item => item.id === id);
    if (m) {
      title.textContent = 'ویرایش سازه تبلیغاتی';
      document.getElementById('media-id').value = m.id || '';
      document.getElementById('media-title').value = m.title || m.name || '';
      if(document.getElementById('media-tag')) document.getElementById('media-tag').value = m.tag || '';
      if(document.getElementById('media-impact')) document.getElementById('media-impact').value = m.impact || '';
      if(document.getElementById('media-specs')) document.getElementById('media-specs').value = m.specs || m.dimensions || '';
      if(document.getElementById('media-avail')) document.getElementById('media-avail').value = m.avail || m.status || '';
      if(document.getElementById('media-desc')) document.getElementById('media-desc').value = m.desc || '';
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
      document.getElementById('media-id').value = m.id || '';
      document.getElementById('media-title').value = m.title || m.name || '';
      if(document.getElementById('media-tag')) document.getElementById('media-tag').value = m.tag || '';
      if(document.getElementById('media-impact')) document.getElementById('media-impact').value = m.impact || '';
      if(document.getElementById('media-specs')) document.getElementById('media-specs').value = m.specs || m.dimensions || '';
      if(document.getElementById('media-avail')) document.getElementById('media-avail').value = m.avail || m.status || '';
      if(document.getElementById('media-desc')) document.getElementById('media-desc').value = m.desc || '';
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
    const m = state.mediaInventory.find(item => item.id === id);
    if (m) {
      title.textContent = 'ویرایش سازه تبلیغاتی';
      document.getElementById('media-id').value = m.id || '';
      document.getElementById('media-title').value = m.title || m.name || '';
      if(document.getElementById('media-tag')) document.getElementById('media-tag').value = m.tag || '';
      if(document.getElementById('media-impact')) document.getElementById('media-impact').value = m.impact || '';
      if(document.getElementById('media-specs')) document.getElementById('media-specs').value = m.specs || m.dimensions || '';
      if(document.getElementById('media-avail')) document.getElementById('media-avail').value = m.avail || m.status || '';
      if(document.getElementById('media-desc')) document.getElementById('media-desc').value = m.desc || '';
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
    const m = state.mediaInventory.find(item => item.id === id);
    if (m) {
      title.textContent = 'ویرایش سازه تبلیغاتی';
      document.getElementById('media-id').value = m.id || '';
      document.getElementById('media-title').value = m.title || m.name || '';
      if(document.getElementById('media-tag')) document.getElementById('media-tag').value = m.tag || '';
      if(document.getElementById('media-impact')) document.getElementById('media-impact').value = m.impact || '';
      if(document.getElementById('media-specs')) document.getElementById('media-specs').value = m.specs || m.dimensions || '';
      if(document.getElementById('media-avail')) document.getElementById('media-avail').value = m.avail || m.status || '';
      if(document.getElementById('media-desc')) document.getElementById('media-desc').value = m.desc || '';
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
    const m = state.mediaInventory.find(item => item.id === id);
    if (m) {
      title.textContent = 'ویرایش سازه تبلیغاتی';
      document.getElementById('media-id').value = m.id || '';
      document.getElementById('media-title').value = m.title || m.name || '';
      if(document.getElementById('media-tag')) document.getElementById('media-tag').value = m.tag || '';
      if(document.getElementById('media-impact')) document.getElementById('media-impact').value = m.impact || '';
      if(document.getElementById('media-specs')) document.getElementById('media-specs').value = m.specs || m.dimensions || '';
      if(document.getElementById('media-avail')) document.getElementById('media-avail').value = m.avail || m.status || '';
      if(document.getElementById('media-desc')) document.getElementById('media-desc').value = m.desc || '';
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
    
    // We only update the basic fields from this modal, so we don't overwrite the advanced properties set from Excel
    const id = document.getElementById('media-id').value || ('SIL-' + Date.now());
    let mIndex = state.mediaInventory.findIndex(m => m.id === id);
    
    let mediaObj = mIndex > -1 ? state.mediaInventory[mIndex] : { id: id };
    
    mediaObj.title = document.getElementById('media-title') ? document.getElementById('media-title').value : mediaObj.title;
    if(document.getElementById('media-tag')) mediaObj.tag = document.getElementById('media-tag').value;
    if(document.getElementById('media-impact')) mediaObj.impact = document.getElementById('media-impact').value;
    if(document.getElementById('media-specs')) {
        mediaObj.specs = document.getElementById('media-specs').value;
        mediaObj.dimensions = mediaObj.specs;
    }
    if(document.getElementById('media-avail')) {
        mediaObj.avail = document.getElementById('media-avail').value;
        mediaObj.status = mediaObj.avail;
    }
    if(document.getElementById('media-desc')) mediaObj.desc = document.getElementById('media-desc').value;

    if (mIndex > -1) {
        state.mediaInventory[mIndex] = mediaObj;
    } else {
        state.mediaInventory.push(mediaObj);
    }

    try {
      await saveStateToServer();
      closeModal('modal-media');
      renderMedia();
      showToast('سازه تبلیغاتی با موفقیت ذخیره شد', 'success');
    } catch (err) {
      showToast('خطا در ذخیره‌سازی: ' + err.message, 'error');
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
    
    renderMedia();
    showToast('رسانه‌ها با موفقیت آپدیت و ذخیره شدند!', 'success');
  } catch (error) {
    showToast('خطا در ذخیره‌سازی: ' + error.message, 'error');
  }
}
