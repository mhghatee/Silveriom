# کارت ویزیت دیجیتال

صفحهٔ ایستا (HTML / CSS / JS) برای نمایش کارت ویزیت دیجیتال با تم روشن/تیره، انیمیشن و QR کد.

## اجرا (بدون نصب)

پروژه آمادهٔ استفاده است و به `node_modules` نیاز ندارد.

فایل `index.html` را در مرورگر باز کنید (دبل‌کلیک یا Drag & Drop روی پنجرهٔ مرورگر).

## ساختار

```
project5/
├── index.html              # صفحه اصلی
├── assets/
│   ├── css/
│   │   ├── main.css        # خروجی نهایی Tailwind (برای اجرا)
│   │   └── tailwind.css    # ورودی سفارشی Tailwind
│   ├── fonts/              # فونت Vazirmatn FD
│   └── js/
│       ├── main.js         # منطق کارت، تم، QR
│       └── vendor/qrcode.js
├── package.json            # فقط برای بازسازی CSS با Tailwind
├── package-lock.json
├── tailwind.config.js
└── README.md
```

## ویرایش محتوا

بیشتر متن‌ها، لینک‌ها و اطلاعات تماس داخل `index.html` هستند. رفتار تعاملی (تم، فلیپ کارت، QR و …) در `assets/js/main.js` است.

## بازسازی CSS (اختیاری)

فقط وقتی کلاس Tailwind جدید اضافه می‌کنید یا `tailwind.css` / `tailwind.config.js` را عوض می‌کنید:

```bash
npm install
npm run build    # یک‌بار ساخت
npm run watch    # ساخت خودکار هنگام تغییر
```

بعد از ساخت، در صورت تمایل می‌توانید دوباره پوشهٔ `node_modules` را حذف کنید؛ برای نمایش سایت لازم نیست.

## انتشار

کل پوشه را روی هر هاست استاتیک (GitHub Pages، Netlify، Vercel، هاست معمولی) آپلود کنید. نقطهٔ ورود: `index.html`.
