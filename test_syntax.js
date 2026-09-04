const fs = require('fs');
try {
  const code = fs.readFileSync('panel/admin.js', 'utf8');
  new Function(code);
  console.log("Syntax is OK!");
} catch (e) {
  console.log("Syntax Error:", e);
}
