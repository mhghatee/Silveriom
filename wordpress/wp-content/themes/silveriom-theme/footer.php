<?php
/**
 * Silveriom Theme Footer
 */
?>
</main><!-- #primary -->

<?php 
$is_elementor = is_singular() && get_post_meta(get_the_ID(), '_elementor_edit_mode', true) === 'builder';
if (!$is_elementor && (!function_exists('elementor_theme_do_location') || !elementor_theme_do_location('footer'))) : 
?>
<footer class="silveriom-footer" style="background:#020612; border-top:1px solid rgba(255,255,255,0.06); padding:60px 20px 40px; margin-top:80px;">
  <div style="max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:40px; text-align:right;">
    <div>
      <h3 style="color:#ffffff; font-size:1.4rem; font-weight:800; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
        SILVERIOM <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#CCFF00;"></span>
      </h3>
      <p style="color:#8E9BAE; font-size:0.95rem; line-height:1.9;">
        پلتفرم انحصاری تبلیغات و مدیا اسپانسری در برترین مجتمع‌ها، مسابقات و رسانه‌های تنیس و پدل ایران.
      </p>
    </div>
    <div>
      <h4 style="color:#ffffff; font-size:1.1rem; margin-bottom:16px;">دسترسی سریع</h4>
      <ul style="list-style:none; padding:0; margin:0; line-height:2.2;">
        <li><a href="<?php echo esc_url(home_url('/tournament-calendar/')); ?>" style="color:#8E9BAE; text-decoration:none;">تقویم تورنمنت‌ها</a></li>
        <li><a href="<?php echo esc_url(home_url('/media-planner/')); ?>" style="color:#8E9BAE; text-decoration:none;">پلنر رسانه‌ای</a></li>
        <li><a href="<?php echo esc_url(home_url('/audience-intelligence/')); ?>" style="color:#8E9BAE; text-decoration:none;">هوش مخاطبان</a></li>
        <li><a href="<?php echo esc_url(home_url('/portfolio/')); ?>" style="color:#8E9BAE; text-decoration:none;">نمونه‌کارها</a></li>
      </ul>
    </div>
    <div>
      <h4 style="color:#ffffff; font-size:1.1rem; margin-bottom:16px;">ارتباط با ما</h4>
      <p style="color:#8E9BAE; font-size:0.95rem; line-height:1.8;">
        دفتر مرکزی: تهران، زعفرانیه<br>
        تلفن: ۰۲۱-۲۲۰۰۰۰۰۰<br>
        ایمیل: info@silveriom.ir
      </p>
    </div>
  </div>
  <div style="max-width:1200px; margin:40px auto 0; padding-top:20px; border-top:1px solid rgba(255,255,255,0.04); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; color:#5A6678; font-size:0.85rem;">
    <div>تمامی حقوق برای برند سیلوریوم (Silveriom) محفوظ است.</div>
    <div>طراحی و توسعه اختصاصی بر پایه وردپرس و المنتور</div>
  </div>
</footer>
<?php endif; ?>

<?php wp_footer(); ?>
</body>
</html>
