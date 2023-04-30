import keys from './keys.js';

const body = document.querySelector('body');

let lang = localStorage.getItem('lang') || 'ru';
const pressedKeys = new Set();
let inputMode = changeInputMode();

function createDiv() {
  const newDiv = document.createElement('div');
  return newDiv;
}

function isArrowButtonsCode(code) {
  return code === 'ArrowLeft'
  || code === 'ArrowUp'
  || code === 'ArrowDown'
  || code === 'ArrowRight';
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
    || isArrowButtonsCode(code)
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

function changeText(prevText, startIdx, endIdx, inputText) {
  return prevText.slice(0, startIdx) + inputText + prevText.slice(endIdx);
}

const keysArr = Object.keys(keys);

function updateKeyboard() {
  keysArr.forEach((key) => {
    const element = document.querySelector(`[data-code=${key}]`);
    element.innerText = keys[key][inputMode];
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
const info = createDiv();
const aboutLanguage = document.createElement('p');
const aboutSystem = document.createElement('p');

aboutLanguage.classList.add('info__text');
aboutSystem.classList.add('info__text');
aboutLanguage.innerText = 'Для смены языка используйте ctrl + command(meta)';
aboutSystem.innerText = 'Клавиатура сделана в системе macOS';

textArea.classList.add('text-area');
container.classList.add('container');
keyBoardBody.classList.add('keyboard');
info.classList.add('info');
info.append(aboutLanguage, aboutSystem);
createKeboard(keyBoardBody);

container.append(textArea, keyBoardBody, info);

body.append(container);

function changeInputMode() {
  return pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight') || pressedKeys.has('CapsLock') ? `shifted${lang.slice(0, 1).toUpperCase()}${lang.slice(1)}` : lang;
}

document.addEventListener('keydown', (e) => {
  const { code } = e;
  if (!isText(code)) {
    e.preventDefault();
    textArea.focus();
    const selectorType = changeInputMode();
    const prevCursorPlaceStart = Math.min(textArea.selectionStart, textArea.selectionEnd);
    const prevCursorPlaceEnd = Math.max(textArea.selectionStart, textArea.selectionEnd);
    let newText = keys[code][selectorType];
    if (code === 'Tab') newText = '\u0009';
    if (code === 'Space') newText = ' ';
    if (code === 'Enter') newText = '\n';
    console.log(newText)
    textArea.value = changeText(
      textArea.value,
      textArea.selectionStart,
      textArea.selectionEnd,
      newText,
    );
    const isHighlight = prevCursorPlaceEnd - prevCursorPlaceStart > 0;
    textArea.selectionStart = isHighlight ? prevCursorPlaceStart + newText.length : prevCursorPlaceEnd + newText.length;
    textArea.selectionEnd = textArea.selectionStart;
  }
  const currentEl = document.querySelector(`[data-code=${code}]`);
  currentEl.classList.add('keyboard__key_mode_active');
  pressedKeys.add(code);
  if (isArrowButtonsCode(code)) return;
  if (code === 'ShiftLeft' || code === 'ShiftRight' || code === 'CapsLock') {
    inputMode = changeInputMode();
    updateKeyboard();
  }
  if (pressedKeys.has('ControlLeft') && pressedKeys.has('MetaLeft')) {
    lang = lang === 'ru' ? 'en' : 'ru';
    localStorage.setItem('lang', lang);
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
    textArea.innerText += keys[code][lang];
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
