<?php
/**
 * Silveriom Theme Functions & Elementor Integration
 */

if (!defined('ABSPATH')) {
    exit;
}

function silveriom_setup() {
    // Basic theme supports
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption']);
    add_theme_support('align-wide');
    add_theme_support('responsive-embeds');

    // Register Navigation Menus
    register_nav_menus([
        'primary-menu' => esc_html__('Primary Menu', 'silveriom'),
        'footer-menu'  => esc_html__('Footer Menu', 'silveriom')
    ]);
}
add_action('after_setup_theme', 'silveriom_setup');

// Enqueue styles and scripts
function silveriom_scripts() {
    $theme_version = wp_get_theme()->get('Version');

    // Vazirmatn & Cinzel Google Fonts
    wp_enqueue_style(
        'silveriom-google-fonts',
        'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Space+Grotesk:wght@300;400;500;700&family=Vazirmatn:wght@300;400;500;700;800;900&display=swap',
        [],
        null
    );



    // Main Theme Stylesheet
    wp_enqueue_style('silveriom-main-style', get_stylesheet_uri(), ['silveriom-google-fonts'], $theme_version);

    // Full Silveriom Design Bundle (Animations, Hero, 3D, Cards, RTL styles)
    if (file_exists(get_template_directory() . '/assets/css/silveriom-bundle.css')) {
        wp_enqueue_style(
            'silveriom-bundle',
            get_template_directory_uri() . '/assets/css/silveriom-bundle.css',
            ['silveriom-main-style'],
            $theme_version
        );
    }

    // Animation & 3D Libraries
    wp_enqueue_script('threejs', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', [], 'r128', true);
    wp_enqueue_script('gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', [], '3.12.5', true);
    wp_enqueue_script('gsap-scrolltrigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', ['gsap'], '3.12.5', true);
    
    // Local Lucide Icons Library (No external CDN dependency)
    if (file_exists(get_template_directory() . '/assets/js/lucide.min.js')) {
        wp_enqueue_script('lucide-icons', get_template_directory_uri() . '/assets/js/lucide.min.js', [], $theme_version, true);
    } else {
        wp_enqueue_script('lucide-icons', 'https://unpkg.com/lucide@latest', [], 'latest', true);
    }

    // Full Silveriom Interactive Script Bundle (WebGL Particles, 3D Canvas, Nav, Loader Dismiss)
    if (file_exists(get_template_directory() . '/assets/js/silveriom-bundle.js')) {
        wp_enqueue_script(
            'silveriom-bundle-js',
            get_template_directory_uri() . '/assets/js/silveriom-bundle.js',
            ['threejs', 'gsap', 'gsap-scrolltrigger', 'lucide-icons'],
            $theme_version,
            true
        );
    }

    // Custom Header Scroll & Lucide Icons Script
    wp_add_inline_script('lucide-icons', '
        function initSilveriomIcons() {
            if (window.lucide && typeof window.lucide.createIcons === "function") {
                window.lucide.createIcons();
            }
        }
        document.addEventListener("DOMContentLoaded", initSilveriomIcons);
        window.addEventListener("load", initSilveriomIcons);
        setTimeout(initSilveriomIcons, 1000);
        setTimeout(initSilveriomIcons, 3000);

        document.addEventListener("DOMContentLoaded", function() {
            var nav = document.querySelector(".luxury-nav");
            if (nav) {
                window.addEventListener("scroll", function() {
                    if (window.scrollY > 40) {
                        nav.classList.add("scrolled");
                    } else {
                        nav.classList.remove("scrolled");
                    }
                });
            }

            // Client-side image URL auto-repair
            function fixAllAssetUrls() {
                var images = document.querySelectorAll("img");
                for (var i = 0; i < images.length; i++) {
                    var s = images[i].getAttribute("src");
                    if (s && !s.startsWith("http") && !s.startsWith("//") && (s.startsWith("assets/") || s.startsWith("../assets/") || s.startsWith("/assets/"))) {
                        var clean = s.replace(/^(\.\.\/|\/)?assets\//, "assets/");
                        images[i].src = "https://silveriom.ir/" + clean;
                    }
                }
            }
            fixAllAssetUrls();
            setTimeout(fixAllAssetUrls, 500);
            setTimeout(fixAllAssetUrls, 1500);
        });
    ');
}
add_action('wp_enqueue_scripts', 'silveriom_scripts');

// Allow SVG uploads in WordPress Media Library
function silveriom_mime_types($mimes) {
    $mimes['svg'] = 'image/svg+xml';
    $mimes['woff'] = 'font/woff';
    $mimes['woff2'] = 'font/woff2';
    return $mimes;
}
add_filter('upload_mimes', 'silveriom_mime_types');

// Ensure Elementor Full Width / Canvas Compatibility
add_action('elementor/page_templates/header_footer/before_content', function() {
    // Hook before Elementor content if needed
});

// Auto-rewrite relative assets (assets/ or ../assets/) to absolute live domain URLs
function silveriom_fix_asset_urls($content) {
    if (empty($content) || !is_string($content)) {
        return $content;
    }
    // Match ../assets/
    $content = preg_replace('/(src|href|srcset)=([\\\"\\\'\\\\]*)\.\.\/assets\//i', '$1=$2https://silveriom.ir/assets/', $content);
    $content = preg_replace('/(url\([\\\"\\\'\\\\]*)\.\.\/assets\//i', '$1https://silveriom.ir/assets/', $content);
    // Match /assets/ (leading slash without domain)
    $content = preg_replace('/(src|href|srcset)=([\\\"\\\'\\\\]*)\/assets\//i', '$1=$2https://silveriom.ir/assets/', $content);
    $content = preg_replace('/(url\([\\\"\\\'\\\\]*)\/assets\//i', '$1https://silveriom.ir/assets/', $content);
    // Match assets/
    $content = preg_replace('/(src|href|srcset)=([\\\"\\\'\\\\]*)assets\//i', '$1=$2https://silveriom.ir/assets/', $content);
    $content = preg_replace('/(url\([\\\"\\\'\\\\]*)assets\//i', '$1https://silveriom.ir/assets/', $content);
    return $content;
}

function silveriom_buffer_start() {
    if (!is_admin()) {
        ob_start('silveriom_fix_asset_urls');
    }
}
add_action('template_redirect', 'silveriom_buffer_start', 1);

add_filter('the_content', 'silveriom_fix_asset_urls', 999);
add_filter('elementor/frontend/the_content', 'silveriom_fix_asset_urls', 999);
add_filter('widget_text', 'silveriom_fix_asset_urls', 999);

// Detect if current request is inside Elementor Editor or Preview
function silveriom_is_elementor_editor() {
    if (isset($_GET['elementor-preview']) || (isset($_GET['action']) && $_GET['action'] === 'elementor')) {
        return true;
    }
    if (did_action('elementor/loaded')) {
        if (\Elementor\Plugin::$instance->editor->is_edit_mode() || \Elementor\Plugin::$instance->preview->is_preview_mode()) {
            return true;
        }
    }
    return false;
}

// Completely remove and hide loader when editing in Elementor
add_action('wp_head', function() {
    ?>
    <style id="silveriom-elementor-editor-fix">
        body.elementor-editor-active #silverium-loader,
        body.elementor-editor-preview #silverium-loader,
        .elementor-editor-active #silverium-loader,
        .elementor-editor-preview #silverium-loader,
        [data-elementor-device-mode] #silverium-loader {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            z-index: -99999 !important;
        }
        <?php if (silveriom_is_elementor_editor()) : ?>
        #silverium-loader {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            z-index: -99999 !important;
        }
        <?php endif; ?>
    </style>
    <script id="silveriom-elementor-editor-script">
        (function() {
            if (window.location.search.indexOf("elementor") !== -1 || window.elementor || (window.parent && window.parent.elementor)) {
                var style = document.createElement("style");
                style.innerHTML = "#silverium-loader { display: none !important; opacity: 0 !important; pointer-events: none !important; }";
                document.head.appendChild(style);
                document.addEventListener("DOMContentLoaded", function() {
                    var l = document.getElementById("silverium-loader");
                    if (l) l.remove();
                });
            }
        })();
    </script>
    <?php
}, 1);

// Include Silveriom Admin Theme Options Panel
if (file_exists(get_template_directory() . '/inc/silveriom-settings.php')) {
    require_once get_template_directory() . '/inc/silveriom-settings.php';
}

// Pass dynamic settings to frontend
add_action('wp_head', function() {
    // Loader
    $loader_enabled = get_option('silveriom_loader_enabled', '1');
    $loader_text = get_option('silveriom_loader_text', 'در حال ورود به زمین سیلوریوم...');
    $loader_welcome = get_option('silveriom_loader_welcome', 'خوش آمدید!');
    $loader_poster = get_option('silveriom_loader_poster', 'https://silveriom.ir/loading_poster.png');
    $loader_video = get_option('silveriom_loader_video', 'https://silveriom.ir/loading_video.mp4');
    $loader_color = get_option('silveriom_loader_color', '#CCFF00');
    $loader_speed = get_option('silveriom_loader_speed', 800);

    // Ticker
    $ticker_enabled = get_option('silveriom_ticker_enabled', '1');
    $ticker_badge = get_option('silveriom_ticker_badge', 'شبکه انحصاری پدل سیلوریوم:');
    $ticker_raw = get_option('silveriom_ticker_content', "T10 آجودانیه (۷ پدل + ۳ تنیس) | #venues-map\nArena آزادی (۸ پدل مسابقاتی) | #venues-map\nIran Zamin شهرک غرب (۶ پدل پانورامیک) | #venues-map\nNetra لواسان (۷ پدل VIP) | #venues-map\nAsayesh مازندران (۴ پدل + ۱۲ تنیس) | #venues-map");
    $ticker_speed = get_option('silveriom_ticker_speed', 38);

    // Parse ticker lines
    $ticker_items = [];
    $lines = explode("\n", str_replace("\r", "", $ticker_raw));
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line)) continue;
        $parts = explode("|", $line);
        $item_text = trim($parts[0]);
        $item_link = isset($parts[1]) ? trim($parts[1]) : '';
        $ticker_items[] = [
            'text' => $item_text,
            'link' => $item_link
        ];
    }

    // Nav
    $nav_phone = get_option('silveriom_nav_phone', '۰۲۱-۲۲۰۰۰۰۰۰');
    $nav_phone_link = get_option('silveriom_nav_phone_link', 'tel:02122000000');
    $nav_cta_text = get_option('silveriom_nav_cta_text', 'دریافت مدیاکیت');
    $nav_cta_link = get_option('silveriom_nav_cta_link', '#open-kit-modal');
    ?>
    <script id="silveriom-theme-settings">
        window.silveriomSettings = {
            loader: {
                enabled: <?php echo ($loader_enabled === '1') ? 'true' : 'false'; ?>,
                text: <?php echo json_encode($loader_text); ?>,
                welcome: <?php echo json_encode($loader_welcome); ?>,
                poster: <?php echo json_encode($loader_poster); ?>,
                video: <?php echo json_encode($loader_video); ?>,
                color: <?php echo json_encode($loader_color); ?>,
                speed: <?php echo intval($loader_speed); ?>
            },
            ticker: {
                enabled: <?php echo ($ticker_enabled === '1') ? 'true' : 'false'; ?>,
                badge: <?php echo json_encode($ticker_badge); ?>,
                items: <?php echo json_encode($ticker_items); ?>,
                speed: <?php echo intval($ticker_speed); ?>
            },
            nav: {
                phone: <?php echo json_encode($nav_phone); ?>,
                phoneLink: <?php echo json_encode($nav_phone_link); ?>,
                ctaText: <?php echo json_encode($nav_cta_text); ?>,
                ctaLink: <?php echo json_encode($nav_cta_link); ?>
            }
        };
        // Backwards compatibility for loader
        window.silveriomLoaderConfig = window.silveriomSettings.loader;
    </script>
    <style id="silveriom-dynamic-overrides">
        <?php if ($loader_enabled !== '1') : ?>
        #silverium-loader { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }
        <?php endif; ?>
        <?php if ($ticker_enabled !== '1') : ?>
        #top-complex-bar, .top-complex-bar { display: none !important; visibility: hidden !important; height: 0 !important; }
        header#main-nav.luxury-nav, .luxury-nav { top: 0 !important; }
        body.admin-bar header#main-nav.luxury-nav, body.admin-bar .luxury-nav { top: 32px !important; }
        <?php endif; ?>
    </style>
    <?php
}, 2);



