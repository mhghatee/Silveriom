/* ==========================================================================
   SILVERIOM — Website & Admin Sync Engine
   Dynamically syncs main site with CMS Backend API
   ========================================================================== */

(async function() {
  try {
    const res = await fetch('https://panel.silveriom.ir/api.php?action=load');
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
        
                        const isCEO = member.name && member.name.includes('قطعی');
        const linkedinUrl = isCEO ? 'https://www.linkedin.com/in/mohammad-hosein-ghatee-21a2b1152/' : (member.linkedin || '#');
        const vcardUrl = isCEO ? 'https://silveriom.ir/team/mhg' : (member.contact || '#');
        const showIcons = member.linkedin || member.contact || isCEO;
        const iconsHtml = showIcons ? `
              <div style="position:absolute;bottom:14px;left:0;width:100%;display:flex;justify-content:center;gap:10px;z-index:20;">
                <a href="${linkedinUrl}" target="_blank" onclick="event.stopPropagation();"
                   style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.25);backdrop-filter:blur(6px);transition:all 0.25s;text-decoration:none;"
                   onmouseover="this.style.background='rgba(204,255,0,0.2)';this.style.borderColor='#CCFF00';"
                   onmouseout="this.style.background='rgba(255,255,255,0.12)';this.style.borderColor='rgba(255,255,255,0.25)';">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none;"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a href="${vcardUrl}" target="_blank" onclick="event.stopPropagation();"
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
        
        // Add navigation arrows dynamically
        const progressContainer = document.getElementById('progress');
        if (progressContainer && progressContainer.parentElement && !document.getElementById('team-prev-btn')) {
            const navControls = progressContainer.parentElement;
            navControls.style.display = 'flex';
            navControls.style.alignItems = 'center';
            navControls.style.justifyContent = 'center';
            navControls.style.gap = '15px';
            
            // Override GSAP slider functions safely if they aren't exposed
            const originalInit = window.initTeamSlider.toString();
            if(!window.nextTeamCard && originalInit.includes('logicalIndex')) {
                // If they are not exposed, we simulate a click on the next/prev dots or cards
                window.nextTeamCard = () => {
                    const cards = document.querySelectorAll('.team-card-custom');
                    if(cards.length > 1) {
                        let activeIdx = -1;
                        document.querySelectorAll('.progress-dot').forEach((d, i) => { if(d.classList.contains('active')) activeIdx = i; });
                        if(activeIdx >= 0) {
                            let nextIdx = (activeIdx + 1) % cards.length;
                            cards[nextIdx].click();
                        }
                    }
                };
                window.prevTeamCard = () => {
                    const cards = document.querySelectorAll('.team-card-custom');
                    if(cards.length > 1) {
                        let activeIdx = -1;
                        document.querySelectorAll('.progress-dot').forEach((d, i) => { if(d.classList.contains('active')) activeIdx = i; });
                        if(activeIdx >= 0) {
                            let prevIdx = (activeIdx - 1 + cards.length) % cards.length;
                            cards[prevIdx].click();
                        }
                    }
                };
            }
            
            const prevBtn = document.createElement('button');
            prevBtn.id = 'team-prev-btn';
            prevBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CCFF00" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>';
            prevBtn.style.background = 'transparent';
            prevBtn.style.border = '1px solid rgba(255,255,255,0.1)';
            prevBtn.style.borderRadius = '50%';
            prevBtn.style.width = '44px';
            prevBtn.style.height = '44px';
            prevBtn.style.cursor = 'pointer';
            prevBtn.style.display = 'flex';
            prevBtn.style.alignItems = 'center';
            prevBtn.style.justifyContent = 'center';
            prevBtn.style.transition = 'all 0.3s ease';
            prevBtn.onmouseover = () => { prevBtn.style.background = 'rgba(204,255,0,0.1)'; prevBtn.style.borderColor = '#CCFF00'; };
            prevBtn.onmouseout = () => { prevBtn.style.background = 'transparent'; prevBtn.style.border = '1px solid rgba(255,255,255,0.1)'; };
            
            const nextBtn = prevBtn.cloneNode(true);
            nextBtn.id = 'team-next-btn';
            nextBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CCFF00" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';
            nextBtn.onmouseover = () => { nextBtn.style.background = 'rgba(204,255,0,0.1)'; nextBtn.style.borderColor = '#CCFF00'; };
            nextBtn.onmouseout = () => { nextBtn.style.background = 'transparent'; nextBtn.style.border = '1px solid rgba(255,255,255,0.1)'; };
            
            navControls.insertBefore(prevBtn, progressContainer);
            navControls.appendChild(nextBtn);
            
            prevBtn.addEventListener('click', () => { if(window.prevTeamCard) window.prevTeamCard(); });
            nextBtn.addEventListener('click', () => { if(window.nextTeamCard) window.nextTeamCard(); });
        }
      }
    }

    // 2b. Sync Brands Section
    const brandsGrid = document.querySelector('.ios26-card') ? document.querySelector('.ios26-card').closest('[style*="grid-template-columns"]') : null;
    if (brandsGrid && db.aboutUs && db.aboutUs.brands && db.aboutUs.brands.length > 0) {
      brandsGrid.innerHTML = '';
      db.aboutUs.brands.forEach(brand => {
        const imgSrc = brand.image || '';
        const isLive = brand.status === 'live';
        const statusBadge = isLive
          ? `<span class="status-badge status-live"><span class="dot-live"></span> LIVE</span>`
          : `<span class="status-badge status-finished"><span class="dot-finished"></span> FINISHED</span>`;
        brandsGrid.innerHTML += `
          <div class="ios26-card">
            <div class="ios26-banner" style="background-image: url('${imgSrc}');"></div>
            <div class="ios26-content">
              <h3 class="ios26-title">${brand.name || ''}</h3>
              <p class="ios26-desc">${brand.desc || ''}</p>
              <div class="ios26-meta">
                <span class="ios26-date">${brand.date || ''}</span>
                ${statusBadge}
              </div>
            </div>
          </div>`;
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
          await fetch('https://panel.silveriom.ir/api.php?action=load'); // Mocked
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
        const impression = (document.getElementById('calc-impression') ? document.getElementById('calc-impression').textContent : '') || '';
        const venues = (document.getElementById('calc-venues-text') ? document.getElementById('calc-venues-text').textContent : '') || '';
        const courts = (document.getElementById('calc-courts-count') ? document.getElementById('calc-courts-count').textContent : '') || '';
        const duration = (document.getElementById('calc-duration-text') ? document.getElementById('calc-duration-text').textContent : '') || '';
        
        alert(`ثبت استعلام کمپین با ${impression} امپرشن انجام شد.`);
      });
    }

  } catch (e) {
    console.log('Static mode active.', e);
  }
})();
