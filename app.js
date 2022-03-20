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

function createGrid(value = 16) {
  grid.innerHTML = '';
  cells = [];

  grid.style.gridTemplateColumns = `repeat(${value}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${value}, 1fr)`;

  for (let row = 0; row < value; row++) {
    for (let col = 0; col < value; col++) {
      const cell = document.createElement('div');
      cell.style.backgroundColor = gridBackgroundColor;
      cell.style.border = `1px solid ${gridBordersColor}`;

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
  });
});
