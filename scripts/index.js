import keys from './keys.js';

const body = document.querySelector('body');

let lang = 'ru';
const pressedKeys = new Set();
let inputMode = changeInputMode();

function createDiv() {
  const newDiv = document.createElement('div');
  return newDiv;
}

function isText(code) {
  return (
    code === 'Backspace'
    || code === 'MetaLeft'
    || code === 'MetaRight'
    || code === 'CapsLock'
    || code === 'ControlLeft'
    || code === 'AltLeft'
    || code === 'ShiftLeft'
    || code === 'AltRight'
    || code === 'ShiftRight'
  );
}

function createKeyEl(value) {
  const newKey = createDiv();
  newKey.classList.add('keyboard__key');
  newKey.dataset.code = value;
  newKey.innerText = keys[value][lang];
  if (value === 'Backspace' || value === 'Tab' || value === 'MetaLeft' || value === 'MetaRight') {
    newKey.classList.add('key-l');
  } else if (value === 'CapsLock' || value === 'Enter') {
    newKey.classList.add('key-xl');
  } else if (value === 'ShiftLeft' || value === 'ShiftRight') {
    newKey.classList.add('key-xxl');
  } else if (value === 'Space') {
    newKey.classList.add('key-space');
  }
  return newKey;
}

const keysArr = Object.keys(keys);

function updateKeyboard() {
  keysArr.forEach((key) => {
    const element = document.querySelector(`[data-code=${key}]`);
    element.innerHTML = keys[key][inputMode];
  });
}

function createKeboard(element) {
  keysArr.forEach((el, idx) => {
    const key = createKeyEl(el);
    if (el === 'ArrowUp') {
      const nextKey = createKeyEl(keysArr[idx + 1]);
      const splittedEl = createDiv();
      splittedEl.classList.add('splitted-key');
      splittedEl.append(key);
      splittedEl.append(nextKey);
      element.append(splittedEl);
    } else if (el !== 'ArrowDown') {
      element.append(key);
    }
  });
}

const container = createDiv();
const textArea = document.createElement('textarea');
const keyBoardBody = createDiv();

textArea.classList.add('text-area');
container.classList.add('container');
keyBoardBody.classList.add('keyboard');
createKeboard(keyBoardBody);

container.append(textArea, keyBoardBody);

body.append(container);

function changeInputMode() {
  return pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight') || pressedKeys.has('CapsLock') ? `shifted${lang.slice(0, 1).toUpperCase()}${lang.slice(1)}` : lang;
}

document.addEventListener('keydown', (e) => {
  const { code } = e;
  if (!isText(code)) {
    e.preventDefault();
    const selectorType = changeInputMode();
    textArea.innerHTML += keys[code][selectorType];
  }
  const currentEl = document.querySelector(`[data-code=${code}]`);
  currentEl.classList.add('keyboard__key_mode_active');
  pressedKeys.add(code);
  if (code === 'ShiftLeft' || code === 'ShiftRight' || code === 'CapsLock') {
    inputMode = changeInputMode();
    updateKeyboard();
  }
  if (pressedKeys.has('ControlLeft') && pressedKeys.has('MetaLeft')) {
    lang = lang === 'ru' ? 'en' : 'ru';
    inputMode = changeInputMode();
    updateKeyboard();
  }
});

document.addEventListener('keyup', (e) => {
  const { code } = e;
  if (!isText(code)) {
    e.preventDefault();
  }
  const currentEl = document.querySelector(`[data-code=${code}]`);
  currentEl.classList.remove('keyboard__key_mode_active');
  pressedKeys.delete(code);
  if (code === 'ShiftLeft' || code === 'ShiftRight' || code === 'CapsLock') {
    inputMode = changeInputMode();
    updateKeyboard();
  }
});

keyBoardBody.addEventListener('mousedown', (e) => {
  const { code } = e.target.dataset;
  if (!code) return;
  if (!isText(code)) {
    e.preventDefault();
    textArea.innerHTML += keys[code][lang];
  }
  const currentEl = document.querySelector(`[data-code=${code}]`);
  pressedKeys.add(code);
  currentEl.classList.add('keyboard__key_mode_active');
});

keyBoardBody.addEventListener('mouseup', (e) => {
  const { code } = e.target.dataset;
  if (!code) return;
  e.target.classList.remove('keyboard__key_mode_active');
  pressedKeys.delete(code);
});
