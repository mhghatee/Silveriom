/* ==========================================================================
   کارت ویزیت دیجیتال — تعاملات و انیمیشن‌ها
   اصول حرکت: ease-out برای ورود، بدون bounce، lerp برای نرمی حرکت
   ========================================================================== */

"use strict";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isFinePointer = window.matchMedia("(pointer: fine)").matches;

/* --------------------------------------------------------------------------
   ۱) ورود پلکانی عناصر
-------------------------------------------------------------------------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (prefersReducedMotion) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }
  // کمی بعد از لود تا فونت و چیدمان آماده شوند
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      items.forEach((el) => el.classList.add("is-in"));
    });
  });
}

/* --------------------------------------------------------------------------
   ۲) چرخش سه‌بعدی کارت + براقیت (Tilt & Glare) با lerp
-------------------------------------------------------------------------- */
function initTilt() {
  if (!isFinePointer || prefersReducedMotion) return;

  const scene = document.getElementById("tilt-scene");
  const card = document.getElementById("card");
  const glare = document.getElementById("glare");
  if (!scene || !card || !glare) return;

  const MAX_TILT = 9; // درجه
  let targetX = 0, targetY = 0;   // مقادیر هدف
  let currentX = 0, currentY = 0; // مقادیر جاری (lerp)
  let glareX = 50, glareY = 50;
  let rafId = null;
  let hovering = false;

  function onMove(e) {
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;   // 0..1
    const py = (e.clientY - rect.top) / rect.height;   // 0..1
    // در RTL محور X آینه می‌شود تا حس طبیعی بدهد
    targetY = (px - 0.5) * 2 * MAX_TILT;               // چرخش حول محور Y
    targetX = -(py - 0.5) * 2 * MAX_TILT;              // چرخش حول محور X
    glareX = px * 100;
    glareY = py * 100;
    if (!hovering) {
      hovering = true;
      glare.style.opacity = "1";
      tick();
    }
  }

  function onLeave() {
    hovering = false;
    targetX = 0;
    targetY = 0;
    glare.style.opacity = "0";
    tick();
  }

  function tick() {
    // lerp — حرکت نرم و فیزیکی
    currentX += (targetX - currentX) * 0.09;
    currentY += (targetY - currentY) * 0.09;

    card.style.transform =
      `rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`;

    glare.style.background =
      `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(45,212,191,0.14), transparent 55%)`;

    const settled =
      Math.abs(targetX - currentX) < 0.01 && Math.abs(targetY - currentY) < 0.01;

    if (!settled || hovering) {
      rafId = requestAnimationFrame(tick);
    } else {
      card.style.transform = "";
      rafId = null;
    }
  }

  scene.addEventListener("pointermove", onMove);
  scene.addEventListener("pointerleave", onLeave);
}

/* --------------------------------------------------------------------------
   ۳) دکمه‌های مغناطیسی (Magnetic)
-------------------------------------------------------------------------- */
function initMagnetic() {
  if (!isFinePointer || prefersReducedMotion) return;

  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const STRENGTH = 0.28;
    let raf = null;
    let tx = 0, ty = 0, cx = 0, cy = 0;

    function animate() {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      el.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        raf = requestAnimationFrame(animate);
      } else {
        if (tx === 0 && ty === 0) el.style.transform = "";
        raf = null;
      }
    }

    el.addEventListener("pointermove", (e) => {
      const rect = el.getBoundingClientRect();
      tx = (e.clientX - (rect.left + rect.width / 2)) * STRENGTH;
      ty = (e.clientY - (rect.top + rect.height / 2)) * STRENGTH;
      if (!raf) raf = requestAnimationFrame(animate);
    });

    el.addEventListener("pointerleave", () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(animate);
    });
  });
}

/* --------------------------------------------------------------------------
   ۴) نور دنبال‌کننده موس روی ردیف‌ها (Spotlight)
-------------------------------------------------------------------------- */
function initSpotlight() {
  if (!isFinePointer) return;
  document.querySelectorAll(".spotlight").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   ۵) اعلان (Toast) — ورود ease-out، خروج محو
-------------------------------------------------------------------------- */
function showToast(message, isError = false) {
  const root = document.getElementById("toast-root");
  if (!root) return;

  const toast = document.createElement("div");
  toast.className =
    "pointer-events-auto flex items-center gap-2.5 rounded-2xl bg-ink-700/95 px-5 py-3 text-sm font-semibold text-cream shadow-card backdrop-blur-md";
  toast.style.cssText =
    "opacity:0; transform:translateY(16px) scale(0.92); transition: opacity .45s cubic-bezier(0.16,1,0.3,1), transform .45s cubic-bezier(0.16,1,0.3,1);";

  const icon = isError
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F87171" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

  toast.innerHTML = `${icon}<span>${message}</span>`;
  root.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0) scale(1)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px) scale(0.95)";
    setTimeout(() => toast.remove(), 480);
  }, 2400);
}

/* --------------------------------------------------------------------------
   ۶) کپی در کلیپ‌بورد
-------------------------------------------------------------------------- */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback برای مرورگرهای قدیمی
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}

function initCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const ok = await copyText(btn.dataset.copy);
      showToast(
        ok ? `${btn.dataset.label} کپی شد` : "کپی نشد. دوباره امتحان کنید",
        !ok
      );
    });
  });
}

