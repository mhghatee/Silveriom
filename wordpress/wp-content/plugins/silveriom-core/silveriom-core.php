<?php
/**
 * Plugin Name: Silveriom Core & Elementor Kit
 * Plugin URI: https://silveriom.ir
 * Description: Core functionality and Elementor page builder widgets & automatic page importer for Silveriom Luxury Sports Media Platform.
 * Version: 1.0.0
 * Author: Silveriom Team
 * Author URI: https://silveriom.ir
 * Text Domain: silveriom-core
 */

if (!defined('ABSPATH')) {
    exit;
}

// 1. Register Elementor Widget Category
function silveriom_add_elementor_category($elements_manager) {
    $elements_manager->add_category(
        'silveriom-luxury',
        [
            'title' => esc_html__('سیلوریوم | المان‌های اختصاصی', 'silveriom-core'),
            'icon'  => 'fa fa-plug',
        ]
    );
}
add_action('elementor/elements/categories_registered', 'silveriom_add_elementor_category');

// 2. Register Custom Post Types if needed (Tournaments & Clubs)
function silveriom_register_post_types() {
    register_post_type('silveriom_tourn', [
        'labels' => [
            'name'          => 'تورنمنت‌ها',
            'singular_name' => 'تورنمنت',
            'add_new'       => 'افزودن تورنمنت جدید',
        ],
        'public'      => true,
        'has_archive' => true,
        'supports'    => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'menu_icon'   => 'dashicons-awards',
        'show_in_rest'=> true,
    ]);
}
add_action('init', 'silveriom_register_post_types');

// 3. Admin Menu & 1-Click Page Importer
function silveriom_admin_menu() {
    add_menu_page(
        'سیلوریوم - درون‌ریزی صفحات',
        'سیلوریوم المنتور',
        'manage_options',
        'silveriom-importer',
        'silveriom_render_importer_page',
        'dashicons-superhero-alt',
        30
    );
}
add_action('admin_menu', 'silveriom_admin_menu');

function silveriom_render_importer_page() {
    if (isset($_POST['silveriom_import_now']) && check_admin_referer('silveriom_import_nonce')) {
        $result = silveriom_execute_full_import();
        echo '<div class="notice notice-success is-dismissible"><p><strong>موفقیت:</strong> ' . esc_html($result) . '</p></div>';
    }
    ?>
    <div class="wrap" style="direction:rtl; text-align:right; max-width:800px; margin-top:30px;">
        <div style="background:#020612; color:#fff; border-radius:12px; padding:30px; border:1px solid rgba(204,255,0,0.3); box-shadow:0 10px 30px rgba(0,0,0,0.5);">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
                <h1 style="color:#CCFF00; margin:0; font-size:1.8rem; font-weight:800;">درون‌ریزی خودکار صفحات سیلوریوم در المنتور</h1>
            </div>
            <p style="color:#8E9BAE; font-size:1.05rem; line-height:2;">
                با کلیک روی دکمه زیر، تمامی صفحات وب‌سایت سیلوریوم (شامل صفحه اصلی، تقویم مسابقات، پلنر رسانه‌ای، هوش مخاطبان، درباره ما، پرزنتیشن و تماس) به صورت کاملاً خودکار ساخته شده و با تنظیمات کامل المنتور فعال و متصل می‌شوند.
            </p>
            <form method="post" style="margin-top:25px;">
                <?php wp_nonce_field('silveriom_import_nonce'); ?>
                <button type="submit" name="silveriom_import_now" value="1" 
                        style="background:#CCFF00; color:#020612; font-weight:800; font-size:1.1rem; padding:14px 32px; border-radius:10px; border:none; cursor:pointer; box-shadow:0 0 20px rgba(204,255,0,0.4);">
                    شروع ساخت و درون‌ریزی خودکار صفحات
                </button>
            </form>
        </div>
    </div>
    <?php
}

// 4. Import / Create All Elementor Pages
function silveriom_execute_full_import() {
    $template_dir = plugin_dir_path(__FILE__) . '../../elementor-templates/';
    
    $pages_to_build = [
        [
            'title'     => 'صفحه اصلی سیلوریوم',
            'slug'      => 'home',
            'is_front'  => true,
            'file'      => '01-home.json'
        ],
        [
            'title'     => 'درباره ما',
            'slug'      => 'about-us',
            'file'      => '02-about-us.json'
        ],
        [
            'title'     => 'تقویم مسابقات',
            'slug'      => 'tournament-calendar',
            'file'      => '03-tournament-calendar.json'
        ],
        [
            'title'     => 'پلنر رسانه‌ای',
            'slug'      => 'media-planner',
            'file'      => '04-media-planner.json'
        ],
        [
            'title'     => 'هوش مخاطبان',
            'slug'      => 'audience-intelligence',
            'file'      => '05-audience-intelligence.json'
        ],
        [
            'title'     => 'نمونه‌کارها',
            'slug'      => 'portfolio',
            'file'      => '06-portfolio.json'
        ],
        [
            'title'     => 'پرزنتیشن رسمی',
            'slug'      => 'presentation',
            'file'      => '07-presentation.json'
        ],
        [
            'title'     => 'تماس با ما',
            'slug'      => 'contact-us',
            'file'      => '08-contact-us.json'
        ]
    ];

    $created_count = 0;

    foreach ($pages_to_build as $p) {
        $existing = get_page_by_path($p['slug']);
        
        $json_file = $template_dir . $p['file'];
        $elementor_data = '[]';
        if (file_exists($json_file)) {
            $raw_json = json_decode(file_get_contents($json_file), true);
            if (isset($raw_json['content'])) {
                $elementor_data = wp_json_encode($raw_json['content']);
            }
        }

        $page_args = [
            'post_title'   => $p['title'],
            'post_name'    => $p['slug'],
            'post_status'  => 'publish',
            'post_type'    => 'page',
            'post_content' => '',
        ];

        if ($existing) {
            $page_args['ID'] = $existing->ID;
            $page_id = wp_update_post($page_args);
        } else {
            $page_id = wp_insert_post($page_args);
        }

        if ($page_id && !is_wp_error($page_id)) {
            // Enable Elementor on this page
            update_post_meta($page_id, '_elementor_edit_mode', 'builder');
            update_post_meta($page_id, '_elementor_template_type', 'wp-page');
            update_post_meta($page_id, '_elementor_version', '3.20.0');
            update_post_meta($page_id, '_wp_page_template', 'elementor_header_footer');
            
            if (!empty($elementor_data)) {
                update_post_meta($page_id, '_elementor_data', wp_slash($elementor_data));
            }

            if (!empty($p['is_front'])) {
                update_option('show_on_front', 'page');
                update_option('page_on_front', $page_id);
            }

            $created_count++;
        }
    }

    return "تعداد {$created_count} صفحه اختصاصی با موفقیت در وردپرس ایجاد شده و در المنتور متصل گردیدند!";
}
