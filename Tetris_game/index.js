const gridwidth = 10

//shapes
const lShape = [
    [1, 2, gridwidth + 1, gridwidth*2 + 1],
    [gridwidth, gridwidth + 1, gridwidth + 2, gridwidth*2 + 2],
    [1, gridwidth + 1, gridwidth*2, gridwidth*2 + 1],
    [gridwidth, gridwidth*2, gridwidth*2 + 1, gridwidth*2 + 2]
]

const zShape = [
    [gridwidth + 1, gridwidth + 2, gridwidth*2, gridwidth*2 + 1],
    [0, gridwidth, gridwidth + 1, gridwidth*2 + 1],
    [gridwidth + 1, gridwidth + 2, gridwidth*2, gridwidth*2 + 1],
    [0, gridwidth, gridwidth + 1, gridwidth*2 + 1]
]

const tShape = [
    [1, gridwidth, gridwidth + 1, gridwidth + 2],
    [1, gridwidth + 1, gridwidth + 2, gridwidth*2 + 1],
    [gridwidth, gridwidth + 1, gridwidth + 2, gridwidth*2 + 1],
    [1, gridwidth, gridwidth + 1, gridwidth*2 + 1]
]

const oShape = [
    [0, 1, gridwidth, gridwidth + 1],
    [0, 1, gridwidth, gridwidth + 1],
    [0, 1, gridwidth, gridwidth + 1],
    [0, 1, gridwidth, gridwidth + 1]
]

const iShape = [ 
    [1, gridwidth + 1, gridwidth*2 + 1, gridwidth*3 + 1],
    [gridwidth, gridwidth + 1, gridwidth + 2, gridwidth + 3],
    [1, gridwidth + 1, gridwidth*2 + 1, gridwidth*3 + 1],
    [gridwidth, gridwidth + 1, gridwidth + 2, gridwidth + 3]
]

const allShapes = [ lShape, zShape, tShape, oShape, iShape]

let currentPosition = 3
let currentRotation = 0 
let randomShape = Math.floor(Math.random() * allShapes.length)
let currentShape = allShapes[randomShape][currentRotation]
let $gridSquares = Array.from(document.querySelectorAll(".grid div"))

function draw() {
    currentShape.forEach(squareIndex => {
    $gridSquares [squareIndex + currentPosition].classList.add("shapePainted");
    })
}
draw() 

function undraw() {
    currentShape.forEach(squareIndex => {
      $gridSquares[squareIndex + currentPosition].classList.remove("shapePainted")
    })
}

const $restartButton = document.getElementById("restart-button")
$restartButton.addEventListener("click", () => {
    window.location.reload()
})

//setInterval(moveDown, 600)
let tirmerId = null
const $startStopButton = document.getElementById("start-button")
$startStopButton.addEventListener("click", () => {
 if (tirmerId) {
    clearInterval(tirmerId)
    tirmerId = null
 } else {
    tirmerId = setInterval(moveDown, 600)
 }
})


function moveDown(){
    freeze()
    
    undraw()
    currentPosition += 10
    draw()
}

function freeze() {
    if (currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition + gridwidth].classList.contains("filled")
    )) { 
       currentShape.forEach(squareIndex => $gridSquares[squareIndex + currentPosition].classList.add("filled"))
    
        currentPosition = 3
        currentRotation = 0 
        randomShape = Math.floor(Math.random() * allShapes.length)
        currentShape = allShapes[randomShape][currentRotation]
        draw()

        checkIfRowIsFilled()

        updateScore(13)
    }
} 

function moveLeft() {
    const isEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridwidth === 0)
    if (isEdgeLimit) return

    const isFilled = currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition - 1].classList.contains("filled")
    )
    if (isFilled) return

    undraw()
    currentPosition--
    draw()
}

function moveRight() {
    const isEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridwidth === gridwidth - 1)
    if (isEdgeLimit) return

    const isFilled = currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition + 1].classList.contains("filled")
    )
    if (isFilled) return

    undraw()
    currentPosition++
    draw()
}

function previousRotation() {
    if (currentRotation === 0 ){
        currentRotation = currentShape.length - 1 
    } else {
        currentRotation--
   }

   currentShape = allShapes[randomShape][currentRotation]
}

function rotate() {
    undraw()

    if (currentRotation === currentShape.length - 1){
        currentRotation = 0
    } else {
    currentRotation++
    }

currentShape = allShapes[randomShape][currentRotation]

    const isLeftEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridwidth === 0)
    const isRightEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridwidth === gridwidth - 1)
   if (isLeftEdgeLimit && isRightEdgeLimit) {
    previousRotation()
   }

   const isFilled = currentShape.some(squareIndex =>
    $gridSquares[squareIndex + currentPosition].classList.contains("filled") 
   )
   if (isFilled) {
    previousRotation()
   }


    draw()
}

let $grid = document.querySelector(".grid")
function checkIfRowIsFilled() {
    for (var row = 0; row < $gridSquares.length; row += gridwidth) {
        let currentRow =[]

        for (var square = row; square < row + gridwidth; square++) {
            currentRow.push(square)
        }

        const isRowPainted = currentRow.every(square =>
            $gridSquares[square].classList.contains("shapePainted")
        )

        if (isRowPainted) {
            const squaresRemoved = $gridSquares.splice(row, gridwidth)
            squaresRemoved.forEach(square => 
                square.classList.remove("shapePainted", "filled"))
            $gridSquares = squaresRemoved.concat($gridSquares)
            $gridSquares.forEach(square => $grid.appendChild(square))

            updateScore(97)
        }
    }
}

const $score = document.querySelector(".score")
let score = 0 
function updateScore(updateValue){
    score += updateValue
    $score.textContent = score
}



document.addEventListener("keydown", controlKeyboard)

function controlKeyboard(event) {
if (tirmerId) {
if (event.key === "ArrowLeft" ) {
    moveLeft ()
    } else if (event.key === "ArrowRight") {
        moveRight()
    } else if (event.key === "ArrowDown") {
    moveDown()
    } else if (event.key === "ArrowUp")
    rotate()
}
}