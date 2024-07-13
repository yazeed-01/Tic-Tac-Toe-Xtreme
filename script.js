document.addEventListener('DOMContentLoaded', function() {


    var gameContainer = document.getElementById('game');
    for (var i = 0; i < 9; i++) {
        var box = document.createElement('div');
        box.className = 'box';
        box.innerHTML = '<div class="overlay gray-overlay"></div>';
        gameContainer.insertBefore(box, gameContainer.firstChild);
    }

    /** generate inner grids **/
    var boxes = document.querySelectorAll('.box');
    boxes.forEach(function(box) {
        for (var i = 0; i < 9; i++) {
            var cell = document.createElement('div');
            cell.className = 'cell';
            box.insertBefore(cell, box.firstChild);
        }
    });


    var player1Buttons = document.querySelectorAll('.player1');
    player1Buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            button.classList.add('current');
            // hide button
            hideButtons();
        });
    });

    var player2Buttons = document.querySelectorAll('.player2');
    player2Buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            button.classList.add('current');
            // hide button
            hideButtons();
        });
    });

    function hideButtons() {
        player1Buttons.forEach(function(button) {
            button.style.display = 'none';
        });
        player2Buttons.forEach(function(button) {
            button.style.display = 'none';
        });
    }

    
    /** GLOBAL VARIABLES for winning conditions **/
    var blueMoves = [[],[],[],[],[],[],[],[],[]];
    var redMoves = [[],[],[],[],[],[],[],[],[]];
    var boxLimit = [[],[],[],[],[],[],[],[],[]];
    var blueGlobal = [];
    var redGlobal = [];
    var globalLimit = [];
    var blueWinsGame = false;
    var redWinsGame = false;


    var cells = document.querySelectorAll('.cell');
    cells.forEach(function(cell) {
        cell.addEventListener('click', function() {
            if (cell.classList.contains('blue') || cell.classList.contains('red')) {
                alert('Someone has already claimed this cell!');
            } else {
                var cellIndex = Array.from(cell.parentNode.children).indexOf(cell);
                var boxIndex = Array.from(cell.parentNode.parentNode.children).indexOf(cell.parentNode);

                if (document.querySelector('.player1').classList.contains('current')) {
                    cell.classList.add('blue');
                    blueMoves[boxIndex].push(cellIndex);
                    boxLimit[boxIndex].push(cellIndex);
                    var blueWinsBox = isWinner(blueMoves[boxIndex]);

                    if (blueWinsBox) {
                        const parentBox = cell.parentElement; // Get the parent node
                        const allCells = Array.from(parentBox.children); // Get all children (cells)
                        
                        // Recolor all cells in blue
                        allCells.forEach((childCell) => {
                            childCell.classList.add('blue-overlay');
                            childCell.style.display = 'block';
                        });
                        
                        blueGlobal.push(boxIndex);
                        globalLimit.push('globalLimit: ' + boxIndex);
                        blueWinsGame = isWinner(blueGlobal);
                    } else if (!blueWinsBox && boxLimit[boxIndex].length === 9) {
                        isBoxDraw(boxIndex, cell, globalLimit);
                    }
                    

                    if (blueWinsGame) {
                        youWin('blue');
                    }
                    
                    isGameDraw(blueWinsGame);
                    togglePlayers();

                } else if (document.querySelector('.player2').classList.contains('current')) {
                    cell.classList.add('red');
                    redMoves[boxIndex].push(cellIndex);
                    boxLimit[boxIndex].push(cellIndex);
                    var redWinsBox = isWinner(redMoves[boxIndex]);

                    if (redWinsBox) {
                        const parentBox = cell.parentElement; // Get the parent node
                        const allCells = Array.from(parentBox.children); // Get all children (cells)
                        
                        // Recolor all cells in blue
                        allCells.forEach((childCell) => {
                            childCell.classList.add('red-overlay');
                            childCell.style.display = 'block';
                        });
                        redGlobal.push(boxIndex);
                        globalLimit.push(boxIndex);
                        redWinsGame = isWinner(redGlobal);
                    } else if (!redWinsBox && boxLimit[boxIndex].length === 9) {
                        isBoxDraw(boxIndex, cell, globalLimit);
                    }

                    if (redWinsGame) {
                        youWin('red');
                    }
                    
                    isGameDraw(redWinsGame);
                    togglePlayers();

                } else {
                    alert('Choose starting player.');
                }
            }

            if ((document.querySelector('.player1').classList.contains('current') ||
                document.querySelector('.player2').classList.contains('current')) &&
                (!cell.classList.contains('blue') || !cell.classList.contains('red'))) {
                var overlay = document.querySelectorAll('.overlay')[cellIndex];
                if (overlay.classList.contains('blue-overlay') || overlay.classList.contains('red-overlay') ||
                    boxLimit[cellIndex].length === 9) {
                } 
                else {

                    overlay.style.display = 'none';
                }
            }
        });
    });

    function isBoxDraw(boxIndex, element, globalArray) {
        element.nextElementSibling.classList.add('draw-overlay');
        element.nextElementSibling.style.display = 'block';
        globalArray.push(boxIndex);
        isGameDraw(globalArray);
    }

    function isGameDraw(winStatus) {
        if (!winStatus && globalLimit.length === 9) {
            document.querySelector('.game-overlay').classList.add('draw-overlay');
            document.getElementById('winner').querySelector('h1').textContent = "It's a draw!";
            document.getElementById('winner').style.display = 'block';
        }
    }

    function isWinner(array) {
        return (
            (array.includes(0) && array.includes(1) && array.includes(2)) ||
            (array.includes(3) && array.includes(4) && array.includes(5)) ||
            (array.includes(6) && array.includes(7) && array.includes(8)) ||
            (array.includes(0) && array.includes(3) && array.includes(6)) ||
            (array.includes(1) && array.includes(4) && array.includes(7)) ||
            (array.includes(2) && array.includes(5) && array.includes(8)) ||
            (array.includes(0) && array.includes(4) && array.includes(8)) ||
            (array.includes(2) && array.includes(4) && array.includes(6))
        );
    }

    function youWin(color) {
        var gameOverlay = document.querySelector('.game-overlay');
        var winnerBanner = document.getElementById('winner').querySelector('h1');
        
        if (color === 'red') {
            gameOverlay.classList.add('red-overlay');
            winnerBanner.textContent = 'Red wins';
        } else if (color === 'blue') {
            gameOverlay.classList.add('blue-overlay');
            winnerBanner.textContent = 'Blue wins';
        }

        gameOverlay.style.display = 'block';
        document.getElementById('winner').style.display = 'block';
    }

    function togglePlayers() {
        document.querySelector('.player1').classList.toggle('current');
        document.querySelector('.player2').classList.toggle('current');
    }

});

