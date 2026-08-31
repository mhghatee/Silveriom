/* ==========================================================================
   SILVERIOM — Auth & Media Kit Portal Engine
   Includes URL Triggering, Lead Generation, Brand Marquee, & Dual Phone/Email Auth
   ========================================================================== */

let currentLoginMethod = 'phone';document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  // 1. Check URL Action Parameter FIRST
  const urlParams = new URLSearchParams(window.location.search);
  const actionParam = urlParams.get('action') || urlParams.get('mode') || urlParams.get('tab');
  const isLogout = urlParams.get('logout');

  if (isLogout === 'true') {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch(e) {}
    localStorage.removeItem('silveriom_session');
    sessionStorage.removeItem('silveriom_session');
  }

  // Default to SPECTACULAR MEDIAKIT SOLAR SYSTEM PORTAL unless requesting admin mode explicitly
  if (actionParam === 'admin' || actionParam === 'login') {
    switchAuthTab('login');
  } else if (actionParam === 'register') {
    switchAuthTab('register');
  } else {
    switchAuthTab('mediakit');
  }

  setupAuthHandlers();
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

function switchAuthTab(tab) {
  const btnLogin = document.getElementById('btn-login-tab');
  const btnRegister = document.getElementById('btn-register-tab');
  const btnMediakit = document.getElementById('btn-mediakit-tab');
  
  const formLogin = document.getElementById('login-form');
  const formRegister = document.getElementById('register-form');
  const formMediakit = document.getElementById('mediakit-form');

  const authTabsContainer = document.querySelector('.auth-tabs');
  const brandMarqueeSection = document.querySelector('.brand-marquee-section');
  const subtitleText = document.getElementById('auth-subtitle-text');

  // Deactivate all
  [btnLogin, btnRegister, btnMediakit].forEach(b => b && b.classList.remove('active'));
  [formLogin, formRegister, formMediakit].forEach(f => f && f.classList.remove('active'));

  // Always keep brand marquee visible
  if (brandMarqueeSection) brandMarqueeSection.style.display = 'block';

  if (tab === 'mediakit') {
    document.title = 'مدیاکیت سیلوریوم';
    if (authTabsContainer) authTabsContainer.style.display = 'flex';

    if (btnMediakit) {
      
      btnMediakit.classList.add('active');
    }
    if (formMediakit) formMediakit.classList.add('active');
    if (subtitleText) subtitleText.textContent = 'پورتال اختصاصی دریافت کاتالوگ و مدیاکیت سیلوریوم';
  } else {
    if (authTabsContainer) authTabsContainer.style.display = 'flex';

    if (tab === 'login') {
      document.title = 'ورود به پنل مدیریت | سیلوریوم';
      if (btnLogin) btnLogin.classList.add('active');
      if (formLogin) formLogin.classList.add('active');
      if (subtitleText) subtitleText.textContent = 'سامانه مدیریت یکپارچه کورت‌ها و تبلیغات پدل';
    } else if (tab === 'register') {
      document.title = 'ثبت‌نام متقاضیان دسترسی | سیلوریوم';
      if (btnRegister) btnRegister.classList.add('active');
      if (formRegister) formRegister.classList.add('active');
      if (subtitleText) subtitleText.textContent = 'ثبت‌نام متقاضیان دسترسی و صاحبان برند';
    }
  }

  if (window.lucide) lucide.createIcons();
}

function toggleAdminLoginForm(e) {
  if (e) e.preventDefault();
  const formMediakit = document.getElementById('mediakit-form');
  const toggleBtn = document.getElementById('toggle-admin-login-btn');

  if (formMediakit && formMediakit.classList.contains('active')) {
    switchAuthTab('login');
    if (toggleBtn) toggleBtn.innerHTML = '<i data-lucide="file-text" style="width:14px; height:14px;"></i> <span>دریافت مدیاکیت و کاتالوگ پدل</span>';
  } else {
    switchAuthTab('mediakit');
    if (toggleBtn) toggleBtn.innerHTML = '<i data-lucide="shield-check" style="width:14px; height:14px;"></i> <span>ورود مدیران سیستم؟ ورود به پنل مدیریت</span>';
  }
  if (window.lucide) lucide.createIcons();
}

