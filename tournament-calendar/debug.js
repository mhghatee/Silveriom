document.addEventListener("DOMContentLoaded", function() {
  const tcb = document.querySelector('.top-complex-bar').getBoundingClientRect();
  const ln = document.querySelector('.luxury-nav').getBoundingClientRect();
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.top = '100px';
  div.style.left = '10px';
  div.style.zIndex = '99999999';
  div.style.background = 'red';
  div.style.color = 'white';
  div.style.padding = '10px';
  div.style.fontSize = '20px';
  div.innerHTML = `TCB Bottom: ${tcb.bottom}px<br>LN Top: ${ln.top}px<br>Gap: ${ln.top - tcb.bottom}px<br>TCB Height: ${tcb.height}px`;
  document.body.appendChild(div);
});
