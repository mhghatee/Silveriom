document.addEventListener("DOMContentLoaded", function() {
      // 1. Get current normalized path
      let currentPath = window.location.pathname;
      if (currentPath.endsWith('/index.html')) {
        currentPath = currentPath.replace('/index.html', '/');
      }
      
      // Helper to normalize href for comparison
      function normalizeHref(href) {
        if (!href) return null;
        try {
          // Absolute URLs and relative URLs are parsed
          const url = new URL(href, window.location.origin);
          let p = url.pathname;
          if (p.endsWith('/index.html')) p = p.replace('/index.html', '/');
          return p;
        } catch (e) {
          return null;
        }
      }

      // 2. Update Desktop Nav Items
      const navItems = document.querySelectorAll('.nav-links .nav-item');
      navItems.forEach(item => {
        item.classList.remove('active');
        const itemPath = normalizeHref(item.getAttribute('href'));
        if (itemPath === currentPath) {
          item.classList.add('active');
        }
      });

      // 3. Update Mobile Drawer Cards
      const mobileCards = document.querySelectorAll('.mobile-nav-card');
      mobileCards.forEach(card => {
        card.classList.remove('active');
        const cardPath = normalizeHref(card.getAttribute('href'));
        if (cardPath === currentPath) {
          card.classList.add('active');
        }
      });
    });

document.addEventListener('DOMContentLoaded', () => {
      if (window.renderMediaShowcase) {
          window.renderMediaShowcase('productGrid', 'inventory'); setTimeout(filterAssets, 500);
      }
  });

document.addEventListener("DOMContentLoaded", function() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    filterAssets();
  });

  function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const arrow = header.querySelector('.acc-arrow');
    if (content.style.display === 'none') {
      content.style.display = 'flex';
      if (arrow) arrow.style.transform = 'rotate(0deg)';
    } else {
      content.style.display = 'none';
      if (arrow) arrow.style.transform = 'rotate(-90deg)';
    }
  }

  let selectedDayNum = 15;

  function resetSidebarFilters() {
    document.querySelectorAll('.venue-cb').forEach(cb => cb.checked = true);
    document.querySelectorAll('.media-cb').forEach(cb => cb.checked = true);
    document.getElementById('sidebarSearchInput').value = '';
    filterAssets();
  }

  function filterAssets() {
    const searchInput = document.getElementById('sidebarSearchInput');
    const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    const checkedVenues = Array.from(document.querySelectorAll('.venue-cb:checked')).map(cb => cb.value);
    
    const cards = document.querySelectorAll('.media-showcase-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const locEl = card.querySelector('.msc-location');
      const titleEl = card.querySelector('.msc-title');
      const cardVenueText = locEl ? locEl.textContent : '';
      const cardTitle = titleEl ? titleEl.textContent.toLowerCase() : '';
      
      let cardVenue = '';
      if(cardVenueText.includes('آزادی') || cardVenueText.includes('arena')) cardVenue = 'azadi';
      else if(cardVenueText.includes('لواسان') || cardVenueText.includes('netra')) cardVenue = 'lavasan';
      else if(cardVenueText.includes('آجودانیه') || cardVenueText.includes('t10')) cardVenue = 'ajudaniyeh';
      else if(cardVenueText.includes('شهرک غرب') || cardVenueText.includes('iran')) cardVenue = 'shahrak';
      else if(cardVenueText.includes('ساری') || cardVenueText.includes('asayesh')) cardVenue = 'sari';
      else if(cardVenueText.includes('انقلاب')) cardVenue = 'enghelab';

      const matchesVenue = checkedVenues.includes(cardVenue) || checkedVenues.length === 0;
      const matchesSearch = (searchVal === '' || cardTitle.includes(searchVal));

      if (matchesVenue && matchesSearch) {
        card.style.setProperty('display', 'flex', 'important');
        card.style.setProperty('opacity', '1', 'important');
        card.style.setProperty('visibility', 'visible', 'important');
        visibleCount++;
      } else {
        card.style.setProperty('display', 'none', 'important');
      }
    });

    const badge = document.getElementById('activeCountBadge');
    if (badge) {
      badge.innerText = `${visibleCount.toLocaleString('fa-IR')} سازه فعال`;
    }
  }

  // Reservation Modal & Calendar Controls
  function openReservationModal(code, title, price) {
    document.getElementById('modalTargetTitle').innerText = title;
    document.getElementById('modalTargetCode').innerText = `کد سازه: ${code} | تعرفه ماهانه: ${price} میلیون تومان`;
    document.getElementById('modalReserveSuccess').style.display = 'none';
    document.getElementById('btnSubmitModalReserve').style.display = 'block';
    document.getElementById('reservationModal').style.display = 'flex';
  }

  function closeReservationModal() {
    document.getElementById('reservationModal').style.display = 'none';
  }

  function selectCalendarDay(cell, day) {
    document.querySelectorAll('.calendar-day-cell').forEach(c => c.classList.remove('selected'));
    cell.classList.add('selected');
    selectedDayNum = day;
    document.getElementById('selectedDateDisplay').innerText = `روز انتخابی: ${day.toLocaleString('fa-IR')}ام`;
  }

  function submitReservationForm(e) {
    e.preventDefault();
    document.getElementById('btnSubmitModalReserve').style.display = 'none';
    document.getElementById('modalReserveSuccess').style.display = 'block';
  }







/**
 * ==========================================================================
 * SILVERIOM — CINEMATIC SCROLL-DRIVEN 3D BACKGROUND MOTION ENGINE
 * Pure Background Ball & Racket Kinematics (Zero Foreground Clutter)
 * ==========================================================================
 */
