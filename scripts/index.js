import keys from './keys.js';

const body = document.querySelector('body');

let lang = "ru";

// const keysRu = ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'delete', 'tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\', 'caps lock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter', 'shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '/', 'shift', 'ctrl', 'option', 'command', 'space', 'command', 'option', 'left', 'up', 'down', 'right'];

function createDiv() {
  const newDiv = document.createElement('div');
  return newDiv;
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
  // for (let i = 0; i < keysRu.length; i += 1) {
  //   const key = createKeyEl(keysRu[i]);
  //   if (i === keysRu.length - 3) {
  //     const nextKey = createKeyEl(keysRu[i + 1]);
  //     const splittedEl = createDiv();
  //     splittedEl.classList.add('splitted-key');
  //     splittedEl.append(key);
  //     splittedEl.append(nextKey);
  //     element.append(splittedEl);
  //     i += 1;
  //   } else {
  // element.append(key);
  //   }
  // }
}

// const KEYBOARD = [];

const container = createDiv();
const textArea = document.createElement('textarea');
const keyBoardBody = createDiv();

textArea.classList.add('text-area');
container.classList.add('container');
keyBoardBody.classList.add('keyboard');
createKeboard(keyBoardBody);

container.append(textArea, keyBoardBody);

body.append(container);

document.addEventListener('keydown', (e) => {
  e.preventDefault();
  const { code } = e;
  const currentEl = document.querySelector(`[data-code=${code}]`);
  currentEl.classList.add('keyboard__key_mode_active');
  textArea.innerHTML += keys[code][lang];
});

document.addEventListener('keyup', (e) => {
  e.preventDefault();
  const { code } = e;
  const currentEl = document.querySelector(`[data-code=${code}]`);
  currentEl.classList.remove('keyboard__key_mode_active');
});
