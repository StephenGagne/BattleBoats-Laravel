const $boatContainer = document.getElementById('boats')
const boats = $boatContainer.getElementsByClassName('boat')
const $board = document.getElementById('gameboard')
const $rows = $board.getElementsByClassName('row')
const $cols = Array.from($board.getElementsByClassName('col'))
let boatLength = 0
let boatID = null
let boatColor = null
let orientation = 'horizontal'
let gameRunning = false

// gather ship columns
const ships = {
    ship1: document.getElementsByClassName('ship-1'),
    ship2: document.getElementsByClassName('ship-2'),
    ship3: document.getElementsByClassName('ship-3'),
    ship4: document.getElementsByClassName('ship-4'),
    ship5: document.getElementsByClassName('ship-5')
}

function sinkCheck() {
    let hits = 0
    for (const ship in ships) {
        for (const cell of ships[ship]) {
            if (cell.classList.contains('hit')) {
                hits++
                if (hits === ships[ship].length) {
                    for (const all of ships[ship]) {
                        all.classList.add('sunk')
                    }
                }
            }
        }
        hits = 0
    }
}

$boatContainer.addEventListener('click', function (e) {
    if (gameRunning) {

    } else {
        if (e.target.classList.contains('boat')) {
            const thisBoat = e.target.closest('.boat')
            boatColor = window.getComputedStyle(thisBoat).backgroundColor
            for (const col of $cols) {
                if (col.style.backgroundColor === boatColor) {
                    col.style.backgroundColor = "tan"
                    col.classList.remove('ship')
                    col.classList.remove('locked')
                }
            }
            for (const boat of boats) {
                boat.classList.remove('active')
            }
            e.target.classList.add('active')
            boatLength = thisBoat.dataset.length
            boatID = `ship-${thisBoat.dataset.shipid}`
            for (const col of $cols) {
                if (col.dataset.shipid === boatID) {
                    delete(col.dataset.shipid)
                }
            }
        }
    }
})

$board.addEventListener('mouseover', function (cell) {
    for (const col of $cols) {
        if (!col.classList.contains('locked')) {
            col.style.backgroundColor = "#e4f1fe"
            col.classList.remove('ship')
        }
    }
    if (cell.target.classList.contains('col') && !cell.target.classList.contains('locked')) {
        if (orientation === 'horizontal') {
            let row = Array.from(cell.target.closest('.row').querySelectorAll('.col'))
            let startIndex = row.indexOf(cell.target)
            if (startIndex > row.length - boatLength) {
                startIndex = row.length - boatLength
            }
            for (let i = 0; i < boatLength; i++) {
                if (!row[startIndex + i].classList.contains('locked')) {
                    row[startIndex + i].style.backgroundColor = boatColor
                    row[startIndex + i].classList.add('ship')
                }
            }
        } else {
            let row = cell.target.closest('.row')
            let rowArray = Array.from(cell.target.closest('.row').querySelectorAll('.col'))
            let allRows = Array.from($rows)
            let rowIndex = allRows.indexOf(row)
            let startIndex = rowArray.indexOf(cell.target)
            // console.log($rows[allRows.indexOf(row)].querySelectorAll('.col')[startIndex])
            if (rowIndex >= 10 - boatLength) {
                rowIndex = 10 - boatLength
            }
            for (let i = 0; i < boatLength; i++) {
                if ($rows[rowIndex + i].querySelectorAll('.col')[startIndex].classList.contains('locked')) {
                    break
                }
                let ship = $rows[rowIndex + i].querySelectorAll('.col')[startIndex]
                ship.style.backgroundColor = boatColor
                ship.classList.add('ship')
            }
        }
    }
})

$board.addEventListener('click', function (e) {
    if (gameRunning) {
        if (e.target.classList.contains('col')) {
            e.target.classList.remove('covered')
            if (e.target.classList.contains('ship')) {
                e.target.classList.add('hit')
                sinkCheck()
            }
        }
    } else {
        for (const col of $cols) {
            if (col.classList.contains('ship')) {
                if (!col.classList.contains('locked')) {
                    col.dataset.shipid = boatID
                }
                col.classList.add('locked')
            }
        }
        boatColor = null
        boatLength = 0
    }
})

window.addEventListener('keypress', function (e) {
    if (e.key === 'r') {
        if (orientation === 'horizontal') {
            orientation = 'vertical'
        } else {
            orientation = 'horizontal'
        }
    }
})

function exportGame() {
    const grid = []
    for (const col of $cols) {
        grid.push(col.dataset.shipid)
    }
    const gridJSON = JSON.stringify(grid)
    localStorage.grid = gridJSON
    return (gridJSON)
}

if (document.getElementById('export')) {
    $export = document.getElementById('export')
    $export.addEventListener('click', exportGame)
}

function buildGrid() {
    const placements = localStorage.grid
    const gridData = Array.from(JSON.parse(placements))
    $board.innerHTML = ''
    for (let i = 0; i < 10; i++) {
        const row = document.createElement('div')
        row.classList.add('row')
        const rowData = gridData.splice(0, 10)
        for (const data of rowData) {
            const col = document.createElement('div')
            col.classList.add('col')
            col.classList.add(data)
            if (col.classList.contains('null')) {
                col.classList.remove('null')
            } else {
                col.classList.add('ship')
            }
            row.appendChild(col)
        }
        $board.appendChild(row)
    }
    for (const col of $board.getElementsByClassName('col')) {
        col.classList.add('covered')
    }
    gameRunning = true
}
