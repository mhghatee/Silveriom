<?php
/**
 * Silveriom Loader Settings Admin Panel
 */

if (!defined('ABSPATH')) {
    exit;
}

// Register Settings
function silveriom_register_loader_settings() {
    register_setting('silveriom_loader_group', 'silveriom_loader_enabled', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => '1'
    ]);
    register_setting('silveriom_loader_group', 'silveriom_loader_text', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => 'در حال ورود به زمین سیلوریوم...'
    ]);
    register_setting('silveriom_loader_group', 'silveriom_loader_welcome', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => 'خوش آمدید!'
    ]);
    register_setting('silveriom_loader_group', 'silveriom_loader_poster', [
        'type' => 'string',
        'sanitize_callback' => 'esc_url_raw',
        'default' => 'https://silveriom.ir/loading_poster.png'
    ]);
    register_setting('silveriom_loader_group', 'silveriom_loader_video', [
        'type' => 'string',
        'sanitize_callback' => 'esc_url_raw',
        'default' => 'https://silveriom.ir/loading_video.mp4'
    ]);
    register_setting('silveriom_loader_group', 'silveriom_loader_color', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_hex_color',
        'default' => '#CCFF00'
    ]);
    register_setting('silveriom_loader_group', 'silveriom_loader_speed', [
        'type' => 'integer',
        'sanitize_callback' => 'absint',
        'default' => 800
    ]);
}
add_action('admin_init', 'silveriom_register_loader_settings');

// Add Admin Menu Page
function silveriom_add_admin_menu() {
    add_menu_page(
        'تنظیمات سیلوریوم',
        'سیلوریوم',
        'manage_options',
        'silveriom-settings',
        'silveriom_render_loader_settings_page',
        'dashicons-superhero-alt',
        59
    );
    add_submenu_page(
        'silveriom-settings',
        'تنظیمات لودر',
        'تنظیمات لودر',
        'manage_options',
        'silveriom-settings',
        'silveriom_render_loader_settings_page'
    );
}
add_action('admin_menu', 'silveriom_add_admin_menu');

// Enqueue WordPress Media Uploader in Admin Page
function silveriom_admin_scripts($hook) {
    if ($hook !== 'toplevel_page_silveriom-settings') {
        return;
    }
    wp_enqueue_media();
}
add_action('admin_enqueue_scripts', 'silveriom_admin_scripts');

