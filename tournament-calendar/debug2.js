document.addEventListener("DOMContentLoaded", function() {
  const ln = document.querySelector('.luxury-nav');
  const parent = ln.offsetParent;
  const parentTag = parent ? parent.tagName : 'null';
  const parentClass = parent ? parent.className : '';
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.top = '150px';
  div.style.left = '10px';
  div.style.zIndex = '99999999';
  div.style.background = 'blue';
  div.style.color = 'white';
  div.style.padding = '10px';
  div.style.fontSize = '20px';
  div.innerHTML = `LN Offset Parent: ${parentTag} (${parentClass})<br>Computed Top: ${window.getComputedStyle(ln).top}<br>Computed MT: ${window.getComputedStyle(ln).marginTop}`;
  document.body.appendChild(div);
});
