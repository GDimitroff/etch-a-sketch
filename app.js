const grid = document.querySelector('.grid');
const densityInput = document.querySelector('.options-grid-density > input');
const densityLabel = document.querySelector('.options-grid-density > label');

let cells = [];

function createGrid(value = 16) {
  grid.innerHTML = '';
  cells = [];

  grid.style.gridTemplateColumns = `repeat(${value}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${value}, 1fr)`;

  for (let i = 0; i < value * value; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-item');
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