(function() {
  // 1. Ambient WebGL Particle Lighting Canvas (No foreground meshes)
  const canvas = document.getElementById("webgl-canvas");
  if (canvas && typeof THREE !== "undefined") {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particleCount = 160;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 24;
      particlePos[i+1] = (Math.random() - 0.5) * 18;
      particlePos[i+2] = (Math.random() - 0.5) * 12;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00F0FF,
      size: 0.04,
      transparent: true,
      opacity: 0.35
    });
    const dustParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(dustParticles);

    const cursorGlow = new THREE.PointLight(0x00F0FF, 1.8, 10);
    cursorGlow.position.set(0, 0, 4);
    scene.add(cursorGlow);

    const particleMouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    window.addEventListener("mousemove", (e) => {
      particleMouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      particleMouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    const clock = new THREE.Clock();
    function animateParticles() {
      requestAnimationFrame(animateParticles);
      const time = clock.getElapsedTime();
      particleMouse.x += (particleMouse.targetX - particleMouse.x) * 0.05;
      particleMouse.y += (particleMouse.targetY - particleMouse.y) * 0.05;

      dustParticles.rotation.y = time * 0.02;
      dustParticles.rotation.x = time * 0.01;
      cursorGlow.position.x = particleMouse.x * 6;
      cursorGlow.position.y = particleMouse.y * 4.5;

      renderer.render(scene, camera);
    }
    animateParticles();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // 2. High-Performance Scroll-Driven & Mouse 3D Kinetic Motion for Background Racket & Ball
  const bgImg = document.getElementById("cinematic-bg-img");
  const bgGlow = document.querySelector(".bg-energy-glow");

  let currentScrollProgress = 0;
  let targetScrollProgress = 0;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  window.addEventListener("scroll", () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    targetScrollProgress = totalScroll > 0 ? window.scrollY / totalScroll : 0;
  }, { passive: true });

  window.addEventListener("mousemove", (e) => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // Kinematic Keyframes: Giving dramatic 3D transformation to the ball and racket in the photo
  function getBgKeyframe(p) {
    let x = 0, y = 0, scale = 1.05, rotX = 0, rotY = 0, rotZ = 0, glowOpacity = 0.85;

    if (p <= 0.25) {
      // Venues Map: Shifts left and tilts upward to focus on racket core and let map shine
      const t = p / 0.25;
      const easeT = t * t * (3 - 2 * t);
      x = 0 + (-65 * easeT);
      y = 0 + (-35 * easeT);
      scale = 1.05 + (0.08 * easeT);
      rotX = 0 + (4.5 * easeT);
      rotY = 0 + (-5.5 * easeT);
      rotZ = 0 + (2.0 * easeT);
      glowOpacity = 0.85 + 0.25 * Math.sin(t * Math.PI);
    } else if (p <= 0.50) {
      // Complexes: Shifts over to the right and zooms in to highlight the glowing ball
      const t = (p - 0.25) / 0.25;
      const easeT = t * t * (3 - 2 * t);
      x = -65 + (140 * easeT); // -65 -> +75
      y = -35 + (-30 * easeT); // -35 -> -65
      scale = 1.13 + (0.09 * easeT); // 1.13 -> 1.22
      rotX = 4.5 + (-8.5 * easeT);
      rotY = -5.5 + (10.5 * easeT);
      rotZ = 2.0 + (-4.0 * easeT);
      glowOpacity = 1.0 - 0.15 * easeT;
    } else if (p <= 0.75) {
      // Media Inventory & Calculator: Angled dynamic depth perspective
      const t = (p - 0.50) / 0.25;
      const easeT = t * t * (3 - 2 * t);
      x = 75 + (-120 * easeT); // 75 -> -45
      y = -65 + (95 * easeT); // -65 -> +30
      scale = 1.22 + (0.08 * easeT); // 1.22 -> 1.30
      rotX = -4.0 + (7.5 * easeT);
      rotY = 5.0 + (-8.0 * easeT);
      rotZ = -2.0 + (4.0 * easeT);
      glowOpacity = 0.85 + 0.3 * easeT;
    } else {
      // Contact / Finale: Majestic central framing
      const t = (p - 0.75) / 0.25;
      const easeT = t * t * (3 - 2 * t);
      x = -45 + (45 * easeT);
      y = 30 + (-30 * easeT);
      scale = 1.30 + (-0.18 * easeT);
      rotX = 3.5 + (-3.5 * easeT);
      rotY = -3.0 + (3.0 * easeT);
      rotZ = 2.0 + (-2.0 * easeT);
      glowOpacity = 1.15 - 0.3 * easeT;
    }

    return { x, y, scale, rotX, rotY, rotZ, glowOpacity };
  }

  let curX = 0, curY = 0, curScale = 1.05, curRotX = 0, curRotY = 0, curRotZ = 0;

  function renderKineticMotion() {
    requestAnimationFrame(renderKineticMotion);
    const time = performance.now() * 0.001;

    // Smooth Lerp for Scroll Progress
    currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.08;

    // Smooth Lerp for Mouse
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Kinematic waypoint calculation
    const kf = getBgKeyframe(currentScrollProgress);

    // Dynamic harmonic breathing & floating physics for ball and racket
    const harmonicX = Math.cos(time * 1.5) * 12;
    const harmonicY = Math.sin(time * 1.8) * 14;

    const mouseX = mouse.x * 30;
    const mouseY = mouse.y * 22;
    const mouseRotX = mouse.y * -3.2;
    const mouseRotY = mouse.x * 3.2;

    curX += (kf.x + harmonicX + mouseX - curX) * 0.09;
    curY += (kf.y + harmonicY + mouseY - curY) * 0.09;
    curScale += (kf.scale - curScale) * 0.09;
    curRotX += (kf.rotX + mouseRotX - curRotX) * 0.09;
    curRotY += (kf.rotY + mouseRotY - curRotY) * 0.09;
    curRotZ += (kf.rotZ - curRotZ) * 0.09;

    if (bgImg) {
      bgImg.style.transform = `perspective(1000px) translate3d(${curX}px, ${curY}px, 0) rotateX(${curRotX}deg) rotateY(${curRotY}deg) rotateZ(${curRotZ}deg) scale(${curScale})`;
    }

    if (bgGlow) {
      bgGlow.style.opacity = kf.glowOpacity + Math.sin(time * 3) * 0.1;
      bgGlow.style.transform = `translate3d(${curX * 0.6}px, ${curY * 0.6}px, 0) scale(${curScale * 1.02})`;
    }
  }
  renderKineticMotion();

    // Smart Finder Handler & Dropdown Trigger Fix
  const zoneSelect = document.getElementById("finder-zone");
  const mediaSelect = document.getElementById("finder-media");

  [zoneSelect, mediaSelect].forEach(select => {
    if (select) {
      select.addEventListener("mousedown", (e) => {
        e.stopPropagation();
      });
    }
  });

  // 3. Smart Finder Handler
  const finderBtn = document.getElementById("finder-submit-btn");
  if (finderBtn) {
    finderBtn.addEventListener("click", () => {
      const zone = document.getElementById("finder-zone").value;
      const media = document.getElementById("finder-media").value;
      
      if (zone !== "all") {
        const mapSection = document.getElementById("venues-map");
        if (mapSection) mapSection.scrollIntoView({ behavior: "smooth" });
        selectMapZone(zone);
      } else if (media !== "all") {
        const invSection = document.getElementById("inventory");
        if (invSection) invSection.scrollIntoView({ behavior: "smooth" });
        const tab = document.querySelector(`.inventory-tab[data-media="${media}"]`);
        if (tab) tab.click();
      } else {
        const mapSection = document.getElementById("venues-map");
        if (mapSection) mapSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // 4. Official 5 Complexes Map Data & Interactive Click
  const mapData = {
    t10: {
      badge: "موقعیت طلایی • شمال تهران",
      title: "مجموعه T10 (آجودانیه)",
      loc: "تهران، آجودانیه، مجموعه اختصاصی T10",
      desc: "مجهز به ۷ زمین پدل حرفه‌ای و ۳ زمین تنیس استاندارد. کانون اصلی ورزش‌های راکتی شمال پایتخت با حضور نخبگان ورزشی و بالاترین میانگین قدرت خرید مخاطبان.",
      courts: "۷ پدل + ۳ تنیس",
      impressions: "+۹۵,۰۰۰",
      media: "نوار تور + شیشه + استیج"
    },
    arena: {
      badge: "استادیوم ملی و مسابقات • غرب تهران",
      title: "مجموعه Arena (استادیوم آزادی)",
      loc: "تهران، بزرگراه شیخ فضل‌الله، مجموعه ورزشی آزادی",
      desc: "بزرگترین کانون پدل غرب پایتخت با ۸ زمین استاندارد مسابقاتی. قطب برگزاری تورنمنت‌های ملی و رسمی با پوشش تصویری و رسانه‌ای گسترده.",
      courts: "۸ زمین پدل",
      impressions: "+۱۱۰,۰۰۰",
      media: "تور مسابقه + نمایشگر LED + سمپلینگ"
    },
    iranzamin: {
      badge: "موقعیت مدرن و پرمخاطب • شمال‌غرب",
      title: "مجموعه Iran Zamin (شهرک غرب)",
      loc: "تهران، شهرک غرب، خیابان ایران‌زمین",
      desc: "محیطی فوق‌العاده مدرن با ۶ کورت پدل تمام شیشه‌ای، میزبانی از مسابقات هفتگی و گردهمایی علاقه‌مندان به ورزش‌های راکتی در قلب شهرک غرب.",
      courts: "۶ زمین پدل",
      impressions: "+۷۵,۰۰۰",
      media: "دیواره شیشه‌ای + چمن کورت + لانژ"
    },
    netra: {
      badge: "مخاطبان فوق لوکس • لواسانات",
      title: "مجموعه Netra (لواسان)",
      loc: "تهران، منطقه ویلایی و خوش‌آب‌وهوای لواسان",
      desc: "مجتمع اختصاصی با ۷ کورت پدل پانورامیک در فضایی ییلاقی و دلنشین. ایده‌آل برای کمپین‌های برندهای لوکس، خودرویی و سبک زندگی پریمیوم.",
      courts: "۷ زمین پدل",
      impressions: "+۵۰,۰۰۰",
      media: "کورت تمام شیشه‌ای + سمپلینگ VIP"
    },
    asayesh: {
      badge: "قطب ورزش‌های راکتی شمال • مازندران",
      title: "مجموعه Asayesh (ساری)",
      loc: "مازندران، ساری، مجموعه ورزشی آسایش",
      desc: "نخستین و مجهزترین کانون ورزش‌های راکتی استان مازندران با ۴ کورت پدل و ۱۲ زمین تنیس مسابقاتی. پوشش مخاطبان ورزش‌دوست و توریست‌های فصلی استان با ضریب دید بالا.",
      courts: "۴ پدل + ۱۲ تنیس",
      impressions: "+۴۰,۰۰۰",
      media: "برندینگ تور + دیواره شیشه‌ای"
    }
  };

  const mapSpots = document.querySelectorAll(".map-hotspot");
  const mapFilterBtns = document.querySelectorAll(".map-filter-btn");

  function selectMapZone(zoneKey) {
    mapSpots.forEach(s => s.classList.remove("active"));
    mapFilterBtns.forEach(b => b.classList.remove("active"));

    const activeSpot = document.querySelector(`.map-hotspot[data-zone="${zoneKey}"]`);
    if (activeSpot) activeSpot.classList.add("active");

    const activeBtn = document.querySelector(`.map-filter-btn[data-pin="${zoneKey}"]`);
    if (activeBtn) activeBtn.classList.add("active");

    const data = mapData[zoneKey];
    if (data) {
      const badgeEl = document.getElementById("map-spot-badge");
      const titleEl = document.getElementById("map-spot-title");
      const locEl = document.getElementById("map-spot-loc");
      const descEl = document.getElementById("map-spot-desc");
      const courtsEl = document.getElementById("map-spot-courts");
      const impressionsEl = document.getElementById("map-spot-impressions");
      const mediaEl = document.getElementById("map-spot-media");

      if (badgeEl) badgeEl.textContent = data.badge;
      if (titleEl) titleEl.textContent = data.title;
      if (locEl) locEl.textContent = data.loc;
      if (descEl) descEl.textContent = data.desc;
      if (courtsEl) courtsEl.textContent = data.courts;
      if (impressionsEl) impressionsEl.textContent = data.impressions;
      if (mediaEl) mediaEl.textContent = data.media;
    }
  }

  mapSpots.forEach(spot => {
    spot.addEventListener("click", () => {
      const zone = spot.dataset.zone;
      selectMapZone(zone);
    });
  });

  mapFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const pin = btn.dataset.pin;
      if (pin === "all") {
        mapFilterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectMapZone("t10");
      } else {
        selectMapZone(pin);
      }
    });
  });

  // 5. Interactive Media Inventory Tabs
  const invTabs = document.querySelectorAll(".inventory-tab");
  invTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      invTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });

  // 6. Campaign Planner Calculator
  let plannerState = {
    factor: 1.0,
    venues: 3,
    venuesText: "۳ باشگاه شاخص (T10 آجودانیه، Arena آزادی، Iran Zamin شهرک غرب)",
    courtsCount: "۲۱ کورت پدل و تنیس",
    months: 3,
    monthsText: "۳ ماهه (فصل فعال مسابقات)"
  };

  function updatePlannerCalc() {
    const baseMonthlyPerVenue = 40000;
    const total = Math.round(plannerState.venues * baseMonthlyPerVenue * plannerState.months * plannerState.factor);
    const formatted = "+" + (total / 1000).toLocaleString("fa-IR") + ",۰۰۰";
    
    const impEl = document.getElementById("calc-impression");
    const vTextEl = document.getElementById("calc-venues-text");
    const cCountEl = document.getElementById("calc-courts-count");
    const dTextEl = document.getElementById("calc-duration-text");

    if (impEl) impEl.textContent = formatted;
    if (vTextEl) vTextEl.textContent = plannerState.venuesText;
    if (cCountEl) cCountEl.textContent = plannerState.courtsCount;
    if (dTextEl) dTextEl.textContent = plannerState.monthsText;
  }

  const goalPills = document.querySelectorAll("#planner-goal-pills .planner-pill");
  goalPills.forEach(pill => {
    pill.addEventListener("click", () => {
      goalPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      plannerState.factor = parseFloat(pill.dataset.factor);
      updatePlannerCalc();
    });
  });

  const venuesPills = document.querySelectorAll("#planner-venues-pills .planner-pill");
  venuesPills.forEach(pill => {
    pill.addEventListener("click", () => {
      venuesPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      plannerState.venues = parseInt(pill.dataset.venues);
      plannerState.venuesText = pill.dataset.vname;
      plannerState.courtsCount = plannerState.venues === 1 ? "۷ کورت پدل" : (plannerState.venues === 3 ? "۲۱ کورت پدل و تنیس" : "۳۲ کورت در ۵ مجتمع سراسری");
      updatePlannerCalc();
    });
  });

  const durPills = document.querySelectorAll("#planner-dur-pills .planner-pill");
  durPills.forEach(pill => {
    pill.addEventListener("click", () => {
      durPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      plannerState.months = parseInt(pill.dataset.months);
      plannerState.monthsText = plannerState.months === 1 ? "۱ ماهه (کمپین متمرکز)" : (plannerState.months === 3 ? "۳ ماهه (فصل مسابقات)" : "۱۲ ماهه (پوشش سالانه)");
      updatePlannerCalc();
    });
  });

  // 7. Lead Capture Modal Drawer
  const kitModal = document.getElementById("kit-modal");
  const openKitBtns = document.querySelectorAll("#open-kit-btn, .open-kit-trigger");
  const closeKitBtn = document.getElementById("close-kit-modal");

  openKitBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      if (btn.tagName === "A" || btn.closest("a")) return;
      e.preventDefault();
      if (kitModal) kitModal.classList.add("active");
    });
  });

  if (closeKitBtn) {
    closeKitBtn.addEventListener("click", () => {
      if (kitModal) kitModal.classList.remove("active");
    });
  }

  if (kitModal) {
    kitModal.addEventListener("click", (e) => {
      if (e.target === kitModal) {
        kitModal.classList.remove("active");
      }
    });
  }

    // 8. Mobile Menu Toggle & Sticky Scroll Header
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeMobileMenu = document.getElementById("close-mobile-menu");
  const mobileBackdrop = document.getElementById("mobile-backdrop");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const mainNav = document.getElementById("main-nav");

  // Sticky Scroll Handler
  if (mainNav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        mainNav.classList.add("scrolled");
      } else {
        mainNav.classList.remove("scrolled");
      }
    });
  }

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => {
      mobileMenu.classList.add("active");
    });
  }

  const closeActions = [closeMobileMenu, mobileBackdrop];
  closeActions.forEach(btn => {
    if (btn && mobileMenu) {
      btn.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
      });
    }
  });

  /* auto close handled globally */
})();

