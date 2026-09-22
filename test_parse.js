function parseTariffToMillions(text) {
    if (!text || text.includes('تماس')) return null;
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
    let englishText = text;
    for(let i=0; i<10; i++) {
        englishText = englishText.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
    }
    const match = englishText.match(/[\d\.]+/);
    if (!match) return null;
    let val = parseFloat(match[0]);
    if (englishText.includes('میلیارد')) val *= 1000;
    return val;
}
console.log("Tariff 1:", parseTariffToMillions("۳۰۰ میلیون تومان "));
console.log("Tariff 2:", parseTariffToMillions("۴۵ میلیون تومان"));
console.log("Tariff 3:", parseTariffToMillions("۱۵۰ میلیون تومان"));
