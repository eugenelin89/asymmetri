/* This UI exists only on the loopback comparison server. Nothing is persisted. */
const ports = { cobalt: 4311, teal: 4312, signal: 4313, baseline: 4314 };
const page = document.querySelector('#page');
const size = document.querySelector('#size');
function updateCaptures() {
  const route = size.value === 'mobile' ? 'home' : page.value;
  page.disabled = size.value === 'mobile';
  document.querySelectorAll('.capture, .live').forEach((link) => {
    const theme = link.dataset.theme;
    link.href = `http://127.0.0.1:${ports[theme]}${route === 'home' ? '/' : `/${route}`}`;
    const image = link.querySelector('img');
    if (image) {
      image.src = `/captures/${theme}-${route}-${size.value}.jpg`;
      image.alt = `${theme} theme ${route}, ${size.value} capture`;
      image.removeAttribute('height');
      link.classList.toggle('mobile', size.value === 'mobile');
    }
  });
}
page.addEventListener('change', updateCaptures);
size.addEventListener('change', updateCaptures);
const theme = document.querySelector('#live-theme');
const route = document.querySelector('#live-route');
function updateLive() {
  const url = `http://127.0.0.1:${ports[theme.value]}${route.value}`;
  const frame = document.querySelector('#preview');
  frame.src = url;
  frame.title = `Live ${theme.value} theme preview`;
  document.querySelector('#open-live').href = url;
}
theme.addEventListener('change', updateLive);
route.addEventListener('change', updateLive);