/**
 * ==========================================================================
 * SILVERIOM — CINEMATIC SCROLL-DRIVEN 3D BACKGROUND MOTION ENGINE
 * Pure Background Ball & Racket Kinematics (Zero Foreground Clutter)
 * ==========================================================================
 */
(function() {
  // 1. Ambient WebGL Particle Lighting Canvas (No foreground meshes)
  const canvas = document.getElementById("webgl-canvas");
  if (canvas && typeof THREE !== "undefined") {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particleCount = 160;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 24;
      particlePos[i+1] = (Math.random() - 0.5) * 18;
      particlePos[i+2] = (Math.random() - 0.5) * 12;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00F0FF,
      size: 0.04,
      transparent: true,
      opacity: 0.35
    });
    const dustParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(dustParticles);

    const cursorGlow = new THREE.PointLight(0x00F0FF, 1.8, 10);
    cursorGlow.position.set(0, 0, 4);
    scene.add(cursorGlow);

    const particleMouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    window.addEventListener("mousemove", (e) => {
      particleMouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      particleMouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    const clock = new THREE.Clock();
    function animateParticles() {
      requestAnimationFrame(animateParticles);
      const time = clock.getElapsedTime();
      particleMouse.x += (particleMouse.targetX - particleMouse.x) * 0.05;
      particleMouse.y += (particleMouse.targetY - particleMouse.y) * 0.05;

      dustParticles.rotation.y = time * 0.02;
      dustParticles.rotation.x = time * 0.01;
      cursorGlow.position.x = particleMouse.x * 6;
      cursorGlow.position.y = particleMouse.y * 4.5;

      renderer.render(scene, camera);
    }
    animateParticles();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // 2. High-Performance Scroll-Driven & Mouse 3D Kinetic Motion for Background Racket & Ball
  const bgImg = document.getElementById("cinematic-bg-img");
  const bgGlow = document.querySelector(".bg-energy-glow");

  let currentScrollProgress = 0;
  let targetScrollProgress = 0;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  window.addEventListener("scroll", () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    targetScrollProgress = totalScroll > 0 ? window.scrollY / totalScroll : 0;
  }, { passive: true });

  window.addEventListener("mousemove", (e) => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // Kinematic Keyframes: Giving dramatic 3D transformation to the ball and racket in the photo
  function getBgKeyframe(p) {
    let x = 0, y = 0, scale = 1.05, rotX = 0, rotY = 0, rotZ = 0, glowOpacity = 0.85;

    if (p <= 0.25) {
      // Venues Map: Shifts left and tilts upward to focus on racket core and let map shine
      const t = p / 0.25;
      const easeT = t * t * (3 - 2 * t);
      x = 0 + (-65 * easeT);
      y = 0 + (-35 * easeT);
      scale = 1.05 + (0.08 * easeT);
      rotX = 0 + (4.5 * easeT);
      rotY = 0 + (-5.5 * easeT);
      rotZ = 0 + (2.0 * easeT);
      glowOpacity = 0.85 + 0.25 * Math.sin(t * Math.PI);
    } else if (p <= 0.50) {
      // Complexes: Shifts over to the right and zooms in to highlight the glowing ball
      const t = (p - 0.25) / 0.25;
      const easeT = t * t * (3 - 2 * t);
      x = -65 + (140 * easeT); // -65 -> +75
      y = -35 + (-30 * easeT); // -35 -> -65
      scale = 1.13 + (0.09 * easeT); // 1.13 -> 1.22
      rotX = 4.5 + (-8.5 * easeT);
      rotY = -5.5 + (10.5 * easeT);
      rotZ = 2.0 + (-4.0 * easeT);
      glowOpacity = 1.0 - 0.15 * easeT;
    } else if (p <= 0.75) {
      // Media Inventory & Calculator: Angled dynamic depth perspective
      const t = (p - 0.50) / 0.25;
      const easeT = t * t * (3 - 2 * t);
      x = 75 + (-120 * easeT); // 75 -> -45
      y = -65 + (95 * easeT); // -65 -> +30
      scale = 1.22 + (0.08 * easeT); // 1.22 -> 1.30
      rotX = -4.0 + (7.5 * easeT);
      rotY = 5.0 + (-8.0 * easeT);
      rotZ = -2.0 + (4.0 * easeT);
      glowOpacity = 0.85 + 0.3 * easeT;
    } else {
      // Contact / Finale: Majestic central framing
      const t = (p - 0.75) / 0.25;
      const easeT = t * t * (3 - 2 * t);
      x = -45 + (45 * easeT);
      y = 30 + (-30 * easeT);
      scale = 1.30 + (-0.18 * easeT);
      rotX = 3.5 + (-3.5 * easeT);
      rotY = -3.0 + (3.0 * easeT);
      rotZ = 2.0 + (-2.0 * easeT);
      glowOpacity = 1.15 - 0.3 * easeT;
    }

    return { x, y, scale, rotX, rotY, rotZ, glowOpacity };
  }

  let curX = 0, curY = 0, curScale = 1.05, curRotX = 0, curRotY = 0, curRotZ = 0;

  function renderKineticMotion() {
    requestAnimationFrame(renderKineticMotion);
    const time = performance.now() * 0.001;

    // Smooth Lerp for Scroll Progress
    currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.08;

    // Smooth Lerp for Mouse
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Kinematic waypoint calculation
    const kf = getBgKeyframe(currentScrollProgress);

    // Dynamic harmonic breathing & floating physics for ball and racket
    const harmonicX = Math.cos(time * 1.5) * 12;
    const harmonicY = Math.sin(time * 1.8) * 14;

    const mouseX = mouse.x * 30;
    const mouseY = mouse.y * 22;
    const mouseRotX = mouse.y * -3.2;
    const mouseRotY = mouse.x * 3.2;

    curX += (kf.x + harmonicX + mouseX - curX) * 0.09;
    curY += (kf.y + harmonicY + mouseY - curY) * 0.09;
    curScale += (kf.scale - curScale) * 0.09;
    curRotX += (kf.rotX + mouseRotX - curRotX) * 0.09;
    curRotY += (kf.rotY + mouseRotY - curRotY) * 0.09;
    curRotZ += (kf.rotZ - curRotZ) * 0.09;

    if (bgImg) {
      bgImg.style.transform = `perspective(1000px) translate3d(${curX}px, ${curY}px, 0) rotateX(${curRotX}deg) rotateY(${curRotY}deg) rotateZ(${curRotZ}deg) scale(${curScale})`;
    }

    if (bgGlow) {
      bgGlow.style.opacity = kf.glowOpacity + Math.sin(time * 3) * 0.1;
      bgGlow.style.transform = `translate3d(${curX * 0.6}px, ${curY * 0.6}px, 0) scale(${curScale * 1.02})`;
    }
  }
  renderKineticMotion();

    // Smart Finder Handler & Dropdown Trigger Fix
  const zoneSelect = document.getElementById("finder-zone");
  const mediaSelect = document.getElementById("finder-media");

  [zoneSelect, mediaSelect].forEach(select => {
    if (select) {
      select.addEventListener("mousedown", (e) => {
        e.stopPropagation();
      });
    }
  });

  // 3. Smart Finder Handler
  const finderBtn = document.getElementById("finder-submit-btn");
  if (finderBtn) {
    finderBtn.addEventListener("click", () => {
      const zone = document.getElementById("finder-zone").value;
      const media = document.getElementById("finder-media").value;
      
      if (zone !== "all") {
        const mapSection = document.getElementById("venues-map");
        if (mapSection) mapSection.scrollIntoView({ behavior: "smooth" });
        selectMapZone(zone);
      } else if (media !== "all") {
        const invSection = document.getElementById("inventory");
        if (invSection) invSection.scrollIntoView({ behavior: "smooth" });
        const tab = document.querySelector(`.inventory-tab[data-media="${media}"]`);
        if (tab) tab.click();
      } else {
        const mapSection = document.getElementById("venues-map");
        if (mapSection) mapSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // 4. Official 5 Complexes Map Data & Interactive Click
  const mapData = {
    t10: {
      badge: "موقعیت طلایی • شمال تهران",
      title: "مجموعه T10 (آجودانیه)",
      loc: "تهران، آجودانیه، مجموعه اختصاصی T10",
      desc: "مجهز به ۷ زمین پدل حرفه‌ای و ۳ زمین تنیس استاندارد. کانون اصلی ورزش‌های راکتی شمال پایتخت با حضور نخبگان ورزشی و بالاترین میانگین قدرت خرید مخاطبان.",
      courts: "۷ پدل + ۳ تنیس",
      impressions: "+۹۵,۰۰۰",
      media: "نوار تور + شیشه + استیج"
    },
    arena: {
      badge: "استادیوم ملی و مسابقات • غرب تهران",
      title: "مجموعه Arena (استادیوم آزادی)",
      loc: "تهران، بزرگراه شیخ فضل‌الله، مجموعه ورزشی آزادی",
      desc: "بزرگترین کانون پدل غرب پایتخت با ۸ زمین استاندارد مسابقاتی. قطب برگزاری تورنمنت‌های ملی و رسمی با پوشش تصویری و رسانه‌ای گسترده.",
      courts: "۸ زمین پدل",
      impressions: "+۱۱۰,۰۰۰",
      media: "تور مسابقه + نمایشگر LED + سمپلینگ"
    },
    iranzamin: {
      badge: "موقعیت مدرن و پرمخاطب • شمال‌غرب",
      title: "مجموعه Iran Zamin (شهرک غرب)",
      loc: "تهران، شهرک غرب، خیابان ایران‌زمین",
      desc: "محیطی فوق‌العاده مدرن با ۶ کورت پدل تمام شیشه‌ای، میزبانی از مسابقات هفتگی و گردهمایی علاقه‌مندان به ورزش‌های راکتی در قلب شهرک غرب.",
      courts: "۶ زمین پدل",
      impressions: "+۷۵,۰۰۰",
      media: "دیواره شیشه‌ای + چمن کورت + لانژ"
    },
    netra: {
      badge: "مخاطبان فوق لوکس • لواسانات",
      title: "مجموعه Netra (لواسان)",
      loc: "تهران، منطقه ویلایی و خوش‌آب‌وهوای لواسان",
      desc: "مجتمع اختصاصی با ۷ کورت پدل پانورامیک در فضایی ییلاقی و دلنشین. ایده‌آل برای کمپین‌های برندهای لوکس، خودرویی و سبک زندگی پریمیوم.",
      courts: "۷ زمین پدل",
      impressions: "+۵۰,۰۰۰",
      media: "کورت تمام شیشه‌ای + سمپلینگ VIP"
    },
    asayesh: {
      badge: "قطب ورزش‌های راکتی شمال • مازندران",
      title: "مجموعه Asayesh (ساری)",
      loc: "مازندران، ساری، مجموعه ورزشی آسایش",
      desc: "نخستین و مجهزترین کانون ورزش‌های راکتی استان مازندران با ۴ کورت پدل و ۱۲ زمین تنیس مسابقاتی. پوشش مخاطبان ورزش‌دوست و توریست‌های فصلی استان با ضریب دید بالا.",
      courts: "۴ پدل + ۱۲ تنیس",
      impressions: "+۴۰,۰۰۰",
      media: "برندینگ تور + دیواره شیشه‌ای"
    }
  };

  const mapSpots = document.querySelectorAll(".map-hotspot");
  const mapFilterBtns = document.querySelectorAll(".map-filter-btn");

  function selectMapZone(zoneKey) {
    mapSpots.forEach(s => s.classList.remove("active"));
    mapFilterBtns.forEach(b => b.classList.remove("active"));

    const activeSpot = document.querySelector(`.map-hotspot[data-zone="${zoneKey}"]`);
    if (activeSpot) activeSpot.classList.add("active");

    const activeBtn = document.querySelector(`.map-filter-btn[data-pin="${zoneKey}"]`);
    if (activeBtn) activeBtn.classList.add("active");

    const data = mapData[zoneKey];
    if (data) {
      const badgeEl = document.getElementById("map-spot-badge");
      const titleEl = document.getElementById("map-spot-title");
      const locEl = document.getElementById("map-spot-loc");
      const descEl = document.getElementById("map-spot-desc");
      const courtsEl = document.getElementById("map-spot-courts");
      const impressionsEl = document.getElementById("map-spot-impressions");
      const mediaEl = document.getElementById("map-spot-media");

      if (badgeEl) badgeEl.textContent = data.badge;
      if (titleEl) titleEl.textContent = data.title;
      if (locEl) locEl.textContent = data.loc;
      if (descEl) descEl.textContent = data.desc;
      if (courtsEl) courtsEl.textContent = data.courts;
      if (impressionsEl) impressionsEl.textContent = data.impressions;
      if (mediaEl) mediaEl.textContent = data.media;
    }
  }

  mapSpots.forEach(spot => {
    spot.addEventListener("click", () => {
      const zone = spot.dataset.zone;
      selectMapZone(zone);
    });
  });

  mapFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const pin = btn.dataset.pin;
      if (pin === "all") {
        mapFilterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectMapZone("t10");
      } else {
        selectMapZone(pin);
      }
    });
  });

  // 5. Interactive Media Inventory Tabs & Blueprint Dynamic Highlights
  const inventoryData = {
    net: {
      tag: "موقعیت: نوار مرکزی و پایه‌های تور کورت",
      title: "برندینگ نوار و پایه‌های تور",
      desc: "این موقعیت دقیقاً در نقطه ثقل دید مخاطبان، داور و زاویه اصلی پخش مسابقات قرار دارد. بیش از ۹۴٪ زمان مسابقه، نگاه تماشاگران به طور مستقیم از روی تور عبور می‌کند.",
      m1: "۹۴٪", m1_lbl: "نرخ مکث نگاه",
      m2: "+۱۸۰K", m2_lbl: "ایمپرشن ماهانه",
      m3: "دوطرفه", m3_lbl: "قالب اجرا",
      bp_class: "active-net",
      bp_ids: ["bp-net"]
    },
    glass: {
      tag: "موقعیت: دیواره‌های شیشه‌ای پیرامون کورت",
      title: "دیواره‌های پانورامیک شیشه‌ای",
      desc: "پوشش سراسری شیشه‌های پشت و بغل کورت با وینیل‌های شفاف یک‌طرفه با وضوح فوق‌العاده بالا. دید مستقیم برای تماشاگران حاضر در باشگاه و لنز دوربین‌های فیلم‌برداری.",
      m1: "۸۸٪", m1_lbl: "وضوح دید شیشه",
      m2: "+۲۲۰K", m2_lbl: "ایمپرشن ماهانه",
      m3: "تک‌جهته", m3_lbl: "قالب اجرا",
      bp_class: "active-glass",
      bp_ids: ["bp-glass-left", "bp-glass-right"]
    },
    turf: {
      tag: "موقعیت: چمن کورت پدل",
      title: "درج لوگو در چمن کورت",
      desc: "درج لوگوی برند با استفاده از چمن مصنوعی رنگی یا برش‌های باکیفیت بالا در زیر تور و باکس‌های سرویس. بیشترین نرخ نمایش در زاویه دید مستقیم دوربین مرکزی.",
      m1: "۸۵٪", m1_lbl: "ثبت در ذهن",
      m2: "+۱۴۰K", m2_lbl: "ایمپرشن ماهانه",
      m3: "چاپ لیزری", m3_lbl: "قالب اجرا",
      bp_class: "active-turf",
      bp_ids: ["bp-turf-center-1", "bp-turf-center-2"]
    },
    digital: {
      tag: "موقعیت: مانیتورها و LEDهای محیطی",
      title: "نمایشگرهای دیجیتال و LED",
      desc: "نمایش تیزرهای ویدیویی و موشن گرافیک‌های پویا بر روی نمایشگرهای هوشمند حاشیه کورت‌ها، همگام‌سازی شده با لحظات حساس بازی و تغییرات زنده امتیازات.",
      m1: "۹۲٪", m1_lbl: "نرخ جذب مخاطب",
      m2: "+۳۰۰K", m2_lbl: "ایمپرشن ماهانه",
      m3: "موشن/ویدیو", m3_lbl: "فرمت محتوا",
      bp_class: "active-digital",
      bp_ids: ["bp-digital-1", "bp-digital-2", "bp-digital-3"]
    },
    sampling: {
      tag: "موقعیت: ورودی کورت‌ها و لانژ VIP",
      title: "سمپلینگ و پذیرایی اختصاصی",
      desc: "ایجاد کانترهای نمونه‌سازی، دمو و سمپلینگ محصولات در لابی‌های مجلل و لانژ‌های تفریحی پرتردد کلوپ‌ها جهت ارتباط رودررو و صمیمی با مخاطبان کارآفرین و مدیر ارشد.",
      m1: "۹۵٪", m1_lbl: "نرخ تعامل",
      m2: "+۴۵K", m2_lbl: "مخاطب حضوری",
      m3: "تجربه‌ای", m3_lbl: "نوع تعامل",
      bp_class: "active-sampling",
      bp_ids: ["bp-sampling"]
    }
  };

  const invTabs = document.querySelectorAll(".inventory-tab");
  
  function updateInventoryDetails(mediaKey) {
    const data = inventoryData[mediaKey];
    if (!data) return;

    // 1. Text transition fade out/in using GSAP
    gsap.to(".media-text-content, .detail-metrics-grid", {
      opacity: 0,
      y: -10,
      duration: 0.25,
      onComplete: () => {
        document.getElementById("media-tag").textContent = data.tag;
        document.getElementById("media-title").textContent = data.title;
        document.getElementById("media-desc").textContent = data.desc;
        document.getElementById("media-m1").textContent = data.m1;
        document.getElementById("media-m1-lbl").textContent = data.m1_lbl;
        document.getElementById("media-m2").textContent = data.m2;
        document.getElementById("media-m2-lbl").textContent = data.m2_lbl;
        document.getElementById("media-m3").textContent = data.m3;
        document.getElementById("media-m3-lbl").textContent = data.m3_lbl;

        gsap.to(".media-text-content, .detail-metrics-grid", {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out"
        });
      }
    });

    // 2. Blueprint interactive SVG updates
    // Reset all blueprint elements
    document.querySelectorAll(".bp-element").forEach(el => {
      el.classList.remove("active-net", "active-glass", "active-turf", "active-digital", "active-sampling");
    });

    // Add active classes
    if (data.bp_ids && data.bp_class) {
      data.bp_ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add(data.bp_class);
      });
    }
  }

  invTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      invTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const media = tab.dataset.media;
      updateInventoryDetails(media);
    });
  });

  // 6. Campaign Planner Calculator
  let plannerState = {
    factor: 1.0,
    venues: 3,
    venuesText: "۳ باشگاه شاخص (T10 آجودانیه، Arena آزادی، Iran Zamin شهرک غرب)",
    courtsCount: "۲۱ کورت پدل و تنیس",
    months: 3,
    monthsText: "۳ ماهه (فصل فعال مسابقات)"
  };

  function updatePlannerCalc() {
    const baseMonthlyPerVenue = 40000;
    const total = Math.round(plannerState.venues * baseMonthlyPerVenue * plannerState.months * plannerState.factor);
    const formatted = "+" + (total / 1000).toLocaleString("fa-IR") + ",۰۰۰";
    
    const impEl = document.getElementById("calc-impression");
    const vTextEl = document.getElementById("calc-venues-text");
    const cCountEl = document.getElementById("calc-courts-count");
    const dTextEl = document.getElementById("calc-duration-text");

    if (impEl) impEl.textContent = formatted;
    if (vTextEl) vTextEl.textContent = plannerState.venuesText;
    if (cCountEl) cCountEl.textContent = plannerState.courtsCount;
    if (dTextEl) dTextEl.textContent = plannerState.monthsText;
  }

  const goalPills = document.querySelectorAll("#planner-goal-pills .planner-pill");
  goalPills.forEach(pill => {
    pill.addEventListener("click", () => {
      goalPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      plannerState.factor = parseFloat(pill.dataset.factor);
      updatePlannerCalc();
    });
  });

  const venuesPills = document.querySelectorAll("#planner-venues-pills .planner-pill");
  venuesPills.forEach(pill => {
    pill.addEventListener("click", () => {
      venuesPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      plannerState.venues = parseInt(pill.dataset.venues);
      plannerState.venuesText = pill.dataset.vname;
      plannerState.courtsCount = plannerState.venues === 1 ? "۷ کورت پدل" : (plannerState.venues === 3 ? "۲۱ کورت پدل و تنیس" : "۳۲ کورت در ۵ مجتمع سراسری");
      updatePlannerCalc();
    });
  });

  const durPills = document.querySelectorAll("#planner-dur-pills .planner-pill");
  durPills.forEach(pill => {
    pill.addEventListener("click", () => {
      durPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      plannerState.months = parseInt(pill.dataset.months);
      plannerState.monthsText = plannerState.months === 1 ? "۱ ماهه (کمپین متمرکز)" : (plannerState.months === 3 ? "۳ ماهه (فصل مسابقات)" : "۱۲ ماهه (پوشش سالانه)");
      updatePlannerCalc();
    });
  });

  // 7. Lead Capture Modal Drawer
  const kitModal = document.getElementById("kit-modal");
  const openKitBtns = document.querySelectorAll("#open-kit-btn, .open-kit-trigger");
  const closeKitBtn = document.getElementById("close-kit-modal");

  openKitBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      if (btn.tagName === "A" || btn.closest("a")) return;
      e.preventDefault();
      if (kitModal) kitModal.classList.add("active");
    });
  });

  if (closeKitBtn) {
    closeKitBtn.addEventListener("click", () => {
      if (kitModal) kitModal.classList.remove("active");
    });
  }

  if (kitModal) {
    kitModal.addEventListener("click", (e) => {
      if (e.target === kitModal) {
        kitModal.classList.remove("active");
      }
    });
  }

  // 8. Mobile Menu Toggle & Sticky Scroll Header
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeMobileMenu = document.getElementById("close-mobile-menu");
  const mobileBackdrop = document.getElementById("mobile-backdrop");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const mainNav = document.getElementById("main-nav");

  // Sticky Scroll Handler
  if (mainNav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        mainNav.classList.add("scrolled");
      } else {
        mainNav.classList.remove("scrolled");
      }
    });
  }

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => {
      mobileMenu.classList.add("active");
    });
  }

  const closeActions = [closeMobileMenu, mobileBackdrop];
  closeActions.forEach(btn => {
    if (btn && mobileMenu) {
      btn.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
      });
    }
  });

  /* auto close handled globally */
})();