/* --------------------------------------------------------------------------
   ۷) ذخیره مخاطب (vCard)
-------------------------------------------------------------------------- */
function initSaveContact() {
  const btn = document.getElementById("save-contact");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:خسروجردی;حسن;;;",
      "FN:حسن خسروجردی",
      "TITLE:طراح و توسعه‌دهنده رابط کاربری",
      "TEL;TYPE=CELL:+989123456789",
      "EMAIL:hello@hassan.dev",
      "URL:https://hassan.dev",
      "ADR:;;تهران;;;ایران",
      "END:VCARD",
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hassan-khosrojerdi.vcf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("مخاطب ذخیره شد");
  });
}

/* --------------------------------------------------------------------------
   ۸) اشتراک‌گذاری (Web Share API + جایگزین کپی)
-------------------------------------------------------------------------- */
function initShare() {
  const btn = document.getElementById("share-card");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const shareData = {
      title: "کارت ویزیت حسن خسروجردی",
      text: "کارت ویزیت دیجیتال حسن خسروجردی، طراح و توسعه‌دهنده رابط کاربری",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* لغو توسط کاربر — بی‌صدا رد شو */
      }
    } else {
      const ok = await copyText(window.location.href);
      showToast(ok ? "لینک کارت کپی شد" : "امکان اشتراک‌گذاری نیست", !ok);
    }
  });
}

/* --------------------------------------------------------------------------
   ۹) نوار متحرک مهارت‌ها
-------------------------------------------------------------------------- */
function initSkillsMarquee() {
  const track = document.getElementById("skills-track");
  if (!track) return;

  const skills = [
    "رابط کاربری", "تجربه کاربری", "سیستم طراحی", "طراحی حرکت",
    "HTML / CSS", "جاوااسکریپت", "Tailwind", "فیگما", "طراحی واکنش‌گرا", "دسترسی‌پذیری",
  ];

  const chip = (label) =>
    `<span class="whitespace-nowrap rounded-full bg-ink-700/70 px-4 py-1.5 text-xs font-medium text-cream-dim">${label}</span>`;

  // دو نسخه برای لوپ بی‌درز (در RTL با translateX مثبت)
  track.innerHTML = skills.map(chip).join("") + skills.map(chip).join("");
}

/* --------------------------------------------------------------------------
   ۹) تم روشن / تیره — با ذخیره در localStorage
-------------------------------------------------------------------------- */
function initTheme() {
  const btn = document.getElementById("theme-toggle");
  const iconSun = document.getElementById("icon-sun");
  const iconMoon = document.getElementById("icon-moon");
  const metaTheme = document.getElementById("meta-theme");
  if (!btn) return;

  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    const isLight = theme === "light";
    iconSun?.classList.toggle("hidden", isLight);
    iconMoon?.classList.toggle("hidden", !isLight);
    if (metaTheme) metaTheme.content = isLight ? "#ECF2F6" : "#060A0E";
  }

  // وضعیت اولیه (اسکریپت <head> تم ذخیره‌شده را گذاشته است)
  apply(document.documentElement.dataset.theme === "light" ? "light" : "dark");

  btn.addEventListener("click", () => {
    const next =
      document.documentElement.dataset.theme === "light" ? "dark" : "light";
    apply(next);
    try { localStorage.setItem("card-theme", next); } catch (e) {}
    showToast(next === "light" ? "حالت روشن فعال شد" : "حالت تیره فعال شد");
  });
}

/* --------------------------------------------------------------------------
   ۱۰) چرخش کارت — روی کارت ⇄ پشت کارت (QR)
-------------------------------------------------------------------------- */
function initFlip() {
  const inner = document.getElementById("flip-inner");
  const toBack = document.getElementById("flip-to-back");
  const toFront = document.getElementById("flip-to-front");
  const backFace = document.querySelector(".card-face--back");
  if (!inner || !toBack || !toFront) return;

  function flip(showBack) {
    inner.classList.toggle("is-flipped", showBack);
    backFace?.setAttribute("aria-hidden", String(!showBack));
    if (showBack) renderQR();
  }

  toBack.addEventListener("click", () => flip(true));
  toFront.addEventListener("click", () => flip(false));
}

/* --------------------------------------------------------------------------
   ۱۱) ساخت کد QR — کاملاً محلی، بدون CDN
-------------------------------------------------------------------------- */
let qrRendered = false;
function renderQR() {
  if (qrRendered) return; // یک بار کافی است
  const canvas = document.getElementById("qr-canvas");
  if (!canvas || typeof qrcode === "undefined") return;

  const url = window.location.href;
  const urlLabel = document.getElementById("qr-url");
  if (urlLabel) urlLabel.textContent = url.replace(/^https?:\/\//, "");

  const qr = qrcode(0, "M"); // تشخیص خودکار اندازه
  qr.addData(url);
  qr.make();

  const modules = qr.getModuleCount();
  const quiet = 4; // حاشیه امن استاندارد
  const total = modules + quiet * 2;
  const size = canvas.width;
  const cell = size / total;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#EEF4F7"; // زمینه روشن سرد برای اسکن مطمئن (در هر دو تم)
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#0A1520";

  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (qr.isDark(row, col)) {
        ctx.fillRect(
          Math.floor((col + quiet) * cell),
          Math.floor((row + quiet) * cell),
          Math.ceil(cell),
          Math.ceil(cell)
        );
      }
    }
  }
  qrRendered = true;
}

/* --------------------------------------------------------------------------
   راه‌اندازی
-------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initSkillsMarquee();
  initReveal();
  initTheme();
  initFlip();
  initTilt();
  initMagnetic();
  initSpotlight();
  initCopyButtons();
  initSaveContact();
  initShare();
});
