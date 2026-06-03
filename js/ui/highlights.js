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

    const margin = 12;
    const place = () => {
      caption.style.bottom = '';
      caption.style.left = '50%';
      if (el) {
        const r = el.getBoundingClientRect();
        const pad = 8;
        hole.style.display = 'block';
        hole.style.left = `${r.left - pad}px`;
        hole.style.top = `${r.top - pad}px`;
        hole.style.width = `${r.width + pad * 2}px`;
        hole.style.height = `${r.height + pad * 2}px`;

        // Реальная высота подсказки (после установки текста/кнопки)
        const capH = caption.getBoundingClientRect().height;
        // Цель в верхней половине → подсказка снизу, иначе сверху
        const targetCenter = r.top + r.height / 2;
        let top = targetCenter < window.innerHeight * 0.55
          ? r.bottom + margin
          : r.top - margin - capH;
        // Зажимаем подсказку (вместе с кнопкой) внутри окна
        const maxTop = window.innerHeight - capH - margin;
        top = maxTop < margin ? margin : Math.min(Math.max(margin, top), maxTop);

        caption.style.transform = 'translateX(-50%)';
        caption.style.top = `${top}px`;
      } else {
        hole.style.display = 'none';
        caption.style.top = '50%';
        caption.style.transform = 'translate(-50%, -50%)';
      }
    };

    textEl.innerHTML = text;
    nextBtn.style.display = showButton ? 'block' : 'none';
    nextBtn.textContent = buttonText || translate('btn_continue');
    nextBtn.onclick = () => { if (onNext) onNext(); };

    root.classList.add('show');
    // rAF — чтобы layout успел посчитать реальную высоту подсказки до позиционирования
    requestAnimationFrame(place);
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
