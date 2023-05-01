import keys from './keys.js';

const body = document.querySelector('body');

let lang = localStorage.getItem('lang') || 'ru';
const pressedKeys = new Set();

function changeInputMode(language, pressed) {
  let mode = '';
  const postfixLang = `${language.slice(0, 1).toUpperCase()}${language.slice(1)}`;
  if ((pressed.has('CapsLock') && pressed.has('ShiftLeft'))
   || (pressed.has('CapsLock') && pressed.has('ShiftRight'))) {
    mode = `capsAndShift${postfixLang}`;
  } else if (pressed.has('ShiftLeft') || pressed.has('ShiftRight')) {
    mode = `shifted${postfixLang}`;
  } else if (pressed.has('CapsLock')) {
    mode = `caps${postfixLang}`;
  } else {
    mode = language;
  }
  return mode;
}

let inputMode = changeInputMode(lang, pressedKeys);

function createDiv() {
  const newDiv = document.createElement('div');
  return newDiv;
}

function isText(code) {
  return !(
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

function generateTextToPaste(textAreaElement) {
  textAreaElement.focus();
  navigator.clipboard.readText()
    .then((text) => {
      textAreaElement.focus();
      const prevCursorPlaceStart = Math.min(
        textAreaElement.selectionStart,
        textAreaElement.selectionEnd,
      );
      const prevCursorPlaceEnd = Math.max(
        textAreaElement.selectionStart,
        textAreaElement.selectionEnd,
      );
      const newText = changeText(
        textAreaElement.value,
        textAreaElement.selectionStart,
        textAreaElement.selectionEnd,
        text,
      );
      const isHighlight = prevCursorPlaceEnd - prevCursorPlaceStart > 0;
      const newSelectionStart = isHighlight ? prevCursorPlaceStart + text.length
        : prevCursorPlaceEnd + text.length;
      const newSelectionEnd = textAreaElement.selectionStart;
      textArea.value = newText;
      textArea.selectionStart = newSelectionStart;
      textArea.selectionEnd = newSelectionEnd;
    });
}

function takeSelectedText() {
  const cursorPlaceStart = Math.min(textArea.selectionStart, textArea.selectionEnd);
  const cursorPlaceEnd = Math.max(textArea.selectionStart, textArea.selectionEnd);
  const selectedText = textArea.value.slice(cursorPlaceStart, cursorPlaceEnd);
  return { selectedText, cursorPlaceStart, cursorPlaceEnd };
}

function createNewText(element, code, cursorPlaceStart, cursorPlaceEnd) {
  const selectorType = changeInputMode(lang, pressedKeys);
  let newText = keys[code][selectorType];
  if (code === 'Tab') newText = '\u0009';
  if (code === 'Space') newText = ' ';
  if (code === 'Enter') newText = '\n';
  const text = changeText(
    textArea.value,
    cursorPlaceStart,
    cursorPlaceEnd,
    newText,
  );
  const isHighlight = cursorPlaceEnd - cursorPlaceStart > 0;
  const selectionStart = isHighlight
    ? cursorPlaceStart + newText.length : cursorPlaceEnd + newText.length;
  const selectionEnd = selectionStart;
  return { text, selectionStart, selectionEnd };
}

document.addEventListener('keydown', (e) => {
  const { code } = e;
  if (!keys[code]) return;
  e.preventDefault();
  const { selectedText, cursorPlaceStart, cursorPlaceEnd } = takeSelectedText();
  if (pressedKeys.has('MetaLeft') || pressedKeys.has('MetaRight') || code === 'MetaRight' || code === 'MetaLeft') {
    if (code === 'KeyC') {
      navigator.clipboard.writeText(selectedText);
    } else if (code === 'KeyV') {
      generateTextToPaste(textArea);
    } else if (code === 'KeyX') {
      navigator.clipboard.writeText(selectedText);
      textArea.value = changeText(
        textArea.value,
        cursorPlaceStart,
        cursorPlaceEnd,
        '',
      );
    }
  } else if (isText(code)) {
    textArea.focus();
    const { text, selectionStart, selectionEnd } = createNewText(
      textArea,
      code,
      cursorPlaceStart,
      cursorPlaceEnd,
    );
    textArea.value = text;
    textArea.selectionStart = selectionStart;
    textArea.selectionEnd = selectionEnd;
  } else if (code === 'Backspace') {
    textArea.value = changeText(textArea.value, cursorPlaceStart - 1, cursorPlaceEnd, '');
    textArea.selectionStart = cursorPlaceStart - 1;
    textArea.selectionEnd = cursorPlaceStart - 1;
  }
  const currentEl = document.querySelector(`[data-code=${code}]`);
  currentEl.classList.add('keyboard__key_mode_active');
  pressedKeys.add(code);
  if (code === 'ShiftLeft' || code === 'ShiftRight' || code === 'CapsLock') {
    inputMode = changeInputMode(lang, pressedKeys);
    updateKeyboard();
  }
  if ((pressedKeys.has('ControlLeft') && pressedKeys.has('MetaLeft'))
  || (pressedKeys.has('ControlLeft') && pressedKeys.has('MetaRight'))) {
    lang = lang === 'ru' ? 'en' : 'ru';
    localStorage.setItem('lang', lang);
    inputMode = changeInputMode(lang, pressedKeys);
    updateKeyboard();
  }
});

document.addEventListener('keyup', (e) => {
  const { code } = e;
  if (!keys[code]) return;
  if (isText(code)) {
    e.preventDefault();
  }
  const currentEl = document.querySelector(`[data-code=${code}]`);
  pressedKeys.delete(code);
  currentEl.classList.remove('keyboard__key_mode_active');
  if (code === 'ShiftLeft' || code === 'ShiftRight' || code === 'CapsLock') {
    inputMode = changeInputMode(lang, pressedKeys);
    updateKeyboard();
  }
});

keyBoardBody.addEventListener('mousedown', (e) => {
  const { code } = e.target.dataset;
  if (!code) return;
  if (!keys[code]) return;
  e.preventDefault();
  const { selectedText, cursorPlaceStart, cursorPlaceEnd } = takeSelectedText();
  if (pressedKeys.has('MetaLeft') || pressedKeys.has('MetaRight') || code === 'MetaRight' || code === 'MetaLeft') {
    if (code === 'KeyC') {
      navigator.clipboard.writeText(selectedText);
    } else if (code === 'KeyV') {
      generateTextToPaste(textArea);
    } else if (code === 'KeyX') {
      navigator.clipboard.writeText(selectedText);
      textArea.value = changeText(
        textArea.value,
        cursorPlaceStart,
        cursorPlaceEnd,
        '',
      );
    }
  } else if (isText(code)) {
    textArea.focus();
    const { text, selectionStart, selectionEnd } = createNewText(
      textArea,
      code,
      cursorPlaceStart,
      cursorPlaceEnd,
    );
    textArea.value = text;
    textArea.selectionStart = selectionStart;
    textArea.selectionEnd = selectionEnd;
  } else if (code === 'Backspace') {
    textArea.value = changeText(textArea.value, cursorPlaceStart - 1, cursorPlaceEnd, '');
    textArea.selectionStart = cursorPlaceStart - 1;
    textArea.selectionEnd = cursorPlaceStart - 1;
  }
  const currentEl = document.querySelector(`[data-code=${code}]`);
  if (code === 'CapsLock') {
    currentEl.classList.toggle('keyboard__key_mode_active');
    if (pressedKeys.has(code)) {
      pressedKeys.delete(code);
    } else {
      pressedKeys.add(code);
    }
  } else {
    currentEl.classList.add('keyboard__key_mode_active');
    pressedKeys.add(code);
  }
  if (code === 'ShiftLeft' || code === 'ShiftRight' || code === 'CapsLock') {
    inputMode = changeInputMode(lang, pressedKeys);
    updateKeyboard();
  }
  if ((pressedKeys.has('ControlLeft') && pressedKeys.has('MetaLeft'))
  || (pressedKeys.has('ControlLeft') && pressedKeys.has('MetaRight'))) {
    lang = lang === 'ru' ? 'en' : 'ru';
    localStorage.setItem('lang', lang);
    inputMode = changeInputMode(lang, pressedKeys);
    updateKeyboard();
  }
});

keyBoardBody.addEventListener('mouseup', (e) => {
  const { code } = e.target.dataset;
  if (!code) return;
  if (!keys[code]) return;
  const currentEl = document.querySelector(`[data-code=${code}]`);
  if (code !== 'CapsLock') {
    pressedKeys.delete(code);
    currentEl.classList.remove('keyboard__key_mode_active');
  }
  if (code === 'ShiftLeft' || code === 'ShiftRight' || code === 'CapsLock') {
    inputMode = changeInputMode(lang, pressedKeys);
    updateKeyboard();
  }
});
