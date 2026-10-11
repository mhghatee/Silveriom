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
    <link rel="icon" type="image/png" href="<?php echo esc_url(get_template_directory_uri() . '/favicon.png'); ?>">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<?php if (!function_exists('elementor_theme_do_location') || !elementor_theme_do_location('header')) : ?>
<!-- Silveriom Unified Luxury Glass Navigation -->
<header class="luxury-nav">
  <div class="nav-container">
    <a href="<?php echo esc_url(home_url('/')); ?>" class="nav-brand">
      <span class="brand-text">SILVERIOM</span>
      <span class="brand-dot"></span>
    </a>

    <nav class="nav-links">
      <a href="<?php echo esc_url(home_url('/')); ?>" class="nav-item">صفحه اصلی</a>
      <a href="<?php echo esc_url(home_url('/tournament-calendar/')); ?>" class="nav-item">تقویم مسابقات</a>
      <a href="<?php echo esc_url(home_url('/media-planner/')); ?>" class="nav-item">پلنر رسانه‌ای</a>
      <a href="<?php echo esc_url(home_url('/audience-intelligence/')); ?>" class="nav-item">هوش مخاطبان</a>
      <a href="<?php echo esc_url(home_url('/portfolio/')); ?>" class="nav-item">نمونه‌کارها</a>
      <a href="<?php echo esc_url(home_url('/about-us/')); ?>" class="nav-item">درباره ما</a>
      <a href="<?php echo esc_url(home_url('/contact-us/')); ?>" class="nav-item">تماس</a>
    </nav>

    <div class="nav-actions">
      <a href="<?php echo esc_url(home_url('/media-planner/')); ?>" class="silveriom-neon-btn" style="padding:8px 18px; font-size:0.85rem;">
        درخواست پلن تبلیغاتی
      </a>
    </div>
  </div>
</header>
<?php endif; ?>

<main id="primary" class="site-main">
