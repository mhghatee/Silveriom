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
    const teamGrid = document.getElementById('dynamic-team-grid');
    if (teamGrid && db.aboutUs && db.aboutUs.team && db.aboutUs.team.length > 0) {
      teamGrid.innerHTML = '';
      db.aboutUs.team.forEach(member => {
        teamGrid.innerHTML += `
        <div class="glass-card square-team-card" style="border-radius: 28px; background: rgba(11, 19, 38, 0.78); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.12); overflow: hidden; padding: 18px;">
          <div style="width: 100%; aspect-ratio: 1 / 1; border-radius: 22px; overflow: hidden; position: relative; margin-bottom: 20px;">
            <img src="${member.image ? (member.image.startsWith('http') || member.image.startsWith('/') ? member.image : '/panel/' + member.image) : 'https://via.placeholder.com/600x600?text=No+Image'}" alt="${member.name}" class="square-team-img" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;">
            <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 65%, rgba(7,10,17,0.85) 100%);"></div>
            <span style="position: absolute; bottom: 12px; right: 12px; background: #CCFF00; color: #070A11; font-weight: 900; font-size: 11px; padding: 4px 12px; border-radius: 12px;">${member.role}</span>
          </div>
          <div style="text-align: center; padding: 0 8px 8px;">
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #ffffff; margin-bottom: 4px;">${member.name}</h3>
            <p style="color: #94A3B8; font-size: 12px; line-height: 1.7;">
              ${member.bio || ''}
            </p>
          </div>
        </div>
        `;
      });
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
