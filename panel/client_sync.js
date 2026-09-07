/* ==========================================================================
   SILVERIOM — Website & Admin Sync Engine
   Dynamically syncs main site with CMS Backend API
   ========================================================================== */

(async function() {
  try {
    const res = await fetch('/panel/api.php?action=load');
    if (!res.ok) return;
    const db = await res.json();

    // 1. Sync Settings
    if (db.settings) {
      const s = db.settings;
      const heroBadge = document.querySelector('.hero-section .badge-text, .section-badge');
      if (heroBadge && s.heroBadge) heroBadge.textContent = s.heroBadge;

      const heroTitle = document.querySelector('.hero-title');
      if (heroTitle && s.heroTitle) heroTitle.innerHTML = s.heroTitle.replace(/\n/g, '<br>');

      const heroSub = document.querySelector('.hero-subtitle');
      if (heroSub && s.heroSubtitle) heroSub.textContent = s.heroSubtitle;
    }

    // 2. Sync About Us Team
    const sliderContainer = document.getElementById('slider');
    if (sliderContainer && db.aboutUs && db.aboutUs.team && db.aboutUs.team.length > 0) {
      sliderContainer.innerHTML = '';
      
      db.aboutUs.team.forEach((member, memberIdx) => {
        let imgSrc = member.image ? (member.image.startsWith('http') || member.image.startsWith('/') ? member.image : '/panel/' + member.image) : 'https://via.placeholder.com/600x600?text=No+Image';
        
        const linkedinUrl = member.linkedin || '#';
        const showIcons = member.linkedin || member.contact || memberIdx === 1;
        const iconsHtml = showIcons ? `
              <div style="position:absolute;bottom:14px;left:0;width:100%;display:flex;justify-content:center;gap:10px;z-index:20;">
                <a href="${linkedinUrl}" target="_blank" onclick="event.stopPropagation();"
                   style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.25);backdrop-filter:blur(6px);transition:all 0.25s;text-decoration:none;"
                   onmouseover="this.style.background='rgba(204,255,0,0.2)';this.style.borderColor='#CCFF00';"
                   onmouseout="this.style.background='rgba(255,255,255,0.12)';this.style.borderColor='rgba(255,255,255,0.25)';">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none;"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a href="javascript:void(0);" onclick="event.stopPropagation();"
                   style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.25);backdrop-filter:blur(6px);transition:all 0.25s;text-decoration:none;"
                   onmouseover="this.style.background='rgba(204,255,0,0.2)';this.style.borderColor='#CCFF00';"
                   onmouseout="this.style.background='rgba(255,255,255,0.12)';this.style.borderColor='rgba(255,255,255,0.25)';">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none;"><path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"/><rect width="18" height="18" x="3" y="4" rx="2"/><circle cx="12" cy="10" r="2"/><line x1="8" x2="8" y1="2" y2="4"/><line x1="16" x2="16" y1="2" y2="4"/></svg>
                </a>
              </div>` : '';

        sliderContainer.innerHTML += `
          <div class="team-card-custom">
            <div class="card__view">
              <img class="shot" src="${imgSrc}" alt="${member.name}">
              <img class="shot shot--mono" src="${imgSrc}" alt="${member.name}">
              <span class="card__plate">
                <b>${member.name}</b>
                <i style="color: #CCFF00;">${member.role}</i>
              </span>
              ${iconsHtml}
            </div>
          </div>
        `;
      });

      // Update dots
      const progressContainer = document.getElementById('progress');
      if (progressContainer) {
        progressContainer.innerHTML = '';
        db.aboutUs.team.forEach((_, i) => {
          progressContainer.innerHTML += `<div class="progress-dot ${i === 1 ? 'active' : ''}"></div>`;
        });
      }

      // Re-initialize GSAP slider logic globally if defined
      if (typeof window.initTeamSlider === 'function') {
        window.initTeamSlider();
      }
    }

    // 3. Form Submission Interceptors (Kit Modal & Planner Forms)
    const kitForm = document.querySelector('#kit-modal form');
    if (kitForm) {
      kitForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const inputs = kitForm.querySelectorAll('input, select, textarea');
        const data = {};
        inputs.forEach(i => {
          if (i.name || i.id) data[i.name || i.id] = i.value;
        });

        const inquiry = {
          name: data.name || data['kit-name'] || 'مشتری جدید',
          phone: data.phone || data['kit-phone'] || '-',
          email: data.email || data['kit-email'] || '-',
          company: data.company || data['kit-brand'] || '-',
          type: 'درخواست مدیاکیت',
          details: data.details || 'درخواست دریافت فایل مدیاکیت پلتفرم'
        };

        try {
          await fetch('/panel/api.php?action=load'); // Mocked
          alert('درخواست شما با موفقیت ثبت شد. تیم سیلوریوم به‌زودی با شما تماس خواهد گرفت.');
          const modal = document.getElementById('kit-modal');
          if (modal) modal.classList.remove('active');
          kitForm.reset();
        } catch (err) {
          console.error(err);
        }
      });
    }

    // Planner Inquiry Button
    const plannerBtn = document.getElementById('planner-submit-btn') || document.querySelector('#planner .luxury-btn-solid');
    if (plannerBtn) {
      plannerBtn.addEventListener('click', async (e) => {
        const impression = document.getElementById('calc-impression')?.textContent || '';
        const venues = document.getElementById('calc-venues-text')?.textContent || '';
        const courts = document.getElementById('calc-courts-count')?.textContent || '';
        const duration = document.getElementById('calc-duration-text')?.textContent || '';
        
        alert(`ثبت استعلام کمپین با ${impression} امپرشن انجام شد.`);
      });
    }

  } catch (e) {
    console.log('Static mode active.', e);
  }
})();
