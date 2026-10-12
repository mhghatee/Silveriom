<?php
/**
 * Silveriom Theme Options & Panel (Loader, Top Ticker, Header & Navigation)
 */

if (!defined('ABSPATH')) {
    exit;
}

// Register All Silveriom Settings
function silveriom_register_all_settings() {
    // --- 1. Loader Settings ---
    register_setting('silveriom_settings_group', 'silveriom_loader_enabled', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => '1'
    ]);
    register_setting('silveriom_settings_group', 'silveriom_loader_text', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => 'در حال ورود به زمین سیلوریوم...'
    ]);
    register_setting('silveriom_settings_group', 'silveriom_loader_welcome', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => 'خوش آمدید!'
    ]);
    register_setting('silveriom_settings_group', 'silveriom_loader_poster', [
        'type' => 'string',
        'sanitize_callback' => 'esc_url_raw',
        'default' => 'https://silveriom.ir/loading_poster.png'
    ]);
    register_setting('silveriom_settings_group', 'silveriom_loader_video', [
        'type' => 'string',
        'sanitize_callback' => 'esc_url_raw',
        'default' => 'https://silveriom.ir/loading_video.mp4'
    ]);
    register_setting('silveriom_settings_group', 'silveriom_loader_color', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_hex_color',
        'default' => '#CCFF00'
    ]);
    register_setting('silveriom_settings_group', 'silveriom_loader_speed', [
        'type' => 'integer',
        'sanitize_callback' => 'absint',
        'default' => 800
    ]);

    // --- 2. Top Ticker (Marquee) Settings ---
    register_setting('silveriom_settings_group', 'silveriom_ticker_enabled', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => '1'
    ]);
    register_setting('silveriom_settings_group', 'silveriom_ticker_badge', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => 'شبکه انحصاری پدل سیلوریوم:'
    ]);
    register_setting('silveriom_settings_group', 'silveriom_ticker_content', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_textarea_field',
        'default' => "T10 آجودانیه (۷ پدل + ۳ تنیس) | #venues-map\nArena آزادی (۸ پدل مسابقاتی) | #venues-map\nIran Zamin شهرک غرب (۶ پدل پانورامیک) | #venues-map\nNetra لواسان (۷ پدل VIP) | #venues-map\nAsayesh مازندران (۴ پدل + ۱۲ تنیس) | #venues-map"
    ]);
    register_setting('silveriom_settings_group', 'silveriom_ticker_speed', [
        'type' => 'integer',
        'sanitize_callback' => 'absint',
        'default' => 38
    ]);

    // --- 3. Header & Contact Buttons ---
    register_setting('silveriom_settings_group', 'silveriom_nav_phone', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => '۰۲۱-۲۲۰۰۰۰۰۰'
    ]);
    register_setting('silveriom_settings_group', 'silveriom_nav_phone_link', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => 'tel:02122000000'
    ]);
    register_setting('silveriom_settings_group', 'silveriom_nav_cta_text', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => 'دریافت مدیاکیت'
    ]);
    register_setting('silveriom_settings_group', 'silveriom_nav_cta_link', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => '#open-kit-modal'
    ]);
}
add_action('admin_init', 'silveriom_register_all_settings');

// Add Admin Menu
function silveriom_admin_menu_all() {
    add_menu_page(
        'تنظیمات سیلوریوم',
        'تنظیمات سیلوریوم',
        'manage_options',
        'silveriom-settings',
        'silveriom_render_all_settings_page',
        'dashicons-superhero-alt',
        59
    );
}
add_action('admin_menu', 'silveriom_admin_menu_all');

// Enqueue Media Picker in Admin
add_action('admin_enqueue_scripts', function($hook) {
    if ($hook !== 'toplevel_page_silveriom-settings') {
        return;
    }
    wp_enqueue_media();
});

