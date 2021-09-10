const playerFactory = (marker, turn) => {
    let _score = 0;
    const getScore = () => _score;
    const addScore = () => ++_score;
    const resetScore = () => { _score = 0 };
    return { marker, turn, getScore, addScore, resetScore }
}

const gameBoard = (() => {
    const _board = [
        ['1','2','3'],
        ['4','5','6'],
        ['7','8','9']
    ];

    const setCell = (i,j,marker) => {
        _board[i][j] = marker;
    }

    const getCell = (i,j) => {
        return _board[i][j];
    }

    const reset = () => {
        for (let i = 0; i < _board.length; i++) {
            for (let j = 0; j < _board[i].length; j++) {
                _board[i][j] = '';
            }
        }
    }

    return { setCell, getCell, reset }
})();


const displayController = (() => {
    const boardDOM = document.querySelector('.gameBoard');
    const messageField = document.querySelector('#messageField');
    const headerField = document.querySelector('header');
    const gameContainer = document.querySelector('.gameContainer');
    
    headerField.style.display = "flex";
    gameContainer.style.display = "none";


    const toggleDisplay = () => {
        [headerField.style.display, gameContainer.style.display] = [gameContainer.style.display, headerField.style.display];
    }


    const twoPlayerField = () => {
        const startButton = document.createElement('input');

        startButton.type = 'submit';
        // startButton.className = 'start';
        startButton.value = 'Two Player Mode'
        startButton.addEventListener('click', (e) => {
            toggleDisplay();
            gameBoard.reset();
            renderBoard();
            startButton.remove();
        })

        clearMessage();
        messageField.appendChild(startButton);
    }


    const winnerMessage = () => {
        if (gameController.isWinner()) {
            console.log('The Winner is ' + [player1, player2].filter(player => player.turn)[0].marker);
        } else {
            console.log('The game is a draw!')
        }
    }


    const restartField = () => {
        const restartButton = document.createElement('button');

        restartButton.className = 'restart';
        restartButton.innerHTML = 'Restart';
        restartButton.addEventListener('click', (e) => {
            gameController.isGameComplete = false;
            gameBoard.reset();
            player1.turn = true;
            player2.turn = false;
            renderBoard();
        })
        clearMessage();
        messageField.appendChild(restartButton);
    }

    const clearMessage = () => {
        while (messageField.lastChild) {
            messageField.lastChild.remove();
        }
    }

    const clearBoard = () => {
        while (boardDOM.lastChild) {
            boardDOM.lastChild.remove();
        }
    }

    const renderBoard = () => {
        clearBoard();
        for (let i = 0; i < 3; i++) {
            let row = document.createElement('div');
            row.className = 'gameBoardRow';
            for (let j = 0; j < 3; j++) {
                let cell = document.createElement('div');
                cell.textContent = gameBoard.getCell(i,j);
                cell.className = 'gameBoardCell';
                cell.addEventListener('click', (e) => {
                    gameController.playCell(i,j);
                })
                row.appendChild(cell);
            }
            boardDOM.appendChild(row);
        }
    }


    twoPlayerField();
    return { renderBoard, restartField, winnerMessage }

})();

const gameController = (() => {
    const isGameComplete = false;

// Win conditions
    const winConditionX = cell => ( cell === 'X' );
    const winConditionO = cell => ( cell === 'O' );
    const _checkRows = () => {
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = 0; j < 3; j++) {
                row.push(gameBoard.getCell(i, j));
            }
            if (row.every(winConditionX) || row.every(winConditionO)) {
                return true;
            }
        }
        return false;
    }

    const _checkColumns = () => {
        for (let j = 0; j < 3; j++) {
            let column = [];
            for (let i = 0; i < 3; i++) {
                column.push(gameBoard.getCell(i,j));
            }
            if (column.every(winConditionX) || column.every(winConditionO)) {
                return true;
            }
        }
        return false;
    }

    const _checkDiagonals = () => {
        let d1 = [];
        let d2 = [];

        for (let i = 0; i < 3; i++) {
            d1.push(gameBoard.getCell(i,i));
        }

        for (let i = 2, j = 0; i >= 0; i--, j++) {
            d2.push(gameBoard.getCell(i,j));
        }
        
        if (d1.every(winConditionX) ||
            d1.every(winConditionO) ||
            d2.every(winConditionX) ||
            d2.every(winConditionO)            
        ) {
            return true;
        }
        return false;
    }

    const isDraw = () => {
        if (isWinner()) {
            return false;
        } else {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++ ) {
                    if (!gameBoard.getCell(i,j)) {
                        return false;
                    }
                }
            }
            return true;
        }
    }

    const isWinner = () => {
        if (_checkRows() || _checkColumns() || _checkDiagonals()) {
            return true;
        }
        return false;
    }

    const playCell = (i,j) => {
        if (['X','O'].indexOf(gameBoard.getCell(i,j)) === -1 && !gameController.isGameComplete) {
            // Place current player's marker
            if (player1.turn) {
                console.log('p1')
                gameBoard.setCell(i, j, player1.marker);                        
            } else {
                console.log('p2')
                gameBoard.setCell(i, j, player2.marker);
            }
            displayController.renderBoard();

            // Check win condition
            if (isWinner() || isDraw()) {
                gameController.isGameComplete = true;
                displayController.winnerMessage();                
            };

            player1.turn = !player1.turn;
            player2.turn = !player2.turn;
        } 
        
        if (gameController.isGameComplete) {
            displayController.restartField();
        }
    }

    return { isWinner, isDraw, isGameComplete, playCell }
})()

displayController.renderBoard();

const player1 = playerFactory('X', true);
const player2 = playerFactory('O', false);


// TODO:

// Refine display
// Add scores ? optional
// ref for design. Maybe page 1 will include computer. but make that page first. https://gkuzin13.github.io/tic-tac-toe/