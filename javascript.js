function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeToken = (column, row, player) => {
    if (board[row][column].getValue() != 0) {
      return;
    } else {
      board[row][column].addToken(player);
    }
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue()),
    );
    console.log(boardWithCellValues);
  };
  return { getBoard, placeToken, printBoard };
}

function Cell() {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addToken, getValue };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two",
) {
  const board = Gameboard();
  const players = [
    {
      name: playerOneName,
      token: "x",
    },
    {
      name: playerTwoName,
      token: "o",
    },
  ];

  let activePlayer = players[0];
  const gameState = {
    isOver: false,
    statusMessage: `${activePlayer.name}'s turn.`,
  };

  const getGameState = () => gameState;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (column, row) => {
    console.log(
      `Placing ${getActivePlayer().name}'s token into column ${column}, row ${row}.`,
    );
    board.placeToken(column, row, getActivePlayer().token);

    if (winningMoves()) {
      gameState.isOver = true;
      gameState.statusMessage = `${getActivePlayer().name} wins!`;
      return;
    } else if (checkTie()) {
      gameState.isOver = true;
      gameState.statusMessage = "It's a tie!";
      console.log(`It's a tie!`);
      return;
    } else {
      switchPlayerTurn();
      gameState.statusMessage = `${getActivePlayer().name}'s turn.`;
    }
    printNewRound();
  };
  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    getGameState,
  };

  function winningMoves() {
    const winLose = board.getBoard();
    const winningCombos = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];
    return winningCombos.some((combo) =>
      combo.every(
        ([row, col]) =>
          winLose[row][col].getValue() === getActivePlayer().token,
      ),
    );
  }

  function checkTie() {
    const tieBoard = board.getBoard();
    return tieBoard.flat().every((cell) => cell.getValue() !== 0);
  }
}

const game = GameController();

function ScreenController() {
  const playerStatus = document.getElementById("playerStatus");
  const gameBoard = document.getElementById("gameBoard");

  function drawBoard() {
    gameBoard.textContent = "";
    const boardContent = game.getBoard();

    boardContent.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const boardBtns = document.createElement("button");
        boardBtns.textContent = cell.getValue();
        if (boardBtns.textContent === "0") {
          boardBtns.textContent = "";
        }
        boardBtns.dataset.row = rowIndex;
        boardBtns.dataset.column = colIndex;
        gameBoard.appendChild(boardBtns);
      });
    });
    playerStatus.textContent = game.getGameState().statusMessage;
  }
  gameBoard.addEventListener("click", (e) => {
    if (game.getGameState().isOver) {
      return;
    }
    const playCol = e.target.dataset.column;
    const playRow = e.target.dataset.row;
    if (!playCol || !playRow) return;
    game.playRound(playCol, playRow);
    drawBoard();
  });

  drawBoard();
}
ScreenController();
