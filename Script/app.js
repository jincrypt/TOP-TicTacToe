const playerFactory = (name, marker, turn) => {
    let _score = 0;
    const getScore = () => _score;
    const addScore = () => ++_score;
    const resetScore = () => { _score = 0 };
    return { name, marker, turn, getScore, addScore, resetScore }
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
                    console.log(e);
// Update to fill player's symbol. Might need some state for which player is currently going.
                    if (['X','O'].indexOf(gameBoard.getCell(i,j)) === -1 && !gameController.isGameComplete) {

                        // Place current player's marker
                        if (player1.turn) {
                            gameBoard.setCell(i, j, player1.marker);                        
                        } else {
                            gameBoard.setCell(i, j, player2.marker);
                        }
                        renderBoard();

                        // Check win condition
                        if (gameController.isWinner()) {
                            console.log('Winner Found')
                            gameController.isGameComplete = true;
                        };
                        // Check draw condition
                        if (gameController.isDraw()) {
                            console.log('Game Draw');
                            gameController.isGameComplete = true;
                        };
                        player1.turn = !player1.turn;
                        player2.turn = !player2.turn;

                        // if either is true, end game somehow
                    }
                })
                row.appendChild(cell);
            }
            boardDOM.appendChild(row);
        }
    }

    return { renderBoard }

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

// Player Setup
    let startButton = document.querySelector('.start');
    startButton.addEventListener('click', (e) => {
        console.log('wat');
        let (playerA,playerB) = gameLogic.createPlayers();
        gameBoard.reset();
    })

    return { isWinner, isDraw, isGameComplete }
})()

displayController.renderBoard();

// const gameLogic = (() => {
//     let playerA;
//     let playerB;
//     const createPlayers = () => {
//         playerA = playerFactory(document.querySelector('#player1').value, 'X');
//         playerB = playerFactory(document.querySelector('#player2').value, 'O');
//         return (playerA, playerB)
//     }

//     return { createPlayers, playerA, playerB }
// })()
const player1 = playerFactory('TestPlayer', 'X', true);
const player2 = playerFactory('TestPlayer2', 'O', false);