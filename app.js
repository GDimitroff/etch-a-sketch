const grid = document.querySelector('.grid');
const gridBackground = document.querySelector(
  '.options-grid-background > input'
);
const gridBorders = document.querySelector('.options-grid-borders > input');
const densityInput = document.querySelector('.options-grid-density > input');
const densityLabel = document.querySelector('.options-grid-density > label');
const clearButton = document.querySelector('.btn-clear');
const resetButton = document.querySelector('.btn-reset');

const defaultGridBackgroundColor = '#fdf4ff';
const defaultGridBordersColor = '#D0D0D0';

let cells = [];
let gridBordersColor = '#D0D0D0';
let gridBackgroundColor = '#fdf4ff';

function createGrid(value = 16) {
  grid.innerHTML = '';
  cells = [];

  grid.style.gridTemplateColumns = `repeat(${value}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${value}, 1fr)`;

  for (let i = 0; i < value * value; i++) {
    const cell = document.createElement('div');
    cell.style.border = `1px solid ${gridBordersColor}`;
    cells.push(cell);
    grid.appendChild(cell);
  }
}

createGrid();

densityInput.addEventListener('change', (e) => {
  const gridValue = e.target.value;
  createGrid(gridValue);
  densityLabel.textContent = `${gridValue} x ${gridValue}`;
});

gridBackground.addEventListener('change', (e) => {
  gridBackgroundColor = e.target.value;
  grid.style.backgroundColor = gridBackgroundColor;
});

gridBorders.addEventListener('change', (e) => {
  gridBordersColor = e.target.value;

  cells.forEach((cell) => {
    cell.style.border = `1px solid ${gridBordersColor}`;
  });
});

clearButton.addEventListener('click', (e) => {
  cells.forEach((cell) => {
    cell.style.backgroundColor = gridBackgroundColor;
  });
});
