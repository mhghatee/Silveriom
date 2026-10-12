window.dbFetchPromise = fetch('/data/silveriom_db.json').then(r => r.json()).catch(()=>({mediaInventory:[]}));

/* ==================== EXTRACTED SCRIPT ==================== */


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
      desc: "مجموعه اختصاصی با ۷ کورت پدل پانورامیک در فضایی ییلاقی و دلنشین. ایده‌آل برای کمپین‌های برندهای لوکس، خودرویی و سبک زندگی پریمیوم.",
      courts: "۷ زمین پدل",
      impressions: "+۵۰,۰۰۰",
      media: "کورت تمام شیشه‌ای + سمپلینگ VIP"
    },
    asayesh: {
      badge: "کانون اصلی شمال کشور • مازندران",
      title: "مجموعه Asayesh (ساری)",
      loc: "ساری، کیلومتر ۵ جاده فرح‌آباد، مجموعه تفریحی ورزشی آسایش",
      desc: "نخستین و مجهزترین کانون ورزش‌های راکتی استان مازندران با ۴ کورت پدل و ۱۲ زمین تنیس مسابقاتی. پوشش مخاطبان بومی و توریست‌های فصلی.",
      courts: "۴ پدل + ۱۲ تنیس",
      impressions: "+۶۰,۰۰۰",
      media: "تورنمنت فصلی + دیواره شیشه"
    },
    kish: {
      badge: "مرکز رویدادهای بین‌المللی • جزیره کیش",
      title: "مجموعه تنیس Olympic (کیش)",
      loc: "کیش، شهرک المپیک، بلوار کاریز",
      desc: "تنها مرکز تخصصی برگزاری تورنمنت‌های ملی و بین‌المللی در جزیره کیش. پاتوقی ایده‌آل برای توریست‌ها و علاقه‌مندان به ورزش‌های راکتی با ضریب دید بالا در تمام فصول.",
      courts: "۴ زمین هارد + ۱۰ زمین خاک",
      impressions: "+۱۲۰,۰۰۰",
      media: "بیلبورد + تور مسابقه + دیواره"
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
      title: "برندینگ تور",
      desc: "این موقعیت دقیقاً در نقطه ثقل دید مخاطبان، داور و زاویه اصلی پخش مسابقات قرار دارد. نگاه تماشاگران به طور مداوم از روی تور عبور می‌کند.",
      m1: "۹۴٪", m1_lbl: "نرخ مکث نگاه",
      m2: "+۱۸۰K", m2_lbl: "ایمپرشن ماهانه",
      m3: "دوطرفه", m3_lbl: "قالب اجرا",
      bp_class: "active-net",
      bp_ids: ["bp-net", "bp-net-node1", "bp-net-node2"]
    },
    glass_border: {
      tag: "موقعیت: نوار دور شیشه‌های کورت",
      title: "برندینگ دور کورت‌ها",
      desc: "پوشش سراسری نوار بالا و حاشیه‌های دیواره‌های شیشه‌ای پیرامون کورت با کیفیت و وضوح بالا. دید مستقیم برای تماشاگران حاضر و لنز دوربین‌های فیلم‌برداری.",
      m1: "۸۸٪", m1_lbl: "پوشش محیطی",
      m2: "+۲۲۰K", m2_lbl: "ایمپرشن ماهانه",
      m3: "سراسری", m3_lbl: "قالب اجرا",
      bp_class: "active-glass",
      bp_ids: ["bp-glass-border"]
    },
    entrance: {
      tag: "موقعیت: ورودی‌های جانبی کورت",
      title: "برندینگ حاشیه درب ورودی",
      desc: "حضور پررنگ برند در نقاط استراتژیک ورود و خروج بازیکنان. مکانی طلایی که در زمان‌های استراحت بازیکنان و تعویض زمین بالاترین توجه را به خود جلب می‌کند.",
      m1: "۸۵٪", m1_lbl: "نرخ توجه ویژه",
      m2: "+۱۴۰K", m2_lbl: "ایمپرشن ماهانه",
      m3: "دوگانه", m3_lbl: "قالب اجرا",
      bp_class: "active-digital",
      bp_ids: ["bp-entrance-1", "bp-entrance-2"]
    },
    sampling: {
      tag: "موقعیت: لانژ و فضای استراحت باشگاه",
      title: "جایگاه سمپلینگ",
      desc: "ایجاد کانترهای نمونه‌سازی، دمو و سمپلینگ محصولات در فضاهای تفریحی پرتردد کلوپ‌ها جهت ارتباط رودررو و صمیمی با مخاطبان کارآفرین و مدیر ارشد.",
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
      plannerState.courtsCount = plannerState.venues === 1 ? "۷ کورت پدل" : (plannerState.venues === 3 ? "۲۱ کورت پدل و تنیس" : "۳۲ کورت در ۵ مجموعه سراسری");
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

  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (mobileMenu) mobileMenu.classList.remove("active");
    });
  });
})();