document.addEventListener("DOMContentLoaded", function() {
    // 1. Mobile Menu Toggles
    const toggleBtn = document.getElementById("media-mobile-toggle");
    const submenu = document.getElementById("media-submenu");
    
    if (toggleBtn && submenu) {
        toggleBtn.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const chevron = this.querySelector('.nav-card-chevron');
            if (submenu.style.display === 'none' || submenu.style.display === '') {
                submenu.style.display = 'flex';
                if(chevron) chevron.style.transform = 'rotate(-90deg)';
            } else {
                submenu.style.display = 'none';
                if(chevron) chevron.style.transform = 'rotate(0deg)';
            }
        });
    }

    // 2. Fix the auto-close behavior globally
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu) {
        // Find all links inside the mobile menu
        const allLinks = mobileMenu.querySelectorAll("a");
        allLinks.forEach(link => {
            // Only close menu if it's a real link, NOT a toggle or submenu wrapper
            link.addEventListener("click", function(e) {
                // If it's the toggle itself, don't close
                if (this.id === 'media-mobile-toggle') return;
                
                // Allow normal navigation but close the menu
                mobileMenu.classList.remove("active");
            });
        });
    }
});

(function() {
      let currentPercent = 0;
      let isSiteFullyLoaded = false;
      
      const loaderWrapper = document.getElementById('silverium-loader');
      const fillEl = document.getElementById('loader-progress-fill');
      const pctEl = document.getElementById('loader-percentage');
      const textEl = document.getElementById('loader-text');

      function advanceProgress() {
        if (isSiteFullyLoaded || currentPercent >= 95) return;

        let increment = 0;
        if (currentPercent < 40) {
          increment = Math.random() * 8 + 4;
        } else if (currentPercent < 75) {
          increment = Math.random() * 4 + 2;
        } else {
          increment = Math.random() * 1.5 + 0.5; 
        }

        currentPercent += increment;
        if (currentPercent > 95) currentPercent = 95;

        fillEl.style.width = Math.floor(currentPercent) + '%';
        pctEl.textContent = Math.floor(currentPercent) + '%';
        
        setTimeout(advanceProgress, Math.random() * 250 + 100);
      }

      advanceProgress();

      window.addEventListener('load', function() {
        isSiteFullyLoaded = true;

        let finishInterval = setInterval(() => {
          currentPercent += 2;
          
          if (currentPercent >= 100) {
            currentPercent = 100;
            clearInterval(finishInterval);
            fillEl.style.width = '100%';
            pctEl.textContent = '100%';
            
            textEl.textContent = "خوش آمدید!";
            textEl.style.animation = "none";
            textEl.style.opacity = "1";
            textEl.style.color = "#dfff11";
            
            setTimeout(() => {
              loaderWrapper.style.opacity = '0'; 
              setTimeout(() => {
                loaderWrapper.style.display = 'none'; 
              }, 600); 
            }, 800);
          } else {
            fillEl.style.width = Math.floor(currentPercent) + '%';
            pctEl.textContent = Math.floor(currentPercent) + '%';
          }
        }, 15);
      });
    })();

