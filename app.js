const grid = document.querySelector('.grid');

const number = 16;

function createGrid() {
  grid.style.gridTemplateColumns = `repeat(${number}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${number}, 1fr)`;

  for (let i = 0; i < number * number; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-item');
    grid.appendChild(cell);
  }
}

createGrid();