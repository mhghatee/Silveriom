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

    // Global Navigation Styles
    if (file_exists(get_template_directory() . '/assets/css/global-nav.css')) {
        wp_enqueue_style(
            'silveriom-global-nav',
            get_template_directory_uri() . '/assets/css/global-nav.css',
            [],
            $theme_version
        );
    }

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
    wp_enqueue_script('lucide-icons', 'https://unpkg.com/lucide@latest', [], 'latest', true);

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

    // Custom Header Scroll Script
    wp_add_inline_script('lucide-icons', '
        document.addEventListener("DOMContentLoaded", function() {
            if (window.lucide) {
                lucide.createIcons();
            }
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