window.renderMediaCard = function(media) {
    // Defaults
    const title = media.title || media.name || 'بدون عنوان';
    const code = media.code || 'SIL-000';
    const location = media.location || 'تهران';
    const image = media.image || 'assets/placeholder_media.jpg';
    const tariff = media.tariff || 'تماس بگیرید';
    
    const dims = media.dimensions || media.specs || 'نامشخص';
    const views = media.views || 'نامشخص';
    const printType = media.print_type || 'وینیل/مش';
    const audience = media.audience || 'عمومی';
    
    const isReserved = media.status === 'reserved';
    const statusText = isReserved ? 'رزرو شده' : 'موجود جهت اکران';
    const statusClass = isReserved ? 'reserved' : '';
    
    // Lucide Calendar Plus Icon
    const calendarIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><path d="M3 10h18"/><path d="M16 19h6"/><path d="M19 16v6"/></svg>`;

    return `
    <article class="media-showcase-card" data-id="${media.id || code}">
        <div class="msc-img-wrapper">
            <img src="${image}" alt="${title}" loading="lazy">
            <span class="msc-code-badge">کد: ${code}</span>
            <span class="msc-status-badge ${statusClass}">${statusText}</span>
        </div>
        
        <div class="msc-location">📍 ${location}</div>
        <h3 class="msc-title">${title}</h3>
        
        <div class="msc-tariff-box">
            <span class="msc-tariff-label">تعرفه ماهانه:</span>
            <span class="msc-tariff-value">${tariff}</span>
        </div>
        
        <div class="msc-specs-grid">
            <div>📐 ابعاد: <strong>${dims}</strong></div>
            <div>👁️ بازدید: <strong>${views}</strong></div>
            <div>⚡ چاپ: <strong>${printType}</strong></div>
            <div>👥 مخاطب: <strong>${audience}</strong></div>
        </div>
        
        <button class="msc-reserve-btn" onclick="openMainReservationModal('${code}', '${title}')">
            ${calendarIcon}
            <span>رزرو رسانه</span>
        </button>
    </article>
    `;
};

window.renderMediaShowcase = function(containerId, filterPageId) {
    // 1. Fetch JSON
    fetch('/data/silveriom_db.json')
        .then(res => res.json())
        .then(db => {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            let inventory = db.mediaInventory || [];
            
            // 2. Filter if specific page
            if (filterPageId && filterPageId !== 'all') {
                inventory = inventory.filter(item => 
                    item.display_pages && item.display_pages.includes(filterPageId)
                );
            }
            
            // 3. Render HTML
            if (inventory.length === 0) {
                container.innerHTML = '<div style="color:#8E8E93; text-align:center; padding: 2rem;">هیچ رسانه‌ای برای این بخش یافت نشد.</div>';
                return;
            }
            
            let html = '';
            inventory.forEach(media => {
                html += window.renderMediaCard(media);
            });
            
            container.innerHTML = html;
        })
        .catch(err => console.error('Failed to load media DB:', err));
};