// Render Settings Page with Tabs
function silveriom_render_all_settings_page() {
    $active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'ticker';

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
    $ticker_content = get_option('silveriom_ticker_content', "T10 آجودانیه (۷ پدل + ۳ تنیس) | #venues-map\nArena آزادی (۸ پدل مسابقاتی) | #venues-map\nIran Zamin شهرک غرب (۶ پدل پانورامیک) | #venues-map\nNetra لواسان (۷ پدل VIP) | #venues-map\nAsayesh مازندران (۴ پدل + ۱۲ تنیس) | #venues-map");
    $ticker_speed = get_option('silveriom_ticker_speed', 38);

    // Nav
    $nav_phone = get_option('silveriom_nav_phone', '۰۲۱-۲۲۰۰۰۰۰۰');
    $nav_phone_link = get_option('silveriom_nav_phone_link', 'tel:02122000000');
    $nav_cta_text = get_option('silveriom_nav_cta_text', 'دریافت مدیاکیت');
    $nav_cta_link = get_option('silveriom_nav_cta_link', '#open-kit-modal');
    ?>
    <div class="wrap silveriom-settings-wrap" style="max-width: 960px; margin: 30px auto; direction: rtl; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #020617 0%, #0a1128 100%); border: 1px solid rgba(204, 255, 0, 0.35); border-radius: 20px; padding: 30px 40px; margin-bottom: 25px; box-shadow: 0 20px 45px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
            <div>
                <h1 style="color: #ffffff; font-size: 1.85rem; font-weight: 800; margin: 0 0 8px 0; display: flex; align-items: center; gap: 12px;">
                    تنظیمات اختصاصی سیلوریوم
                    <span style="background: #CCFF00; color: #020612; font-size: 0.75rem; font-weight: 900; padding: 4px 12px; border-radius: 20px;">V1.5</span>
                </h1>
                <p style="color: #94a3b8; margin: 0; font-size: 0.95rem;">
                    مدیریت نوار متحرک بالای صفحه، لودر سینماتیک و دکمه‌های سربرگ بدون نیاز به کدنویسی.
                </p>
            </div>
            <a href="<?php echo esc_url(home_url('/')); ?>" target="_blank" style="background: rgba(204, 255, 0, 0.12); border: 1px solid #CCFF00; color: #CCFF00; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; font-size: 0.92rem;">
                مشاهده سایت ↗
            </a>
        </div>

        <?php if (isset($_GET['settings-updated'])) : ?>
            <div style="background: rgba(204, 255, 0, 0.15); border: 1px solid #CCFF00; color: #CCFF00; padding: 14px 22px; border-radius: 12px; margin-bottom: 25px; font-weight: 700;">
                ✓ تنظیمات با موفقیت ذخیره شد و روی کل سایت اعمال گردید.
            </div>
        <?php endif; ?>

        <!-- Tabs Navigation -->
        <div style="display: flex; gap: 10px; margin-bottom: 25px; border-bottom: 2px solid rgba(255,255,255,0.08); padding-bottom: 12px;">
            <a href="?page=silveriom-settings&tab=ticker" style="text-decoration: none; padding: 10px 24px; border-radius: 12px; font-weight: 700; font-size: 0.95rem; transition: all 0.3s; <?php echo ($active_tab === 'ticker') ? 'background: #CCFF00; color: #020612;' : 'background: rgba(255,255,255,0.05); color: #94a3b8;'; ?>">
                ⚡ نوار متحرک بالا (Ticker)
            </a>
            <a href="?page=silveriom-settings&tab=loader" style="text-decoration: none; padding: 10px 24px; border-radius: 12px; font-weight: 700; font-size: 0.95rem; transition: all 0.3s; <?php echo ($active_tab === 'loader') ? 'background: #CCFF00; color: #020612;' : 'background: rgba(255,255,255,0.05); color: #94a3b8;'; ?>">
                🎾 لودر سینماتیک
            </a>
            <a href="?page=silveriom-settings&tab=header" style="text-decoration: none; padding: 10px 24px; border-radius: 12px; font-weight: 700; font-size: 0.95rem; transition: all 0.3s; <?php echo ($active_tab === 'header') ? 'background: #CCFF00; color: #020612;' : 'background: rgba(255,255,255,0.05); color: #94a3b8;'; ?>">
                📞 دکمه‌های تماس و هدر
            </a>
        </div>

        <!-- Form -->
        <form method="post" action="options.php" style="background: #060d1f; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 35px 40px; box-shadow: 0 15px 35px rgba(0,0,0,0.3);">
            <?php settings_fields('silveriom_settings_group'); ?>

            <!-- ================= TAB 1: TICKER ================= -->
            <div id="tab-ticker" style="<?php echo ($active_tab === 'ticker') ? '' : 'display: none;'; ?>">
                <h2 style="color: #ffffff; font-size: 1.3rem; margin-top: 0; margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 15px;">
                    تنظیمات نوار متحرک بالای صفحه (Infinite Marquee Ticker)
                </h2>

                <!-- Enable / Disable Ticker -->
                <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 20px; margin-bottom: 25px; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <label for="silveriom_ticker_enabled" style="color: #ffffff; font-size: 1.05rem; font-weight: 700; display: block; margin-bottom: 6px;">
                            نمایش نوار متحرک بالا
                        </label>
                        <span style="color: #64748b; font-size: 0.88rem;">
                            اگر خاموش شود، نوار بالای صفحه حذف شده و منو مستقیماً به سقف صفحه می‌چسبد.
                        </span>
                    </div>
                    <div>
                        <label style="position: relative; display: inline-block; width: 60px; height: 32px;">
                            <input type="checkbox" id="silveriom_ticker_enabled" name="silveriom_ticker_enabled" value="1" <?php checked('1', $ticker_enabled); ?> style="opacity: 0; width: 0; height: 0;">
                            <span class="silveriom-slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #334155; transition: .4s; border-radius: 34px;"></span>
                        </label>
                    </div>
                </div>

                <!-- Ticker Badge Title -->
                <div style="margin-bottom: 25px;">
                    <label for="silveriom_ticker_badge" style="color: #ffffff; font-size: 1rem; font-weight: 700; display: block; margin-bottom: 8px;">
                        عنوان ثابت ابتدای نوار
                    </label>
                    <input type="text" id="silveriom_ticker_badge" name="silveriom_ticker_badge" value="<?php echo esc_attr($ticker_badge); ?>" style="width: 100%; background: #030712; border: 1px solid rgba(255,255,255,0.15); color: #ffffff; border-radius: 10px; padding: 12px 16px; font-size: 0.95rem;">
                    <span style="color: #64748b; font-size: 0.82rem; display: block; margin-top: 6px;">
                        پیش‌فرض: «شبکه انحصاری پدل سیلوریوم:» (می‌توانید به عنوان دلخواه تغییر دهید).
                    </span>
                </div>

                <!-- Ticker Items Content -->
                <div style="margin-bottom: 25px;">
                    <label for="silveriom_ticker_content" style="color: #ffffff; font-size: 1rem; font-weight: 700; display: block; margin-bottom: 8px;">
                        محتوای متن و لینک‌های نوار متحرک (هر آیتم در یک خط)
                    </label>
                    <textarea id="silveriom_ticker_content" name="silveriom_ticker_content" rows="6" style="width: 100%; background: #030712; border: 1px solid rgba(255,255,255,0.15); color: #ffffff; border-radius: 10px; padding: 14px 16px; font-size: 0.95rem; line-height: 1.8; direction: rtl; text-align: right;"><?php echo esc_textarea($ticker_content); ?></textarea>
                    <div style="background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 16px; margin-top: 8px; color: #94a3b8; font-size: 0.84rem; line-height: 1.7;">
                        💡 <strong>راهنما:</strong> هر خط نشان‌دهنده یک آیتم در نوار چرخان است. فرمت هر خط به صورت زیر است:<br>
                        <code>متن آیتم | آدرس لینک</code><br>
                        <em>مثال:</em> <code>T10 آجودانیه (۷ پدل + ۳ تنیس) | #venues-map</code><br>
                        (اگر لینک نمی‌خواهید، فقط متن را بدون علامت | بنویسید).
                    </div>
                </div>

                <!-- Ticker Animation Speed -->
                <div style="margin-bottom: 20px;">
                    <label for="silveriom_ticker_speed" style="color: #ffffff; font-size: 1rem; font-weight: 700; display: block; margin-bottom: 8px;">
                        سرعت چرخش نوار (ثانیه)
                    </label>
                    <input type="number" id="silveriom_ticker_speed" name="silveriom_ticker_speed" value="<?php echo esc_attr($ticker_speed); ?>" min="15" max="80" step="1" style="width: 140px; background: #030712; border: 1px solid rgba(255,255,255,0.15); color: #ffffff; border-radius: 10px; padding: 10px 14px; font-size: 0.95rem;">
                    <span style="color: #64748b; font-size: 0.82rem; display: block; margin-top: 6px;">
                        عدد کمتر = چرخش سریع‌تر، عدد بیشتر = چرخش آرام‌تر و روان‌تر (پیش‌فرض: ۳۸).
                    </span>
                </div>
            </div>

            <!-- ================= TAB 2: LOADER ================= -->
            <div id="tab-loader" style="<?php echo ($active_tab === 'loader') ? '' : 'display: none;'; ?>">
                <h2 style="color: #ffffff; font-size: 1.3rem; margin-top: 0; margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 15px;">
                    تنظیمات لودر سینماتیک (توپ تنیس)
                </h2>

                <!-- Enable / Disable Loader -->
                <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 20px; margin-bottom: 25px; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <label for="silveriom_loader_enabled" style="color: #ffffff; font-size: 1.05rem; font-weight: 700; display: block; margin-bottom: 6px;">
                            وضعیت لودر (روشن / خاموش)
                        </label>
                        <span style="color: #64748b; font-size: 0.88rem;">
                            اگر غیرفعال شود، لودر کاملاً از سایت حذف شده و صفحه بلافاصله باز می‌شود.
                        </span>
                    </div>
                    <div>
                        <label style="position: relative; display: inline-block; width: 60px; height: 32px;">
                            <input type="checkbox" id="silveriom_loader_enabled" name="silveriom_loader_enabled" value="1" <?php checked('1', $loader_enabled); ?> style="opacity: 0; width: 0; height: 0;">
                            <span class="silveriom-slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #334155; transition: .4s; border-radius: 34px;"></span>
                        </label>
                    </div>
                </div>

                <!-- Loading Text -->
                <div style="margin-bottom: 25px;">
                    <label for="silveriom_loader_text" style="color: #ffffff; font-size: 1rem; font-weight: 700; display: block; margin-bottom: 8px;">
                        متن در حال بارگذاری
                    </label>
                    <input type="text" id="silveriom_loader_text" name="silveriom_loader_text" value="<?php echo esc_attr($loader_text); ?>" style="width: 100%; background: #030712; border: 1px solid rgba(255,255,255,0.15); color: #ffffff; border-radius: 10px; padding: 12px 16px; font-size: 0.95rem;">
                </div>

                <!-- Welcome Text -->
                <div style="margin-bottom: 25px;">
                    <label for="silveriom_loader_welcome" style="color: #ffffff; font-size: 1rem; font-weight: 700; display: block; margin-bottom: 8px;">
                        متن اتمام بارگذاری
                    </label>
                    <input type="text" id="silveriom_loader_welcome" name="silveriom_loader_welcome" value="<?php echo esc_attr($loader_welcome); ?>" style="width: 100%; background: #030712; border: 1px solid rgba(255,255,255,0.15); color: #ffffff; border-radius: 10px; padding: 12px 16px; font-size: 0.95rem;">
                </div>

                <!-- Poster Image -->
                <div style="margin-bottom: 25px;">
                    <label for="silveriom_loader_poster" style="color: #ffffff; font-size: 1rem; font-weight: 700; display: block; margin-bottom: 8px;">
                        تصویر پوستر لودر (عکس توپ تنیس یا لوگو)
                    </label>
                    <div style="display: flex; gap: 12px;">
                        <input type="text" id="silveriom_loader_poster" name="silveriom_loader_poster" value="<?php echo esc_attr($loader_poster); ?>" style="flex-grow: 1; background: #030712; border: 1px solid rgba(255,255,255,0.15); color: #ffffff; border-radius: 10px; padding: 12px 16px; font-size: 0.95rem; direction: ltr; text-align: left;">
                        <button type="button" class="button button-secondary silveriom-media-upload-btn" data-target="#silveriom_loader_poster" style="background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; padding: 0 18px; height: auto;">
                            انتخاب از رسانه
                        </button>
                    </div>
                </div>

                <!-- Video URL -->
                <div style="margin-bottom: 25px;">
                    <label for="silveriom_loader_video" style="color: #ffffff; font-size: 1rem; font-weight: 700; display: block; margin-bottom: 8px;">
                        ویدیوی لودر (فایل mp4)
                    </label>
                    <div style="display: flex; gap: 12px;">
                        <input type="text" id="silveriom_loader_video" name="silveriom_loader_video" value="<?php echo esc_attr($loader_video); ?>" style="flex-grow: 1; background: #030712; border: 1px solid rgba(255,255,255,0.15); color: #ffffff; border-radius: 10px; padding: 12px 16px; font-size: 0.95rem; direction: ltr; text-align: left;">
                        <button type="button" class="button button-secondary silveriom-media-upload-btn" data-target="#silveriom_loader_video" style="background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; padding: 0 18px; height: auto;">
                            انتخاب از رسانه
                        </button>
                    </div>
                </div>

                <!-- Color and Speed -->
                <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 25px;">
                    <div>
                        <label for="silveriom_loader_color" style="color: #ffffff; font-size: 1rem; font-weight: 700; display: block; margin-bottom: 8px;">
                            رنگ نئون لودر
                        </label>
                        <input type="color" id="silveriom_loader_color" name="silveriom_loader_color" value="<?php echo esc_attr($loader_color); ?>" style="width: 60px; height: 42px; border: none; border-radius: 8px; cursor: pointer; background: transparent;">
                    </div>
                    <div>
                        <label for="silveriom_loader_speed" style="color: #ffffff; font-size: 1rem; font-weight: 700; display: block; margin-bottom: 8px;">
                            حداکثر زمان نمایش (میلی‌ثانیه)
                        </label>
                        <input type="number" id="silveriom_loader_speed" name="silveriom_loader_speed" value="<?php echo esc_attr($loader_speed); ?>" min="300" max="3000" step="100" style="width: 140px; background: #030712; border: 1px solid rgba(255,255,255,0.15); color: #ffffff; border-radius: 10px; padding: 10px 14px; font-size: 0.95rem;">
                    </div>
                </div>
            </div>

            <!-- ================= TAB 3: HEADER & BUTTONS ================= -->
            <div id="tab-header" style="<?php echo ($active_tab === 'header') ? '' : 'display: none;'; ?>">
                <h2 style="color: #ffffff; font-size: 1.3rem; margin-top: 0; margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 15px;">
                    تنظیمات دکمه‌های سربرگ (شماره تماس و دکمه پروپوزال)
                </h2>

                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px 22px; margin-bottom: 25px; color: #94a3b8; font-size: 0.9rem; line-height: 1.8;">
                    ℹ️ <strong>راهنمای منوی اصلی:</strong> آیتم‌های پیوندهای منو (خانه، رسانه‌ها با مگامنو، درباره ما، هوش مخاطبان و...) در هدر شیشه‌ای قرار دارند. شما از اینجا می‌توانید شماره تماس شیشه‌ای و دکمه دریافت مدیاکیت را تغییر دهید.
                </div>

                <!-- Phone Text -->
                <div style="margin-bottom: 25px;">
                    <label for="silveriom_nav_phone" style="color: #ffffff; font-size: 1rem; font-weight: 700; display: block; margin-bottom: 8px;">
                        شماره تلفن نمایش داده شده در دکمه شیشه‌ای
                    </label>
                    <input type="text" id="silveriom_nav_phone" name="silveriom_nav_phone" value="<?php echo esc_attr($nav_phone); ?>" style="width: 100%; background: #030712; border: 1px solid rgba(255,255,255,0.15); color: #ffffff; border-radius: 10px; padding: 12px 16px; font-size: 0.95rem; direction: ltr; text-align: right;">
                </div>

                <!-- Phone Link -->
                <div style="margin-bottom: 25px;">
                    <label for="silveriom_nav_phone_link" style="color: #ffffff; font-size: 1rem; font-weight: 700; display: block; margin-bottom: 8px;">
                        لینک تماس تلفنی (برای تماس با کلیک)
                    </label>
                    <input type="text" id="silveriom_nav_phone_link" name="silveriom_nav_phone_link" value="<?php echo esc_attr($nav_phone_link); ?>" style="width: 100%; background: #030712; border: 1px solid rgba(255,255,255,0.15); color: #ffffff; border-radius: 10px; padding: 12px 16px; font-size: 0.95rem; direction: ltr; text-align: left;">
                    <span style="color: #64748b; font-size: 0.82rem; display: block; margin-top: 6px;">
                        مثال: <code>tel:02122000000</code>
                    </span>
                </div>

                <!-- CTA Button Text -->
                <div style="margin-bottom: 25px;">
                    <label for="silveriom_nav_cta_text" style="color: #ffffff; font-size: 1rem; font-weight: 700; display: block; margin-bottom: 8px;">
                        متن دکمه اقدام سربرگ (CTA Button)
                    </label>
                    <input type="text" id="silveriom_nav_cta_text" name="silveriom_nav_cta_text" value="<?php echo esc_attr($nav_cta_text); ?>" style="width: 100%; background: #030712; border: 1px solid rgba(255,255,255,0.15); color: #ffffff; border-radius: 10px; padding: 12px 16px; font-size: 0.95rem;">
                </div>

                <!-- CTA Button Link -->
                <div style="margin-bottom: 20px;">
                    <label for="silveriom_nav_cta_link" style="color: #ffffff; font-size: 1rem; font-weight: 700; display: block; margin-bottom: 8px;">
                        لینک یا اکشن دکمه اقدام
                    </label>
                    <input type="text" id="silveriom_nav_cta_link" name="silveriom_nav_cta_link" value="<?php echo esc_attr($nav_cta_link); ?>" style="width: 100%; background: #030712; border: 1px solid rgba(255,255,255,0.15); color: #ffffff; border-radius: 10px; padding: 12px 16px; font-size: 0.95rem; direction: ltr; text-align: left;">
                </div>
            </div>

            <!-- Submit Button (Always Visible) -->
            <div style="padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.08); margin-top: 25px; display: flex; justify-content: space-between; align-items: center;">
                <button type="submit" class="button button-primary" style="background: #CCFF00; color: #020612; border: none; border-radius: 12px; font-size: 1.05rem; font-weight: 800; padding: 12px 40px; cursor: pointer; box-shadow: 0 4px 20px rgba(204, 255, 0, 0.35);">
                    ذخیره کلیه تنظیمات
                </button>
                <span style="color: #64748b; font-size: 0.85rem;">
                    تغییرات بلافاصله روی صفحه اصلی و کلیه صفحات سایت اعمال می‌شوند.
                </span>
            </div>
        </form>
    </div>

    <style>
        .silveriom-slider:before {
            position: absolute;
            content: "";
            height: 24px;
            width: 24px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .silveriom-slider {
            background-color: #CCFF00;
        }
        input:checked + .silveriom-slider:before {
            transform: translateX(28px);
            background-color: #020612;
        }
    </style>

    <script>
        jQuery(document).ready(function($) {
            $('.silveriom-media-upload-btn').click(function(e) {
                e.preventDefault();
                var targetInput = $($(this).data('target'));
                var customUploader = wp.media({
                    title: 'انتخاب رسانه',
                    button: { text: 'انتخاب این فایل' },
                    multiple: false
                }).on('select', function() {
                    var attachment = customUploader.state().get('selection').first().toJSON();
                    targetInput.val(attachment.url);
                }).open();
            });
        });
    </script>
    <?php
}