/* ==================== EXTRACTED SCRIPT ==================== */


function openMainReservationModal(code, title) {
  document.getElementById('modalMainTargetTitle').innerText = title;
  document.getElementById('modalMainTargetCode').innerText = "کد سازه: " + code;
  document.getElementById('mainReserveCode').value = code;
  document.getElementById('mainReserveForm').style.display = 'flex';
  document.getElementById('mainReserveSuccess').style.display = 'none';
  document.getElementById('mainReservationModal').style.display = 'flex';
}

function submitMainReservation(e) {
  e.preventDefault();
  // Here we would normally send data to backend. For now just show success.
  document.getElementById('mainReserveForm').style.display = 'none';
  document.getElementById('mainReserveSuccess').style.display = 'block';
}


/* ==================== EXTRACTED SCRIPT ==================== */


    (function() {
      const loaderWrapper = document.getElementById('silverium-loader');
      if (!loaderWrapper) return;

      const isElementor = (typeof window.elementor !== 'undefined') || 
                          (window.parent && typeof window.parent.elementor !== 'undefined') || 
                          document.body.classList.contains('elementor-editor-active') || 
                          document.body.classList.contains('elementor-editor-preview') || 
                          window.location.search.indexOf('elementor') !== -1;
      
      if (isElementor || (window.silveriomLoaderConfig && window.silveriomLoaderConfig.enabled === false)) {
        loaderWrapper.style.display = 'none';
        loaderWrapper.style.opacity = '0';
        loaderWrapper.style.pointerEvents = 'none';
        try { loaderWrapper.remove(); } catch(e) {}
        return;
      }

      let currentPercent = 0;
      let isSiteFullyLoaded = false;
      const fillEl = document.getElementById('loader-progress-fill');
      const pctEl = document.getElementById('loader-percentage');
      const textEl = document.getElementById('loader-text');

      const mainVid = document.getElementById('silverium-main-video');
      const posterImg = document.getElementById('silverium-video-poster');
      
      // Apply dynamic settings if available
      if (window.silveriomLoaderConfig) {
        if (textEl && window.silveriomLoaderConfig.text) {
          textEl.textContent = window.silveriomLoaderConfig.text;
        }
        if (posterImg && window.silveriomLoaderConfig.poster) {
          posterImg.src = window.silveriomLoaderConfig.poster;
        }
        if (mainVid && window.silveriomLoaderConfig.video) {
          const srcEl = mainVid.querySelector('source');
          if (srcEl && srcEl.src !== window.silveriomLoaderConfig.video) {
            srcEl.src = window.silveriomLoaderConfig.video;
            mainVid.load();
          }
        }
        if (fillEl && window.silveriomLoaderConfig.color) {
          fillEl.style.backgroundColor = window.silveriomLoaderConfig.color;
        }
      }

      if (mainVid && posterImg) {
          mainVid.addEventListener('playing', () => {
              posterImg.style.opacity = '0';
              setTimeout(() => posterImg.style.display = 'none', 300);
          });
      }

      function advanceProgress() {
        if (isSiteFullyLoaded) return;
        if (currentPercent >= 95) {
          setTimeout(finishLoading, 300);
          return;
        }

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
        
        setTimeout(advanceProgress, Math.random() * 50 + 20);
      }

      advanceProgress();

      function finishLoading() {
        if (isSiteFullyLoaded) return;
        isSiteFullyLoaded = true;

        let finishInterval = setInterval(() => {
          currentPercent += 20;
          
          if (currentPercent >= 100) {
            currentPercent = 100;
            clearInterval(finishInterval);
            if (fillEl) fillEl.style.width = '100%';
            if (pctEl) pctEl.textContent = '100%';
            
            if (textEl) {
              textEl.textContent = (window.silveriomLoaderConfig && window.silveriomLoaderConfig.welcome) ? window.silveriomLoaderConfig.welcome : "خوش آمدید!";
              textEl.style.animation = "none";
              textEl.style.opacity = "1";
              textEl.style.color = (window.silveriomLoaderConfig && window.silveriomLoaderConfig.color) ? window.silveriomLoaderConfig.color : "#dfff11";
            }
            
            setTimeout(() => {
              if (loaderWrapper) {
                loaderWrapper.style.opacity = '0'; 
                loaderWrapper.style.pointerEvents = 'none';
                setTimeout(() => {
                  loaderWrapper.style.display = 'none'; 
                }, 500); 
              }
            }, 80);
          } else {
            if (fillEl) fillEl.style.width = Math.floor(currentPercent) + '%';
            if (pctEl) pctEl.textContent = Math.floor(currentPercent) + '%';
          }
        }, 15);
      }

      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        finishLoading();
      } else {
        window.addEventListener('load', finishLoading);
        document.addEventListener('DOMContentLoaded', finishLoading);
        // Fallback after 800ms max so user is NEVER blocked
        setTimeout(finishLoading, 800);
      }

    })();
  

/* ==================== EXTRACTED SCRIPT ==================== */


document.addEventListener("DOMContentLoaded", function() {
    const currentUrl = window.location.href.split('?')[0]; 
    const currentPath = window.location.pathname;
    const cleanCurrent = currentPath.replace(/\/index\.html$/, '').replace(/\/$/, '');

    document.querySelectorAll('.nav-links .nav-item, .mobile-nav .mobile-nav-card').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-dropdown-item').forEach(el => el.classList.remove('active'));
    
    let matched = false;

    document.querySelectorAll('.nav-dropdown-item').forEach(el => {
        const href = el.getAttribute('href');
        if (href) {
            let hrefPath = '';
            try { hrefPath = new URL(href).pathname; } catch(e) { hrefPath = href; }
            let cleanHref = hrefPath.replace(/\/index\.html$/, '').replace(/\/$/, '');
            if ((cleanHref.length > 0 && cleanCurrent === cleanHref) || (cleanHref.length > 0 && cleanCurrent.startsWith(cleanHref + '/'))) {
                el.classList.add('active');
                const parentDropdown = el.closest('.nav-dropdown');
                if (parentDropdown) {
                    const parentNav = parentDropdown.querySelector('.nav-item');
                    if (parentNav) {
                        parentNav.classList.add('active');
                        matched = true;
                    }
                }
            }
        }
    });

    document.querySelectorAll('.nav-item, .mobile-nav-card').forEach(el => {
        const href = el.getAttribute('href');
        if (href && href !== '#' && !href.endsWith('silveriom.ir') && !href.endsWith('silveriom.ir/')) {
            let hrefPath = '';
            try { hrefPath = new URL(href, window.location.origin).pathname; } catch(e) { hrefPath = href; }
            let cleanHref = hrefPath.replace(/\/index\.html$/, '').replace(/\/$/, '');
            if ((cleanHref.length > 0 && cleanCurrent === cleanHref) || (cleanHref.length > 0 && cleanCurrent.startsWith(cleanHref + '/'))) {
                el.classList.add('active');
                matched = true;
            }
        }
    });

    if (!matched || currentPath === '/' || currentPath === '/index.html') {
        document.querySelectorAll('.nav-item[href="https://silveriom.ir"], .nav-item[href="https://silveriom.ir/"], .mobile-nav-card[href="https://silveriom.ir"], .mobile-nav-card[href="https://silveriom.ir/"]').forEach(el => el.classList.add('active'));
    }
});


/* ==================== EXTRACTED SCRIPT ==================== */

if(typeof lucide !== "undefined"){lucide.createIcons();}

/* ==================== EXTRACTED SCRIPT ==================== */


(function loadHomepageFeatured() {
    fetch('/data/silveriom_db.json?t=' + Date.now())
        .then(r => r.json())
        .then(db => {
            const grid = document.getElementById('homepage-featured-grid');
            if (!grid) return;
            
            let items = (db.mediaInventory || []).filter(m =>
                m.display_pages && m.display_pages.includes('home')
            );
            
            if (items.length === 0) {
                grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:#94a3b8; padding:3rem; font-family: YekanBakh, sans-serif;">هیچ سازه‌ای برای صفحه اصلی انتخاب نشده است.<br><small>از پنل ادمین، در قسمت ویرایش سازه، گزینه «صفحه اصلی (Home)» را انتخاب کنید.</small></div>';
                return;
            }
            
            const venueMap = {
                't10': 'مجموعه T10 (آجودانیه)',
                'arena': 'مجموعه Arena (آزادی)',
                'iran-zamin': 'مجموعه Iran Zamin (شهرک غرب)',
                'netra': 'مجموعه Netra (لواسان)',
                'asayesh': 'مجموعه آسایش (ساری)',
                'olympic': 'مجموعه Olympic (کیش)'
            };
            
            grid.innerHTML = items.map(m => {
                const title = m.title || m.name || 'بدون عنوان';
                const code = m.code || m.id || 'SIL-000';
                const loc = venueMap[m.venue] || m.location || m.venue || '';
                const tariff = m.tariff ? m.tariff + ' میلیون تومان' : 'تماس بگیرید';
                const dims = m.dimensions || '—';
                const img = m.image
                    ? (m.image.startsWith('http') ? m.image : 'https://silveriom.ir/' + m.image.replace('../','').replace(/^\//,''))
                    : 'https://silveriom.ir/assets/placeholder_media.jpg';
                const status = m.status === 'available' || m.avail === 'available' ? true : false;
                
                return `
                <div class="glass-card product-asset-card featured-override-card">
                    <div class="fcard-img-wrapper" style="position:relative;border-radius:16px;overflow:hidden;margin-bottom:16px;height:220px;">
                        <img src="${img}" alt="${title}" style="width:100%;height:100%;object-fit:cover;" loading="lazy">
                        <span class="structure-code-badge">کد: ${code}</span>
                        ${status ? '<span class="status-available-badge">قابل رزرو / اکران</span>' : '<span class="status-available-badge" style="background:rgba(239,68,68,0.8);">رزرو شده</span>'}
                    </div>
                    ${loc ? `<div style="color:#00d287;font-size:13px;font-weight:800;margin-bottom:8px;text-align:right;"><i data-lucide="map-pin" style="width:1.2em;height:1.2em;vertical-align:text-bottom;display:inline-block;"></i> ${loc}</div>` : ''}
                    <h3 style="font-size:1.5rem;font-weight:900;color:#ffffff;margin-bottom:16px;line-height:1.4;text-align:right;">${title}</h3>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;background:#0E1629;padding:14px 16px;border-radius:14px;border:1px solid rgba(204,255,0,0.3);">
                        <span style="color:#94A3B8;font-size:13px;font-weight:600;">تعرفه ماهانه:</span>
                        <span style="color:#CCFF00;font-weight:900;font-size:18px;">${tariff}</span>
                    </div>
                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;background:#121A2F;padding:16px;border-radius:14px;font-size:13px;color:#CBD5E1;margin-bottom:24px;text-align:right;" dir="rtl">
                        <div><i data-lucide="ruler" style="width:1.2em;height:1.2em;vertical-align:text-bottom;display:inline-block;"></i> ابعاد: <strong style="color:#F8FAFC;">${dims}</strong></div>
                        <div><i data-lucide="eye" style="width:1.2em;height:1.2em;vertical-align:text-bottom;display:inline-block;"></i> وضعیت: <strong style="color:#F8FAFC;">${status ? 'آزاد' : 'رزرو'}</strong></div>
                    </div>
                    <button class="reserve-trigger-btn" onclick="openMainReservationModal('${code}', '${title.replace(/'/g,"\'")}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><path d="M3 10h18"/><path d="M16 19h6"/><path d="M19 16v6"/></svg>
                        <span>رزرو رسانه</span>
                    </button>
                </div>`;
            }).join('');
            
            if (typeof lucide !== 'undefined') lucide.createIcons();
        })
        .catch(() => {
            const grid = document.getElementById('homepage-featured-grid');
            if (grid) grid.innerHTML = '';
        });
})();

/* ==================== DYNAMIC TICKER & HEADER OPTIONS SYNC ==================== */
document.addEventListener("DOMContentLoaded", function() {
    function applySilveriomDynamicSettings() {
        if (!window.silveriomSettings) return;

        // 1. Ticker Updates
        var tickerConf = window.silveriomSettings.ticker;
        var topBar = document.getElementById('top-complex-bar') || document.querySelector('.top-complex-bar');
        if (topBar && tickerConf) {
            if (tickerConf.enabled === false) {
                topBar.style.display = 'none';
                var nav = document.querySelector('.luxury-nav');
                if (nav) nav.style.top = '0px';
            } else if (tickerConf.items && tickerConf.items.length > 0) {
                var groupHtml = '';
                if (tickerConf.badge) {
                    groupHtml += '<span class="top-bar-badge">' + tickerConf.badge + '</span> ';
                }
                tickerConf.items.forEach(function(item) {
                    if (item.link) {
                        groupHtml += '<a class="top-c-item" href="' + item.link + '"><strong>' + item.text + '</strong></a> ';
                    } else {
                        groupHtml += '<span class="top-c-item"><strong>' + item.text + '</strong></span> ';
                    }
                    groupHtml += '<span class="top-c-sep">•</span> ';
                });

                var groups = topBar.querySelectorAll('.marquee-group');
                if (groups.length >= 2) {
                    groups[0].innerHTML = groupHtml;
                    groups[1].innerHTML = groupHtml;
                }
                if (tickerConf.speed) {
                    var track = topBar.querySelector('.marquee-track');
                    if (track) {
                        track.style.animationDuration = tickerConf.speed + 's';
                    }
                }
            }
        }

        // 2. Nav Phone & CTA Updates
        var navConf = window.silveriomSettings.nav;
        if (navConf) {
            var phoneBtn = document.querySelector('.luxury-nav .glass-phone-btn');
            if (phoneBtn && navConf.phone) {
                var phoneSvg = phoneBtn.querySelector('svg');
                phoneBtn.innerHTML = '';
                if (phoneSvg) phoneBtn.appendChild(phoneSvg);
                phoneBtn.appendChild(document.createTextNode(' ' + navConf.phone));
                if (navConf.phoneLink) phoneBtn.href = navConf.phoneLink;
            }

            var ctaBtn = document.querySelector('.luxury-nav #open-kit-btn') || document.querySelector('.luxury-nav .luxury-btn-outline');
            if (ctaBtn && navConf.ctaText) {
                var ctaSvg = ctaBtn.querySelector('svg');
                ctaBtn.innerHTML = '';
                if (ctaSvg) ctaBtn.appendChild(ctaSvg);
                ctaBtn.appendChild(document.createTextNode(' ' + navConf.ctaText));
                if (navConf.ctaLink) ctaBtn.href = navConf.ctaLink;
            }
        }
    }

    applySilveriomDynamicSettings();
    setTimeout(applySilveriomDynamicSettings, 300);
    setTimeout(applySilveriomDynamicSettings, 1000);
});

