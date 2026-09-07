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

function triggerMediaKitPDFDownload(venue = 'all', media = 'all', name = 'نامشخص', brand = 'کاربر پورتال') {
  showToast('در حال آماده‌سازی و انتقال به پلتفرم مدیاکیت...', 'success');
  
  // Redirect to proposal page with ALL_INVENTORY and parameters
  setTimeout(() => {
    window.location.href = `../proposal/index.html?id=ALL_INVENTORY&venue=${venue}&media=${media}&name=${encodeURIComponent(name)}&brand=${encodeURIComponent(brand)}`;
  }, 800);
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

      showToast('پورتال مدیاکیت فعال گردید. در حال انتقال به لینک مدیاکیت...', 'success');
      
      setTimeout(() => {
        const brandInput = document.getElementById('mk-brand'); const brand = (brandInput && brandInput.value.trim()) ? brandInput.value.trim() : name; triggerMediaKitPDFDownload(venue, media, name, brand);
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

/* ===== Custom Tennis Captcha Logic ===== */
document.addEventListener('DOMContentLoaded', () => {
    const ballB64 = "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";
    const captchaContainers = document.querySelectorAll('.tennis-captcha-container');
    
    captchaContainers.forEach((container, index) => {
        // Find the closest submit button
        const form = container.closest('form');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';
        }
        
        // Build DOM
        const box = document.createElement('div');
        box.className = 'captcha-box';
        
        const title = document.createElement('div');
        title.className = 'captcha-title';
        title.innerText = 'جهت تایید، توپ را روی راکت بکشید';
        
        const track = document.createElement('div');
        track.className = 'captcha-track';
        
        const bg = document.createElement('div');
        bg.className = 'captcha-success-bg';
        
        const text = document.createElement('div');
        text.className = 'captcha-text';
        text.innerText = 'توپ را بکشید 👉';
        
        const target = document.createElement('div');
        target.className = 'captcha-target';
        target.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>';
        
        const ball = document.createElement('div');
        ball.className = 'captcha-ball';
        ball.style.backgroundImage = `url(data:image/png;base64,${ballB64})`;
        ball.style.backgroundSize = 'cover';
        ball.style.backgroundPosition = 'center';
        ball.style.boxShadow = '0 0 10px rgba(180, 211, 34, 0.4), inset -2px -2px 6px rgba(0,0,0,0.3)';
        
        // Assemble
        track.appendChild(bg);
        track.appendChild(text);
        track.appendChild(target);
        track.appendChild(ball);
        box.appendChild(title);
        box.appendChild(track);
        container.appendChild(box);
        
        // Logic
        let isDragging = false;
        let startX = 0;
        let currentX = 4;
        let maxDrag = 0;
        let isSuccess = false;
        
        const init = () => {
            maxDrag = track.offsetWidth - ball.offsetWidth - 8;
        };
        setTimeout(init, 100);
        window.addEventListener('resize', init);
        
        const getClientX = (e) => e.touches ? e.touches[0].clientX : e.clientX;
        
        const onStart = (e) => {
            if (isSuccess) return;
            isDragging = true;
            startX = getClientX(e) - currentX;
            ball.style.cursor = 'grabbing';
            ball.style.transition = 'none';
            bg.style.transition = 'none';
        };
        
        const onMove = (e) => {
            if (!isDragging || isSuccess) return;
            let x = getClientX(e) - startX;
            if (x < 4) x = 4;
            if (x > maxDrag) x = maxDrag;
            currentX = x;
            ball.style.transform = `translateX(${x - 4}px)`;
            bg.style.width = (x + 18) + 'px';
            text.style.opacity = 1 - (x / (maxDrag * 0.6));
            
            if (x >= maxDrag - 3) {
                success();
            }
        };
        
        const onEnd = () => {
            if (!isDragging || isSuccess) return;
            isDragging = false;
            ball.style.cursor = 'grab';
            ball.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            bg.style.transition = 'width 0.5s ease';
            currentX = 4;
            ball.style.transform = 'translateX(0px)';
            bg.style.width = '0';
            text.style.opacity = 1;
        };
        
        const success = () => {
            isSuccess = true;
            isDragging = false;
            ball.style.transform = `translateX(${maxDrag - 4}px)`;
            bg.style.width = '100%';
            box.classList.add('success');
            text.style.opacity = 0;
            title.innerText = 'تایید شد! 🎾';
            title.style.color = '#4ade80';
            
            // Add a green glowing effect to the ball
            ball.style.boxShadow = '0 0 20px rgba(74, 222, 128, 0.8), inset -2px -2px 6px rgba(0,0,0,0.3)';
            
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
            }
            
            // Append hidden token for backend if needed
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'captcha_token';
            hiddenInput.value = 'tennis_verified_' + Date.now();
            form.appendChild(hiddenInput);
        };
        
        ball.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
        
        ball.addEventListener('touchstart', onStart, {passive: true});
        document.addEventListener('touchmove', onMove, {passive: true});
        document.addEventListener('touchend', onEnd);
    });
});
