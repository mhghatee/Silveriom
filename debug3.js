document.addEventListener("DOMContentLoaded", function() {
  const wrapper = document.querySelector('.ios-overflow-fix-wrapper');
  const hero = document.querySelector('.hero-content-wrapper');
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.top = '200px';
  div.style.left = '10px';
  div.style.zIndex = '99999999';
  div.style.background = 'green';
  div.style.color = 'white';
  div.style.padding = '10px';
  div.style.fontSize = '20px';
  div.innerHTML = `Wrapper Top: ${wrapper.getBoundingClientRect().top}<br>Hero MT: ${window.getComputedStyle(hero).marginTop}<br>Wrapper MT: ${window.getComputedStyle(wrapper).marginTop}`;
  document.body.appendChild(div);
});
