let board = null;
let game = new Chess();

function onDragStart(source, piece, position, orientation) {
    if (game.game_over()) return false;
    if (piece.search(/^b/) !== -1) return false;
}

function makeRandomMove() {
    let possibleMoves = game.moves();
    
    // Game over
    if (possibleMoves.length === 0) return;
    
    let randomIdx = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIdx]);
    board.position(game.fen());
    updateStatus();
}

function onDrop(source, target) {
    // see if the move is legal
    let move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return 'snapback';

    updateStatus();
    
    // Make the computer move after a short delay
    window.setTimeout(makeRandomMove, 250);
}

function onSnapEnd() {
    board.position(game.fen());
}

function updateStatus() {
    let status = '';

    let moveColor = 'White';
    if (game.turn() === 'b') {
        moveColor = 'Black';
    }

    // checkmate?
    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
    }
    // draw?
    else if (game.in_draw()) {
        status = 'Game over, drawn position';
    }
    // game still on
    else {
        status = moveColor + ' to move';
        // check?
        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check';
        }
    }

    document.getElementById('status').innerHTML = status;
}

function initializeGame() {
    let config = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
    };
    board = Chessboard('board', config);

    updateStatus();

    document.getElementById('startBtn').addEventListener('click', () => {
        game.reset();
        board.start();
        updateStatus();
    });

    document.getElementById('undoBtn').addEventListener('click', () => {
        game.undo();
        if (!game.game_over()) {
            game.undo(); // Undo computer's move as well
        }
        board.position(game.fen());
        updateStatus();
    });
}

// Initialize the game once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeGame);