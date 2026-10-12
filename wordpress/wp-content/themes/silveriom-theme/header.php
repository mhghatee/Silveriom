<?php
/**
 * Silveriom Theme Header
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> dir="rtl">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <link rel="icon" type="image/png" href="<?php echo esc_url(home_url('/favicon.png')); ?>">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- ================= Silverium Loader HTML ================= -->
<div id="silverium-loader">
  <div class="bg-grid"></div>
  <div class="content-wrapper">
    <div class="video-container" style="position: relative;">
      <img alt="Loading" id="silverium-video-poster" src="https://silveriom.ir/loading_poster.png" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transform: scale(1.1); mix-blend-mode: screen; -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 65%); z-index: 2; pointer-events: none;"/>
      <video autoplay="" id="silverium-main-video" loop="" muted="" playsinline="" preload="auto">
        <source src="https://silveriom.ir/loading_video.mp4" type="video/mp4"/>
      </video>
    </div>
    <div class="progress-section">
      <div class="percentage" id="loader-percentage">0%</div>
      <div class="progress-bar-container">
        <div class="progress-fill" id="loader-progress-fill"></div>
      </div>
      <div class="loading-text" id="loader-text">در حال ورود به زمین سیلوریوم...</div>
    </div>
  </div>
</div>

<!-- ================= TOP COMPLEX MARQUEE TICKER ================= -->
<div class="top-complex-bar" id="top-complex-bar">
  <div class="marquee-track">
    <div class="marquee-group">
      <span class="top-bar-badge">شبکه انحصاری پدل سیلوریوم:</span>
      <a class="top-c-item" href="#venues-map"><strong>T10 آجودانیه</strong> (۷ پدل + ۳ تنیس)</a>
      <span class="top-c-sep">•</span>
      <a class="top-c-item" href="#venues-map"><strong>Arena آزادی</strong> (۸ پدل مسابقاتی)</a>
      <span class="top-c-sep">•</span>
      <a class="top-c-item" href="#venues-map"><strong>Iran Zamin شهرک غرب</strong> (۶ پدل پانورامیک)</a>
      <span class="top-c-sep">•</span>
      <a class="top-c-item" href="#venues-map"><strong>Netra لواسان</strong> (۷ پدل VIP)</a>
      <span class="top-c-sep">•</span>
      <a class="top-c-item" href="#venues-map"><strong>Asayesh مازندران</strong> (۴ پدل + ۱۲ تنیس)</a>
      <span class="top-c-sep">•</span>
    </div>
    <div class="marquee-group">
      <span class="top-bar-badge">شبکه انحصاری پدل سیلوریوم:</span>
      <a class="top-c-item" href="#venues-map"><strong>T10 آجودانیه</strong> (۷ پدل + ۳ تنیس)</a>
      <span class="top-c-sep">•</span>
      <a class="top-c-item" href="#venues-map"><strong>Arena آزادی</strong> (۸ پدل مسابقاتی)</a>
      <span class="top-c-sep">•</span>
      <a class="top-c-item" href="#venues-map"><strong>Iran Zamin شهرک غرب</strong> (۶ پدل پانورامیک)</a>
      <span class="top-c-sep">•</span>
      <a class="top-c-item" href="#venues-map"><strong>Netra لواسان</strong> (۷ پدل VIP)</a>
      <span class="top-c-sep">•</span>
      <a class="top-c-item" href="#venues-map"><strong>Asayesh مازندران</strong> (۴ پدل + ۱۲ تنیس)</a>
      <span class="top-c-sep">•</span>
    </div>
  </div>
</div>

<!-- ================= 3D CANVAS & BACKGROUND ================= -->
<div class="cinematic-bg-container" id="cinematic-bg-container">
  <img alt="Ultra-Futuristic Luxury Padel Racket and Ball" class="cinematic-bg-img" id="cinematic-bg-img" src="https://silveriom.ir/assets/padel_cinematic_bg.jpg"/>
  <div class="bg-energy-glow"><div class="bg-energy-glow"></div><div class="navy-overlay-layer"></div></div>
</div>
<canvas id="webgl-canvas"></canvas>
<div class="navy-readability-overlay"></div>

<!-- ================= LUXURY NAVIGATION ================= -->
<header class="luxury-nav" id="main-nav">
  <div class="nav-container">
    <a class="nav-brand" href="<?php echo esc_url(home_url('/')); ?>" title="SILVERIOM Padel Media Agency">
      <img alt="SILVERIOM Padel Media Agency" class="nav-brand-logo-img" loading="lazy" src="https://silveriom.ir/assets/silveriom_logo_transparent.png"/>
    </a>
    <nav class="nav-links">
      <a class="nav-item active" href="<?php echo esc_url(home_url('/')); ?>">خانه</a>
      <div class="nav-wrapper relative" style="position: relative; display: inline-block;">
        <a href="<?php echo esc_url(home_url('/inventory/')); ?>" class="nav-item" style="display:flex; align-items:center; gap:4px;">
          رسانه‌ها
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px; margin-top:2px; transition: transform 0.3s;" class="mega-caret"><path d="m6 9 6 6 6-6"/></svg>
        </a>
        <div class="mega-menu absolute glass-panel-mega" style="position: absolute; top: calc(100% + 16px); right: 0; width: 900px; height: 540px; display: flex; padding: 1.5rem; gap: 2.5rem; flex-direction: row; cursor: default;">
          <div style="width: 55%; display: flex; flex-direction: column; padding-top: 0.5rem; height: 100%;">
            <span style="font-size: 0.875rem; color: #94a3b8; margin-bottom: 1rem; padding: 0 0.5rem; font-weight: 600;">بخش‌ها و باشگاه‌های تحت پوشش</span>
            <div style="display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1; padding: 0 0.5rem 0.5rem 0.5rem;">
              <a href="<?php echo esc_url(home_url('/inventory/')); ?>" class="mega-item group" style="display: flex; align-items: center; gap: 1.25rem;">
                <div class="mega-icon" style="display: flex; align-items: center; justify-content: center;">
                  <img src="https://silveriom.ir/assets/glass_icon.webp" alt="Archive Icon" class="highlight-icon" style="width: 44px; height: 44px; object-fit: contain;">
                </div>
                <h4 class="mega-title" style="font-size: 1.1rem; font-weight: 700; color: #CCFF00; margin: 0; transition: color 0.3s;">آرشیو جامع رسانه‌ها</h4>
              </a>
              <a href="<?php echo esc_url(home_url('/clubs/netra.html')); ?>" class="mega-item group" style="display: flex; align-items: center; gap: 1.25rem;">
                <div class="mega-icon" style="display: flex; align-items: center; justify-content: center;"><img src="https://silveriom.ir/assets/glass_icon.webp" alt="Icon" style="width: 44px; height: 44px; object-fit: contain;"></div>
                <h4 class="mega-title" style="font-size: 1.05rem; font-weight: 700; color: white; margin: 0;">مجموعه پدل نترا (لواسان)</h4>
              </a>
              <a href="<?php echo esc_url(home_url('/clubs/t10.html')); ?>" class="mega-item group" style="display: flex; align-items: center; gap: 1.25rem;">
                <div class="mega-icon" style="display: flex; align-items: center; justify-content: center;"><img src="https://silveriom.ir/assets/glass_icon.webp" alt="Icon" style="width: 44px; height: 44px; object-fit: contain;"></div>
                <h4 class="mega-title" style="font-size: 1.05rem; font-weight: 700; color: white; margin: 0;">مجموعه پدل T10 (آجودانیه)</h4>
              </a>
              <a href="<?php echo esc_url(home_url('/clubs/iran-zamin.html')); ?>" class="mega-item group" style="display: flex; align-items: center; gap: 1.25rem;">
                <div class="mega-icon" style="display: flex; align-items: center; justify-content: center;"><img src="https://silveriom.ir/assets/glass_icon.webp" alt="Icon" style="width: 44px; height: 44px; object-fit: contain;"></div>
                <h4 class="mega-title" style="font-size: 1.05rem; font-weight: 700; color: white; margin: 0;">مجموعه پدل ایران زمین (شهرک غرب)</h4>
              </a>
              <a href="<?php echo esc_url(home_url('/clubs/arena.html')); ?>" class="mega-item group" style="display: flex; align-items: center; gap: 1.25rem;">
                <div class="mega-icon" style="display: flex; align-items: center; justify-content: center;"><img src="https://silveriom.ir/assets/glass_icon.webp" alt="Icon" style="width: 44px; height: 44px; object-fit: contain;"></div>
                <h4 class="mega-title" style="font-size: 1.05rem; font-weight: 700; color: white; margin: 0;">مجموعه پدل آرنا (آزادی)</h4>
              </a>
              <a href="<?php echo esc_url(home_url('/clubs/asayesh.html')); ?>" class="mega-item group" style="display: flex; align-items: center; gap: 1.25rem;">
                <div class="mega-icon" style="display: flex; align-items: center; justify-content: center;"><img src="https://silveriom.ir/assets/glass_icon.webp" alt="Icon" style="width: 44px; height: 44px; object-fit: contain;"></div>
                <h4 class="mega-title" style="font-size: 1.05rem; font-weight: 700; color: white; margin: 0;">مجموعه پدل و تنیس آسایش (ساری)</h4>
              </a>
              <a href="<?php echo esc_url(home_url('/clubs/kish.html')); ?>" class="mega-item group" style="display: flex; align-items: center; gap: 1.25rem;">
                <div class="mega-icon" style="display: flex; align-items: center; justify-content: center;"><img src="https://silveriom.ir/assets/glass_icon.webp" alt="Icon" style="width: 44px; height: 44px; object-fit: contain;"></div>
                <h4 class="mega-title" style="font-size: 1.05rem; font-weight: 700; color: white; margin: 0;">مجموعه تنیس المپیک (کیش)</h4>
              </a>
            </div>
          </div>
          <a href="<?php echo esc_url(home_url('/inventory/')); ?>" class="left-image-group" style="width: 45%; height: 100%; border-radius: 1rem; position: relative; overflow: hidden; display: block;">
            <img src="https://silveriom.ir/assets/mega_menu_featured.jpg" alt="Featured Media" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
          </a>
        </div>
      </div>
      <a class="nav-item" href="<?php echo esc_url(home_url('/audience-intelligence/')); ?>">مخاطبین</a>
      <a class="nav-item" href="<?php echo esc_url(home_url('/tournament-calendar/')); ?>">تقویم مسابقات</a>
      <a class="nav-item" href="<?php echo esc_url(home_url('/portfolio/')); ?>">نمونه کارها</a>
      <a class="nav-item" href="<?php echo esc_url(home_url('/media-planner/')); ?>">مدیاپلنر</a>
      <a class="nav-item" href="<?php echo esc_url(home_url('/blog/')); ?>">مجله تخصصی</a>
      <a class="nav-item" href="<?php echo esc_url(home_url('/about-us/')); ?>">درباره ما</a>
      <a class="nav-item" href="<?php echo esc_url(home_url('/contact-us/')); ?>">تماس با ما</a>
    </nav>
    <div class="nav-actions" style="display:flex; align-items:center; gap:0.75rem;">
      <a class="glass-phone-btn" href="tel:02122000000" style="display:flex; align-items:center; gap:6px; color:#fff; text-decoration:none; padding:8px 16px; border-radius:30px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); font-size:14px; font-weight:600;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#CCFF00" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        ۰۲۱-۲۲۰۰۰۰۰۰
      </a>
      <button class="luxury-btn-outline" id="open-kit-btn" onclick="openMediaKitModal()" style="display:inline-flex; align-items:center; gap:8px; background:rgba(204,255,0,0.08); border:1px solid rgba(204,255,0,0.3); color:#CCFF00; padding:8px 18px; border-radius:30px; font-size:14px; font-weight:700; cursor:pointer;">
        <span>دریافت مدیاکیت</span>
      </button>
      <button class="mobile-toggle" id="mobile-toggle-btn" aria-label="Menu" style="display:none;">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>
<main id="primary" class="site-main">
