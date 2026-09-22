<?php
$subdomainDbFile = '/home/h417440/panel.silveriom.ir/data/silveriom_db.json';
$mainDbFile = '/home/h417440/public_html/data/silveriom_db.json';

if (file_exists($subdomainDbFile)) {
    // Read the safe live DB
    $json = file_get_contents($subdomainDbFile);
    $data = json_decode($json, true);
    
    // Add default blogs if missing
    if (!isset($data['blogs']) || empty($data['blogs'])) {
        $data['blogs'] = [
            [
                "id" => "blog_1",
                "title" => "انقلاب نئونی: تبلیغات محیطی در کورت‌های پدل",
                "category" => "تحلیل کمپین",
                "date" => "۱۵ شهریور ۱۴۰۵",
                "image" => "assets/blog_1.jpg",
                "summary" => "بررسی تاثیر نورپردازی نئونی و طراحی‌های سایبرپانک در تبلیغات دور کورت‌های پدل بر افزایش نرخ تعامل مخاطبان VIP.",
                "content" => "<h2 style=\"font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 24px; margin-top: 0; line-height: 1.5;\">انقلاب نئونی: تبلیغات محیطی در کورت‌های پدل</h2>\n<p>تبلیغات در فضای باز کورت‌های پدل وارد فاز جدیدی شده است. با استفاده از نورپردازی‌های نئونی سبز و آبی که به صورت هوشمند و هماهنگ با دیواره‌های شیشه‌ای کار می‌شوند، برندها اکنون فضایی به شدت لوکس و آینده‌نگرانه خلق می‌کنند.<br><br>در تاریکی شب، این پنل‌های نئونی نه تنها روشنایی مضاعفی برای بازیکنان فراهم می‌کنند، بلکه ناخودآگاه توجه تماشاگران و حتی عابران را به خود جلب می‌کنند. این ترکیب از ورزش و هنر دیجیتال، نرخ یادآوری برند را به طور چشمگیری افزایش داده است.</p>"
            ],
            [
                "id" => "blog_2",
                "title" => "وی‌آی‌پی لانژها: نقطه اتصال برندهای لوکس",
                "category" => "اخبار کلاب‌ها",
                "date" => "۱۰ شهریور ۱۴۰۵",
                "image" => "assets/blog_2.jpg",
                "summary" => "چگونه کلاب‌های ورزشی با طراحی لانژهای اختصاصی، بستر مناسبی برای پروموشن برندهای لاکچری فراهم می‌کنند؟",
                "content" => "<h2>وی‌آی‌پی لانژها</h2><p>متن نمونه برای مقاله دوم...</p>"
            ],
            [
                "id" => "blog_3",
                "title" => "استندهای LED سه بعدی؛ تحول تبلیغات دیجیتال",
                "category" => "تکنولوژی تبلیغات",
                "date" => "۵ شهریور ۱۴۰۵",
                "image"=> "assets/blog_3.jpg",
                "summary"=> "معرفی نسل جدید استندهای تبلیغاتی سه‌بعدی تعاملی که به تازگی در مجموعه‌های برتر نصب شده‌اند.",
                "content"=> "<h2>استندهای LED سه بعدی</h2><p>متن نمونه برای مقاله سوم...</p>"
            ],
            [
                "id" => "blog_4",
                "title"=> "تجربه کاربری بی‌نظیر: اپلیکیشن‌های رزرو",
                "category" => "محصولات دیجیتال",
                "date" => "۱ شهریور ۱۴۰۵",
                "image"=> "assets/blog_4.jpg",
                "summary"=> "نحوه ادغام تبلیغات بنری و ویدیویی درون اپلیکیشن‌های رزرو کورت پدل بدون آسیب به تجربه کاربری.",
                "content"=> "<h2>تجربه کاربری</h2><p>متن نمونه برای مقاله چهارم...</p>"
            ],
            [
                "id" => "blog_5",
                "title"=> "تحلیل بازار تجهیزات پریمیوم پدل",
                "category" => "آموزش پدل",
                "date" => "۲۸ مرداد ۱۴۰۵",
                "image"=> "assets/blog_5.jpg",
                "summary"=> "نگاهی نزدیک به تکنولوژی فیبر کربن و طراحی‌های آیرودینامیک در نسل جدید راکت‌های حرفه‌ای پدل.",
                "content"=> "<h2>تحلیل بازار</h2><p>متن نمونه برای مقاله پنجم...</p>"
            ]
        ];
    }
    
    // Save back to both locations
    $finalJson = json_encode($data, JSON_UNESCAPED_UNICODE);
    file_put_contents($mainDbFile, $finalJson);
    file_put_contents($subdomainDbFile, $finalJson);
    
    echo "SUCCESS_RESTORED_AND_UPDATED";
} else {
    echo "ERROR_SUBDOMAIN_DB_NOT_FOUND";
}
