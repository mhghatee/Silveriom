const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const html = fs.readFileSync('panel/admin.html', 'utf-8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
dom.window.addEventListener('error', e => console.log('ERROR:', e.message));
setTimeout(() => {
    console.log("Lucide defined?", !!dom.window.lucide);
}, 2000);
