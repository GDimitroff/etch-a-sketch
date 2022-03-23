const grid = document.querySelector('.grid');
const gridBackground = document.querySelector(
  '.options-grid-background > input'
);
const gridBorders = document.querySelector('.options-grid-borders > input');
const densityInput = document.querySelector('.options-grid-density > input');
const densityLabel = document.querySelector('.options-grid-density > label');
const clearButton = document.querySelector('.btn-clear');
const resetButton = document.querySelector('.btn-reset');
const paintButtons = document.querySelectorAll('.btn-paint');

const DEFAULT_BACKGROUND = '#fdf4ff';
const DEFAULT_BORDERS = '#D0D0D0';
const DEFAULT_PALETTE = 'spring';

let cells = [];
let currentBackground = DEFAULT_BACKGROUND;
let currentBorders = DEFAULT_BORDERS;
let currentColorPalette = DEFAULT_PALETTE;

let isDrawing = false;
grid.onmousedown = () => (isDrawing = true);
document.body.onmouseup = () => (isDrawing = false);

grid.addEventListener('mouseover', draw);
grid.addEventListener('mousedown', draw);

function createGrid(value = 24) {
  grid.innerHTML = '';
  cells = [];

  grid.style.gridTemplateColumns = `repeat(${value}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${value}, 1fr)`;

  for (let row = 0; row < value; row++) {
    for (let col = 0; col < value; col++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-item');
      cell.style.backgroundColor = currentBackground;
      cell.style.borderColor = currentBorders;

      if (row === 0) {
        cell.style.borderTop = 'none';
      }

      if (col === 0) {
        cell.style.borderLeft = 'none';
      }

      if (row === 0 && col === 0) {
        cell.style.borderTopLeftRadius = '9px';
      }

      if (row === value - 1 && col === 0) {
        cell.style.borderBottomLeftRadius = '9px';
      }

      cell.style.borderRight = 'none';
      cell.style.borderBottom = 'none';

      cells.push(cell);
      grid.appendChild(cell);
    }
  }
}

createGrid();

densityInput.addEventListener('change', (e) => {
  const gridValue = e.target.value;
  createGrid(gridValue);
  densityLabel.textContent = `${gridValue} x ${gridValue}`;
});

gridBackground.addEventListener('change', (e) => {
  const rgba2hex = (rgba) =>
    `#${rgba
      .match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)
      .slice(1)
      .map((n, i) =>
        (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n))
          .toString(16)
          .padStart(2, '0')
          .replace('NaN', '')
      )
      .join('')}`;

  cells.forEach((cell) => {
    const cellBackgroundColor = rgba2hex(cell.style.backgroundColor);

    if (cellBackgroundColor === currentBackground) {
      cell.style.backgroundColor = e.target.value;
    }
  });

  currentBackground = e.target.value;
  grid.style.backgroundColor = currentBackground;
});

gridBorders.addEventListener('change', (e) => {
  currentBorders = e.target.value;

  cells.forEach((cell) => {
    cell.style.borderColor = currentBorders;
  });
});

clearButton.addEventListener('click', (e) => {
  cells.forEach((cell) => {
    cell.style.backgroundColor = currentBackground;
    cell.className = '';
    cell.classList.add('grid-item');
  });
});

resetButton.addEventListener('click', (e) => {
  grid.style.backgroundColor = DEFAULT_BACKGROUND;
  gridBackground.value = DEFAULT_BACKGROUND;
  gridBorders.value = DEFAULT_BORDERS;

  currentBackground = DEFAULT_BACKGROUND;
  currentBorders = DEFAULT_BORDERS;
  densityInput.value = 24;
  densityLabel.textContent = '24 x 24';

  paintButtons.forEach((button) => {
    if (button.classList.contains(DEFAULT_PALETTE)) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }

    currentColorPalette = DEFAULT_PALETTE;
  });

  createGrid();
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
      const currentColor = e.target.style.backgroundColor;
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
