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
      
      db.aboutUs.team.forEach(member => {
        let imgSrc = member.image ? (member.image.startsWith('http') || member.image.startsWith('/') ? member.image : '/panel/' + member.image) : 'https://via.placeholder.com/600x600?text=No+Image';
        
        sliderContainer.innerHTML += `
          <div class="team-card-custom">
            <div class="card__view">
              <img class="shot" src="${imgSrc}" alt="${member.name}">
              <img class="shot shot--mono" src="${imgSrc}" alt="${member.name}">
              <span class="card__plate">
                <b>${member.name}</b>
                <i style="color: #CCFF00;">${member.role}</i>
              </span>
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
