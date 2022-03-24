const root = document.documentElement;
const grid = document.querySelector('.grid');
const gridBackground = document.querySelector(
  '.options-grid-background > input'
);
const gridColor = document.querySelector('.options-grid-borders > input');
const densityInput = document.querySelector('.options-grid-density > input');
const densityLabel = document.querySelector('.options-grid-density > label');
const clearButton = document.querySelector('.btn-clear');
const resetButton = document.querySelector('.btn-reset');
const paintButtons = document.querySelectorAll('.btn-paint');

const DEFAULT_BACKGROUND = '#fdf4ff';
const DEFAULT_BORDERS = '#ffffff';
const DEFAULT_PALETTE = 'spring';
const DEFAULT_SIZE = 24;

let cells = [];
let currentColorPalette = DEFAULT_PALETTE;

let isDrawing = false;
grid.addEventListener('mousedown', () => (isDrawing = true));
document.addEventListener('mouseup', () => (isDrawing = false));

grid.addEventListener('mouseover', draw);
grid.addEventListener('mousedown', draw);

function createGrid(size) {
  grid.innerHTML = '';
  cells = [];

  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  densityLabel.textContent = `${size} x ${size}`;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-item');

      if (row === 0) {
        cell.style.borderTop = 'none';
      }

      if (col === size - 1) {
        cell.style.borderRight = 'none';
      }

      if (col === 0) {
        cell.style.borderLeft = 'none';
      }

      if (row === size - 1) {
        cell.style.borderBottom = 'none';
      }

      if (row === 0 && col === 0) {
        cell.style.borderTopLeftRadius = '6px';
      }

      if (row === size - 1 && col === 0) {
        cell.style.borderBottomLeftRadius = '6px';
      }

      cells.push(cell);
      grid.appendChild(cell);
    }
  }
}

createGrid(DEFAULT_SIZE);

densityInput.addEventListener('input', (e) => {
  createGrid(e.target.value);
});

gridBackground.addEventListener('input', (e) => {
  root.style.setProperty('--canvas-color', e.target.value);
});

gridColor.addEventListener('input', (e) => {
  root.style.setProperty('--grid-color', e.target.value);
});

clearButton.addEventListener('click', (e) => {
  createGrid(densityInput.value);
});

resetButton.addEventListener('click', (e) => {
  root.style.setProperty('--canvas-color', DEFAULT_BACKGROUND);
  root.style.setProperty('--grid-color', DEFAULT_BORDERS);
  gridBackground.value = DEFAULT_BACKGROUND;
  gridColor.value = DEFAULT_BORDERS;

  paintButtons.forEach((button) => {
    if (button.classList.contains(DEFAULT_PALETTE)) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }

    currentColorPalette = DEFAULT_PALETTE;
  });

  createGrid(DEFAULT_SIZE);
});

paintButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    paintButtons.forEach((button) => button.classList.remove('active'));
    e.target.classList.add('active');
    currentColorPalette = e.target.classList[0];
  });
});

function draw(e) {
  const cellClasses = e.target.classList;
  if (
    (isDrawing || e.type === 'mousedown') &&
    cellClasses.contains('grid-item')
  ) {
    if (
      currentColorPalette === 'shading' ||
      currentColorPalette === 'lighten'
    ) {
      const currentColor =
        e.target.style.backgroundColor ||
        hexToRgb(getComputedStyle(root).getPropertyValue('--canvas-color'));

      e.target.style.backgroundColor = getShadeColor(currentColor);
      return;
    }

    if (!cellClasses.contains(currentColorPalette + 'Color')) {
      e.target.className = '';
      e.target.style.backgroundColor = getColor(currentColorPalette);
      cellClasses.add('grid-item');
      cellClasses.add(currentColorPalette + 'Color');
    }
  }
}

function getColor(palette) {
  const palettes = {
    spring: ['#006400', '#008000', '#38b000', '#70e000', '#9ef01a', '#ccff33'],
    summer: ['#bd0505', '#d5440b', '#de7f11', '#edbf17', '#f9f91f', '#f9f110'],
    autumn: ['#390099', '#9e0059', '#ff0054', '#ff5400', '#ff910a', '#ffbd00'],
    winter: ['#03045e', '#0077b6', '#00b4d8', '#00e6b1', '#90e0ef', '#caf0f8'],
  };

  const index = Math.floor(Math.random() * 6);
  return palettes[palette][index];
}

function getShadeColor(currentColor) {
  const matchColors = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/;
  const match = matchColors.exec(currentColor);

  if (match === null) {
    return;
  }

  let redColor = Number(match[1]);
  let greenColor = Number(match[2]);
  let blueColor = Number(match[3]);

  if (currentColorPalette === 'shading') {
    redColor -= 10;
    greenColor -= 10;
    blueColor -= 10;

    if (redColor < 0) {
      redColor = 0;
    }

    if (greenColor < 0) {
      greenColor = 0;
    }

    if (blueColor < 0) {
      blueColor = 0;
    }

    return `rgb(${redColor}, ${greenColor}, ${blueColor})`;
  } else {
    redColor += 10;
    greenColor += 10;
    blueColor += 10;

    if (redColor > 255) {
      redColor = 255;
    }

    if (greenColor > 255) {
      greenColor = 255;
    }

    if (blueColor > 255) {
      blueColor = 255;
    }

    return `rgb(${redColor + 10}, ${greenColor + 10}, ${blueColor + 10})`;
  }
}

function hexToRgb(hex) {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
  return `rgb(${r}, ${g}, ${b})`;
}
