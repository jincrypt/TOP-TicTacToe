const playerFactory = (marker, turn) => {
    return { marker, turn }
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
        gameController.isGameComplete = false;
        player1.turn = true;
        player2.turn = false;
        displayController.resultField.innerHTML = '';
    }

    const readBoard = () => {
        return _board;
    }

    return { setCell, getCell, reset, readBoard }
})();


const displayController = (() => {
    const boardDOM = document.querySelector('.gameBoard');
    const messageField = document.querySelector('#messageField');
    const headerField = document.querySelector('header');
    const gameContainer = document.querySelector('.gameContainer');
    const resultField = document.querySelector('#resultField');

    headerField.style.display = "flex";
    gameContainer.style.display = "none";


    const toggleDisplay = () => {
        [headerField.style.display, gameContainer.style.display] = [gameContainer.style.display, headerField.style.display];
    }

    const computerField = () => {
        const computerStartButton = document.createElement('input');
        computerStartButton.type = 'submit';
        computerStartButton.value = 'vs Computer'
        computerStartButton.addEventListener('click', (e) => {
            gameController.computerMode = true;
            toggleDisplay();
            gameBoard.reset();
            renderBoard();
            clearMessage();
            returnField();
            restartField();
        })
        messageField.appendChild(computerStartButton);

    }

    const twoPlayerField = () => {
        const startButton = document.createElement('input');

        startButton.type = 'submit';
        startButton.value = 'vs Player'
        startButton.addEventListener('click', (e) => {
            gameController.computerMode = false;
            toggleDisplay();
            gameBoard.reset();
            renderBoard();
            clearMessage();
            returnField();
            restartField();
        })
        messageField.appendChild(startButton);
    }


    const winnerMessage = () => {
        if (gameController.isWinner()) {
            resultField.innerHTML = 'The Winner is ' + [player1, player2].filter(player => player.turn)[0].marker;
        } else {
            resultField.innerHTML = 'The game is a draw!';
        }
    }


    const restartField = () => {
        const restartButton = document.createElement('button');

        restartButton.className = 'restart';
        restartButton.innerHTML = 'Restart';
        restartButton.addEventListener('click', (e) => {
            gameBoard.reset();
            renderBoard();
        })
        messageField.appendChild(restartButton);
    }


    const returnField = () => {
        const returnButton = document.createElement('button');

        returnButton.className = 'return';
        returnButton.innerHTML = 'Game Mode';
        returnButton.addEventListener('click', (e) => {
            gameBoard.reset();
            toggleDisplay();
            clearMessage();
            computerField();
            twoPlayerField();
        })
        messageField.appendChild(returnButton);
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

    // manually execute button for now, but how do i create it with AI mode?
    computerField();
    twoPlayerField();
    return { renderBoard, restartField, winnerMessage, resultField }

})();

const gameController = (() => {
    const isGameComplete = false;
    const computerMode = false;

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
            } else if (!gameController.computerMode) {
                console.log('p2')
                gameBoard.setCell(i, j, player2.marker);
            }
            displayController.renderBoard();

            // Check win condition
            if (isWinner() || isDraw()) {
                gameController.isGameComplete = true;
                displayController.winnerMessage();                
            } else {
                player1.turn = !player1.turn;
                player2.turn = !player2.turn;
            }

            // if playing against computer, let computer make a move immediately after you click
            if (gameController.computerMode && !gameController.isGameComplete && player2.turn) {
                // Choose between easyComputer & minimax Computer
                // easyComputer();
                bestMove();

                if (isWinner() || isDraw()) {
                    gameController.isGameComplete = true;
                    displayController.winnerMessage();
                } else {
                    player1.turn = !player1.turn;
                    player2.turn = !player2.turn;
                }
            }
        } 
    }

    // AI Controls
     
    function bestMove() {
        let bestScore = Infinity;
        let move;                
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameBoard.getCell(i,j) === '') {
                    gameBoard.setCell(i, j, "O");
                    let score = minimax(i,j, 0, true, "X");
                    gameBoard.setCell(i, j, '');
                    if (score < bestScore) {
                        bestScore = score;
                        move = [i,j]
                    }
                }
            }
        }
        gameBoard.setCell(...move, "O");
        displayController.renderBoard();
    }

    // Markers are flipped (X & O), it's based on what was played prior to minimax()
    let minimaxScores = {
        'O': 10,
        'X': -10,
        'draw': 0
    }

    function minimax(i, j, depth, isMaximizing, marker) {
        let resultWinner = gameController.isWinner();
        let resultDraw = gameController.isDraw();
        if (resultWinner) {
            return minimaxScores[marker];
        } else if (resultDraw) {
            return minimaxScores['draw'];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (gameBoard.getCell(i,j) === '') {
                        gameBoard.setCell(i,j, marker);
                        let score = minimax(i,j, depth + 1, false, "O")
                        gameBoard.setCell(i,j, '');
                        bestScore = Math.max(score, bestScore);
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (gameBoard.getCell(i,j) === '') {
                        gameBoard.setCell(i,j, marker);
                        let score = minimax(i,j, depth + 1, true, "X")
                        gameBoard.setCell(i,j, '');
                        bestScore = Math.min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    }

    function easyComputer() {
        let row0 = gameBoard.readBoard()[0];
        let row1 = gameBoard.readBoard()[1];
        let row2 = gameBoard.readBoard()[2];
        let choices = [];

        row0 = row0.reduce((result, currentValue, index) => {
            if (currentValue === '') {
                result.push(index);
            }
            return result;
        }, []);

        row1 = row1.reduce((result, currentValue, index) => {
            if (currentValue === '') {
                result.push(index);
            }
            return result;
        }, []);

        row2 = row2.reduce((result, currentValue, index) => {
            if (currentValue === '') {
                result.push(index);
            }
            return result;
        }, []);

        if (row0.length > 0) {
            choices.push([0, row0[Math.floor(Math.random() * row0.length)]]);
        }

        if (row1.length > 0) {
            choices.push([1, row1[Math.floor(Math.random() * row1.length)]]);
        }

        if (row2.length > 0) {
            choices.push([2, row2[Math.floor(Math.random() * row2.length)]]);
        }

        gameBoard.setCell(...choices[Math.floor(Math.random() * choices.length)], "O");
        displayController.renderBoard();
        choices = [];
    }

    return { isWinner, isDraw, isGameComplete, computerMode, playCell }
})()

const player1 = playerFactory('X', true);
const player2 = playerFactory('O', false);