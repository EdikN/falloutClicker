// === ПОДСВЕТКА UI (онбординг) ===
// Прожектор-оверлей: затемняет экран, вырезает «окно» вокруг целевого элемента
// и показывает подпись с кнопкой. Клики сквозь оверлей проходят к игре
// (pointer-events:none), кликабельна только сама подсказка — это не блокирует геймплей.
import { translate } from '../locales.js';

export const Highlights = (() => {
  let root = null;

  const ensureRoot = () => {
    if (root) return root;
    root = document.createElement('div');
    root.id = 'obOverlay';
    root.innerHTML = `
      <div id="obHole"></div>
      <div id="obCaption">
        <div id="obText"></div>
        <button class="btn good" id="obNext"></button>
      </div>`;
    document.body.appendChild(root);
    return root;
  };

  let onResize = null;

  // target — CSS-селектор или элемент; text — строка; buttonText — подпись кнопки;
  // onNext — колбэк при нажатии кнопки; showButton — показывать ли кнопку.
  const show = ({ target, text, buttonText, onNext, showButton = true }) => {
    ensureRoot();
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    const hole = root.querySelector('#obHole');
    const caption = root.querySelector('#obCaption');
    const textEl = root.querySelector('#obText');
    const nextBtn = root.querySelector('#obNext');

    const place = () => {
      if (el) {
        const r = el.getBoundingClientRect();
        const pad = 8;
        hole.style.display = 'block';
        hole.style.left = `${r.left - pad}px`;
        hole.style.top = `${r.top - pad}px`;
        hole.style.width = `${r.width + pad * 2}px`;
        hole.style.height = `${r.height + pad * 2}px`;
        // Подпись под целью, либо над ней, если внизу экрана
        const below = r.bottom + 12;
        const fitsBelow = below + 120 < window.innerHeight;
        caption.style.left = '50%';
        caption.style.transform = 'translateX(-50%)';
        caption.style.top = fitsBelow ? `${below}px` : '';
        caption.style.bottom = fitsBelow ? '' : `${window.innerHeight - r.top + 12}px`;
      } else {
        hole.style.display = 'none';
        caption.style.left = '50%';
        caption.style.top = '50%';
        caption.style.transform = 'translate(-50%, -50%)';
      }
    };

    textEl.innerHTML = text;
    nextBtn.style.display = showButton ? 'block' : 'none';
    nextBtn.textContent = buttonText || translate('btn_continue');
    nextBtn.onclick = () => { if (onNext) onNext(); };

    root.classList.add('show');
    place();
    if (onResize) window.removeEventListener('resize', onResize);
    onResize = place;
    window.addEventListener('resize', onResize);
  };

  const hide = () => {
    if (root) root.classList.remove('show');
    if (onResize) { window.removeEventListener('resize', onResize); onResize = null; }
  };

  return { show, hide };
})();