// Render Admin Settings Page
function silveriom_render_loader_settings_page() {
    $enabled = get_option('silveriom_loader_enabled', '1');
    $text = get_option('silveriom_loader_text', 'در حال ورود به زمین سیلوریوم...');
    $welcome = get_option('silveriom_loader_welcome', 'خوش آمدید!');
    $poster = get_option('silveriom_loader_poster', 'https://silveriom.ir/loading_poster.png');
    $video = get_option('silveriom_loader_video', 'https://silveriom.ir/loading_video.mp4');
    $color = get_option('silveriom_loader_color', '#CCFF00');
    $speed = get_option('silveriom_loader_speed', 800);
    ?>
    <div class="wrap silveriom-settings-wrap" style="max-width: 900px; margin: 30px auto; direction: rtl; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #020617 0%, #0a1128 100%); border: 1px solid rgba(204, 255, 0, 0.3); border-radius: 18px; padding: 30px 40px; margin-bottom: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
            <div>
                <h1 style="color: #ffffff; font-size: 1.8rem; font-weight: 800; margin: 0 0 10px 0; display: flex; align-items: center; gap: 12px;">
                    تنظیمات لودر سیلوریوم
                    <span style="background: #CCFF00; color: #020612; font-size: 0.75rem; font-weight: 900; padding: 4px 10px; border-radius: 20px;">SILVERIOM</span>
                </h1>
                <p style="color: #94a3b8; margin: 0; font-size: 0.95rem;">
                    مدیریت متن، رسانه‌ها (عکس/ویدیو) و وضعیت نمایش لودر سینماتیک در صفحه اصلی و سایت.
                </p>
            </div>
            <a href="<?php echo esc_url(home_url('/')); ?>" target="_blank" style="background: rgba(204, 255, 0, 0.1); border: 1px solid #CCFF00; color: #CCFF00; text-decoration: none; padding: 10px 22px; border-radius: 12px; font-weight: 700; font-size: 0.9rem; transition: all 0.3s;">
                مشاهده سایت ↗
            </a>
        </div>

        <?php if (isset($_GET['settings-updated'])) : ?>
            <div style="background: rgba(204, 255, 0, 0.15); border: 1px solid #CCFF00; color: #CCFF00; padding: 15px 25px; border-radius: 12px; margin-bottom: 25px; font-weight: 700;">
                ✓ تنظیمات با موفقیت ذخیره شد و روی سایت اعمال گردید.
            </div>
        <?php endif; ?>

        <!-- Form -->
        <form method="post" action="options.php" style="background: #060d1f; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 18px; padding: 35px 40px; box-shadow: 0 15px 35px rgba(0,0,0,0.3);">
            <?php settings_fields('silveriom_loader_group'); ?>

            <!-- Field 1: Enable / Disable -->
            <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 25px; margin-bottom: 25px; display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <label for="silveriom_loader_enabled" style="color: #ffffff; font-size: 1.1rem; font-weight: 700; display: block; margin-bottom: 6px;">
                        وضعیت لودر (روشن / خاموش)
                    </label>
                    <span style="color: #64748b; font-size: 0.88rem;">
                        اگر غیرفعال شود، لودر کاملاً از سایت حذف شده و صفحه بلافاصله باز می‌شود.
                    </span>
                </div>
                <div>
                    <label style="position: relative; display: inline-block; width: 60px; height: 32px;">
                        <input type="checkbox" id="silveriom_loader_enabled" name="silveriom_loader_enabled" value="1" <?php checked('1', $enabled); ?> style="opacity: 0; width: 0; height: 0;">
                        <span class="silveriom-slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #334155; transition: .4s; border-radius: 34px;"></span>
                    </label>
                </div>
            </div>

            <!-- Field 2: Loading Text -->
            <div style="margin-bottom: 25px;">
                <label for="silveriom_loader_text" style="color: #ffffff; font-size: 1rem; font-weight: 700; display: block; margin-bottom: 8px;">
                    متن در حال بارگذاری
                </label>
                <input type="text" id="silveriom_loader_text" name="silveriom_loader_text" value="<?php echo esc_attr($text); ?>" style="width: 100%; background: #030712; border: 1px solid rgba(255,255,255,0.15); color: #ffffff; border-radius: 10px; padding: 12px 16px; font-size: 0.95rem;">
                <span style="color: #64748b; font-size: 0.82rem; display: block; margin-top: 6px;">
                    متنی که زیر نوار درصد به کاربر نمایش داده می‌شود.
                </span>
            </div>

            <!-- Field 3: Welcome Text -->
            <div style="margin-bottom: 25px;">
                <label for="silveriom_loader_welcome" style="color: #ffffff; font-size: 1rem; font-weight: 700; display: block; margin-bottom: 8px;">
                    متن اتمام بارگذاری
                </label>
                <input type="text" id="silveriom_loader_welcome" name="silveriom_loader_welcome" value="<?php echo esc_attr($welcome); ?>" style="width: 100%; background: #030712; border: 1px solid rgba(255,255,255,0.15); color: #ffffff; border-radius: 10px; padding: 12px 16px; font-size: 0.95rem;">
                <span style="color: #64748b; font-size: 0.82rem; display: block; margin-top: 6px;">
                    متنی که در ۱۰۰٪ به کاربر نشان داده شده و سپس لودر محو می‌شود.
                </span>
            </div>

            <!-- Field 4: Poster Image -->
            <div style="margin-bottom: 25px;">
                <label for="silveriom_loader_poster" style="color: #ffffff; font-size: 1rem; font-weight: 700; display: block; margin-bottom: 8px;">
                    تصویر پوستر لودر (عکس توپ تنیس یا لوگو)
                </label>
                <div style="display: flex; gap: 12px;">
                    <input type="text" id="silveriom_loader_poster" name="silveriom_loader_poster" value="<?php echo esc_attr($poster); ?>" style="flex-grow: 1; background: #030712; border: 1px solid rgba(255,255,255,0.15); color: #ffffff; border-radius: 10px; padding: 12px 16px; font-size: 0.95rem; direction: ltr; text-align: left;">
                    <button type="button" class="button button-secondary silveriom-media-upload-btn" data-target="#silveriom_loader_poster" style="background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; padding: 0 18px; height: auto;">
                        انتخاب از رسانه
                    </button>
                </div>
            </div>

            <!-- Field 5: Video URL -->
            <div style="margin-bottom: 25px;">
                <label for="silveriom_loader_video" style="color: #ffffff; font-size: 1rem; font-weight: 700; display: block; margin-bottom: 8px;">
                    ویدیوی لودر (فایل mp4)
                </label>
                <div style="display: flex; gap: 12px;">
                    <input type="text" id="silveriom_loader_video" name="silveriom_loader_video" value="<?php echo esc_attr($video); ?>" style="flex-grow: 1; background: #030712; border: 1px solid rgba(255,255,255,0.15); color: #ffffff; border-radius: 10px; padding: 12px 16px; font-size: 0.95rem; direction: ltr; text-align: left;">
                    <button type="button" class="button button-secondary silveriom-media-upload-btn" data-target="#silveriom_loader_video" style="background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; padding: 0 18px; height: auto;">
                        انتخاب از رسانه
                    </button>
                </div>
            </div>

            <!-- Field 6: Accent Color -->
            <div style="margin-bottom: 30px; display: flex; align-items: center; gap: 20px;">
                <div>
                    <label for="silveriom_loader_color" style="color: #ffffff; font-size: 1rem; font-weight: 700; display: block; margin-bottom: 8px;">
                        رنگ نئون لودر
                    </label>
                    <input type="color" id="silveriom_loader_color" name="silveriom_loader_color" value="<?php echo esc_attr($color); ?>" style="width: 60px; height: 42px; border: none; border-radius: 8px; cursor: pointer; background: transparent;">
                </div>
                <div>
                    <label for="silveriom_loader_speed" style="color: #ffffff; font-size: 1rem; font-weight: 700; display: block; margin-bottom: 8px;">
                        حداکثر زمان نمایش لودر (میلی‌ثانیه)
                    </label>
                    <input type="number" id="silveriom_loader_speed" name="silveriom_loader_speed" value="<?php echo esc_attr($speed); ?>" min="300" max="3000" step="100" style="width: 140px; background: #030712; border: 1px solid rgba(255,255,255,0.15); color: #ffffff; border-radius: 10px; padding: 10px 14px; font-size: 0.95rem;">
                </div>
            </div>

            <!-- Submit Button -->
            <div style="padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08);">
                <button type="submit" class="button button-primary" style="background: #CCFF00; color: #020612; border: none; border-radius: 12px; font-size: 1rem; font-weight: 800; padding: 12px 35px; cursor: pointer; box-shadow: 0 4px 20px rgba(204, 255, 0, 0.3);">
                    ذخیره تغییرات
                </button>
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
                    title: 'انتخاب رسانه برای لودر سیلوریوم',
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
