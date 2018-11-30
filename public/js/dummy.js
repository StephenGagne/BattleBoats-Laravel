const $board = document.getElementById('gameboard')
const $rows = $board.getElementsByClassName('row')
const $cols = $board.getElementsByClassName('col')
const colArray = Array.from($cols)

const placements = localStorage.grid
const gridData = Array.from(JSON.parse(placements))


function buildGrid() {
  $board.innerHTML = ''
  for (let i = 0; i < 10; i++) {
    const row = document.createElement('div')
    row.classList.add('row')
    const rowData = gridData.splice(0, 10)
    for (const data of rowData) {
      const col = document.createElement('div')
      col.classList.add('col')
      col.classList.add(data)
      row.appendChild(col)
    }
    $board.appendChild(row)
  }
  for (const col of $cols) {
    col.classList.add('covered')
  }
}

$board.addEventListener('click', function (e) {
  if (e.target.classList.contains('col')) {
    e.target.classList.remove('covered')
  }
})

buildGrid()