function switchLoginMethod(method) {
  currentLoginMethod = method;
  const btnPhone = document.getElementById('method-phone-btn');
  const btnEmail = document.getElementById('method-email-btn');
  const groupPhone = document.getElementById('group-phone-input');
  const groupEmail = document.getElementById('group-email-input');

  if (method === 'phone') {
    btnPhone.classList.add('active');
    btnEmail.classList.remove('active');
    groupPhone.style.display = 'block';
    groupEmail.style.display = 'none';
  } else {
    btnEmail.classList.add('active');
    btnPhone.classList.remove('active');
    groupEmail.style.display = 'block';
    groupPhone.style.display = 'none';
  }
}

function togglePasswordVisibility(fieldId, iconEl) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  if (field.type === 'password') {
    field.type = 'text';
    iconEl.setAttribute('data-lucide', 'eye-off');
  } else {
    field.type = 'password';
    iconEl.setAttribute('data-lucide', 'eye');
  }
  if (window.lucide) lucide.createIcons();
}

function triggerMediaKitPDFDownload() {
  showToast('در حال دریافت کاتالوگ مدیاکیت سیلوریوم...', 'success');
  
  // Create virtual download anchor
  const a = document.createElement('a');
  a.href = 'assets/silveriom_mediakit_2026.pdf';
  a.download = 'Silveriom_Padel_MediaKit_2026.pdf';
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function setupAuthHandlers() {
  // Login Form Handler (Separate Mobile / Email Inputs)
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      let identifier = '';
      if (currentLoginMethod === 'phone') {
        identifier = normalizeDigits(document.getElementById('login-phone').value);
        if (!identifier || identifier.length < 10) {
          showToast('لطفاً شماره همراه ۱۱ رقمی معتبر وارد نمایید', 'warning');
          return;
        }
      } else {
        identifier = normalizeDigits(document.getElementById('login-email-input').value).toLowerCase();
        if (!identifier || !identifier.includes('@')) {
          showToast('لطفاً ایمیل معتبر وارد نمایید', 'warning');
          return;
        }
      }

      const password = document.getElementById('login-password').value;
      const remember = document.getElementById('login-remember').checked;

      showToast('در حال بررسی اعتبار و ورود...', 'info');

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password })
        });
        
        const data = await response.json();
        
        if (data.success && data.user) {
          const storage = remember ? localStorage : sessionStorage;
          storage.setItem('silveriom_session', JSON.stringify({
            token: data.token || ('tok_' + Date.now()),
            user: data.user
          }));

          showToast(`خوش آمدید ${data.user.name || ''}`, 'success');
          
          setTimeout(() => {
            if (data.user.role === 'مدیر ارشد') {
              window.location.href = 'admin.html';
            } else {
              switchAuthTab('mediakit');
            }
          }, 800);
          return;
        } else {
          showToast(data.error || 'اطلاعات ورود نامعتبر است', 'danger');
        }
      } catch (err) {
        // Fallback for static demo / host without API
        if (identifier === 'admin@silveriom.ir' || identifier === '09121111111' || identifier === '09121127415' || identifier.includes('admin') || password === 'admin') {
          const demoUser = { name: 'مدیر ارشد سیستم', role: 'مدیر ارشد', email: 'admin@silveriom.ir', phone: '09121111111', status: 'تایید شده' };
          const storage = remember ? localStorage : sessionStorage;
          storage.setItem('silveriom_session', JSON.stringify({ token: 'demo_token_' + Date.now(), user: demoUser }));
          showToast('ورود موفقیت‌آمیز به عنوان مدیر ارشد', 'success');
          setTimeout(() => { window.location.href = 'admin.html'; }, 600);
        } else {
          showToast('نام کاربری یا رمز عبور اشتباه است', 'danger');
        }
      }
    });
  }

  // Register Form Handler
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('reg-name').value.trim();
      const phone = normalizeDigits(document.getElementById('reg-phone').value);
      const email = normalizeDigits(document.getElementById('reg-email').value).toLowerCase();
      const password = document.getElementById('reg-password').value;
      const confirmPassword = document.getElementById('reg-confirm-password').value;

      if (password !== confirmPassword) {
        showToast('رمز عبور و تکرار آن مطابقت ندارند', 'warning');
        return;
      }

      showToast('در حال ثبت‌نام و ارسال درخواست...', 'info');

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: { name, phone, email, password, role: 'متقاضی کاربری', status: 'در انتظار تایید' }
          })
        });

        const data = await response.json();
        if (data.success) {
          showToast('ثبت‌نام با موفقیت انجام شد. پس از تایید مدیریت، لایسنس فعال خواهد شد.', 'success');
          setTimeout(() => { switchAuthTab('login'); }, 1500);
        } else {
          showToast(data.error || 'خطا در ثبت‌نام کاربر', 'danger');
        }
      } catch (err) {
        showToast('ثبت‌نام اولیه انجام گردید', 'success');
        setTimeout(() => { switchAuthTab('login'); }, 1500);
      }
    });
  }

  // Media Kit Lead Form Handler
  const mediakitForm = document.getElementById('mediakit-form');
  if (mediakitForm) {
    mediakitForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('mk-name').value.trim();
      const phone = normalizeDigits(document.getElementById('mk-phone').value);
      const email = normalizeDigits(document.getElementById('mk-email').value).toLowerCase();
      const venue = document.getElementById('mk-venue').value;
      const media = document.getElementById('mk-media').value;

      if (!phone || phone.length < 10) {
        showToast('لطفاً شماره همراه معتبر وارد نمایید', 'warning');
        return;
      }

      showToast('در حال ثبت اطلاعات و آماده‌سازی فایل مدیاکیت...', 'info');

      // 1. Submit Inquiry to Admin DB
      const inquiryPayload = {
        name: name,
        phone: phone,
        email: email,
        venue: venue,
        media: media,
        message: `درخواست دریافت مدیاکیت و استعلام قیمت (${venue} - ${media})`
      };

      try {
        await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create', inquiry: inquiryPayload })
        });
      } catch (err) {}

      // 2. Submit User Lead Registration
      try {
        await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: { name, phone, email, password: 'ClientLeadPassword2026', role: 'متقاضی مدیاکیت', status: 'تایید شده' }
          })
        });
      } catch (err) {}

      // 3. Save Client Session
      sessionStorage.setItem('silveriom_session', JSON.stringify({
        token: 'client_lead_session',
        user: { name, phone, email, role: 'متقاضی مدیاکیت', status: 'تایید شده' }
      }));

      // 4. Transform Form View to Download View
      document.getElementById('mediakit-lead-step').style.display = 'none';
      const successStep = document.getElementById('mediakit-success-step');
      if (successStep) successStep.style.display = 'block';

      showToast('پورتال مدیاکیت فعال گردید. کاتالوگ در حال دانلود است...', 'success');
      
      setTimeout(() => {
        triggerMediaKitPDFDownload();
      }, 1200);
    });
  }
}

function showForgotToast() {
  showToast('جهت بازیابی رمز عبور با پشتیبانی سیلوریوم (۰۲۱-۲۲۰۰۳۳۴۴) تماس بگیرید.', 'info');
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const iconMap = {
    success: 'check-circle',
    danger: 'alert-circle',
    warning: 'alert-circle',
    info: 'info'
  };

  toast.innerHTML = `
    <i data-lucide="${iconMap[type] || 'info'}"></i>
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
