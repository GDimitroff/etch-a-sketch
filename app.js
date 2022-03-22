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

const defaultGridBackgroundColor = '#fdf4ff';
const defaultGridBordersColor = '#D0D0D0';

let cells = [];
let gridBackgroundColor = '#fdf4ff';
let gridBordersColor = '#D0D0D0';
let colorPalette = 'spring';

let isDrawing = false;
grid.onmousedown = () => (isDrawing = true);
grid.onmouseup = () => (isDrawing = false);

grid.addEventListener('mouseover', (e) => {
  const cellClasses = e.target.classList;
  if (isDrawing && cellClasses.contains('grid-item')) {
    if (!cellClasses.contains(colorPalette + 'Color')) {
      e.target.style.backgroundColor = getColor(colorPalette);
      cellClasses.add(colorPalette + 'Color');
    }
  }
});

function createGrid(value = 16) {
  grid.innerHTML = '';
  cells = [];

  grid.style.gridTemplateColumns = `repeat(${value}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${value}, 1fr)`;

  for (let row = 0; row < value; row++) {
    for (let col = 0; col < value; col++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-item');
      cell.style.backgroundColor = gridBackgroundColor;
      cell.style.borderColor = gridBordersColor;

      if (row === 0) {
        cell.style.borderTop = 'none';
      }

      if (col === 0) {
        cell.style.borderLeft = 'none';
      }

      if (col === value - 1) {
        cell.style.borderRight = 'none';
      }

      if (row === value - 1) {
        cell.style.borderBottom = 'none';
      }

      if (row === 0 && col === 0) {
        cell.style.borderTopLeftRadius = '9px';
      }

      if (row === value - 1 && col === 0) {
        cell.style.borderBottomLeftRadius = '9px';
      }

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

    if (cellBackgroundColor === gridBackgroundColor) {
      cell.style.backgroundColor = e.target.value;
    }
  });

  gridBackgroundColor = e.target.value;
  grid.style.backgroundColor = gridBackgroundColor;
});

gridBorders.addEventListener('change', (e) => {
  gridBordersColor = e.target.value;

  cells.forEach((cell) => {
    cell.style.borderColor = gridBordersColor;
  });
});

clearButton.addEventListener('click', (e) => {
  cells.forEach((cell) => {
    cell.style.backgroundColor = gridBackgroundColor;
    cell.className = '';
    cell.classList.add('grid-item');
  });
});

resetButton.addEventListener('click', (e) => {
  grid.style.backgroundColor = defaultGridBackgroundColor;
  gridBackground.value = defaultGridBackgroundColor;
  gridBorders.value = defaultGridBordersColor;

  gridBackgroundColor = defaultGridBackgroundColor;
  gridBordersColor = defaultGridBordersColor;
  densityInput.value = 16;
  densityLabel.textContent = '16 x 16';

  paintButtons.forEach((button) => {
    if (button.classList.contains('spring')) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });

  createGrid();
});

paintButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    paintButtons.forEach((button) => button.classList.remove('active'));
    e.target.classList.add('active');
    colorPalette = e.target.classList[0];
  });
});

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
