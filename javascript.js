"use strict";
const container = document.querySelector(".container");
const containerGameboard = document.querySelector(".gameboard");
const formPlayers = document.querySelector(".player-form");
const overlayWinner = document.querySelector(".winner-overlay");

function Player(name, marker) {
  return { name, marker };
}

const gameController = (function () {
  const players = [];
  let gameOver = false;
  players[0] = Player("Player 1", "O");
  players[1] = Player("Player 2", "X");
  let activePlayer = players[0];

  const setPlayers = () => {
    if (
      !formPlayers.querySelector(".player1-input").value ||
      !formPlayers.querySelector(".player2-input").value
    )
      return;
    players[0].name = formPlayers
      .querySelector(".player1-input")
      .value.toString();
    players[1].name = formPlayers
      .querySelector(".player2-input")
      .value.toString();
    formPlayers.querySelector(
      ".player-1"
    ).textContent = `${players[0].name}\nO`;
    formPlayers.querySelector(
      ".player-2"
    ).textContent = `${players[1].name}\nX`;
    formPlayers.querySelector(".player1-input").value = "";
    formPlayers.querySelector(".player2-input").value = "";
  };

  const switchGameStatus = (status) => {
    gameOver = status === true ? true : false;
  };

  const getGameStatus = () => gameOver;

  const getPlayers = () => players;

  const selectSquare = (square) => {
    const row = square.dataset.row;
    const column = square.dataset.column;
    if (Gameboard.getBoard()[row][column]) return;
    Gameboard.updateBoard(row, column);
    Gameboard.renderBoard(square);
    Gameboard.checkWinner();
    switchPlayer(false);
  };

  const getActivePlayer = () => activePlayer;

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];

    return activePlayer;
  };

  const resetPlayer = () => (activePlayer = players[0]);

  return {
    switchGameStatus,
    getGameStatus,
    getPlayers,
    switchPlayer,
    selectSquare,
    setPlayers,
    getActivePlayer,
    resetPlayer,
  };
})();

const Gameboard = (function () {
  let board = [];

  const renderBoard = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "O") {
          containerGameboard.querySelector(
            `[data-row='${i}'][data-column='${j}']`
          ).textContent = "O";
        } else if (board[i][j] === "X") {
          containerGameboard.querySelector(
            `[data-row='${i}'][data-column='${j}']`
          ).textContent = "X";
        } else {
          containerGameboard.querySelector(
            `[data-row='${i}'][data-column='${j}']`
          ).textContent = "";
        }
      }
    }
  };

  const initBoard = () => {
    for (let i = 0; i < 3; i++) {
      board[i] = [];

      for (let j = 0; j < 3; j++) {
        board[i].push("");
      }
    }
    return board; // Good practice?
  };

  initBoard();

  const renderInitBoard = () => {
    overlayWinner.classList.add("hidden");
    containerGameboard.classList.remove("overlay");
    gameController.switchGameStatus(false);
    gameController.resetPlayer();
    board = initBoard();
    renderBoard();
  };

  const getBoard = () => board;

  const updateBoard = (row, column) => {
    getBoard()[row][column] = gameController.getActivePlayer().marker;
  };

  const checkWinner = () => {
    if (
      (board[0][0] &&
        board[0][0] === board[0][1] &&
        board[0][1] === board[0][2]) ||
      (board[0][0] &&
        board[0][0] === board[1][0] &&
        board[1][0] === board[2][0]) ||
      (board[0][1] &&
        board[0][1] === board[1][1] &&
        board[1][1] === board[2][1]) ||
      (board[0][2] &&
        board[0][2] === board[1][2] &&
        board[1][2] === board[2][2]) ||
      (board[1][0] &&
        board[1][0] === board[1][1] &&
        board[1][1] === board[1][2]) ||
      (board[2][0] &&
        board[2][0] === board[2][1] &&
        board[2][1] === board[2][2]) ||
      (board[0][0] &&
        board[0][0] === board[1][1] &&
        board[1][1] === board[2][2]) ||
      (board[0][2] &&
        board[0][2] === board[1][1] &&
        board[1][1] === board[2][0])
    ) {
      containerGameboard.classList.add("overlay");
      overlayWinner.classList.remove("hidden");
      overlayWinner.textContent = `${
        gameController.getActivePlayer().name
      } wins`;
      gameController.switchGameStatus(true);
    }
    return;
  };

  return { getBoard, updateBoard, renderBoard, renderInitBoard, checkWinner };
})();

containerGameboard.addEventListener("click", function (e) {
  if (!e.target.dataset.row || gameController.getGameStatus()) return;
  gameController.selectSquare(e.target);
});

formPlayers.querySelector(".submit").addEventListener("click", function (e) {
  e.preventDefault();
  gameController.setPlayers();
});

formPlayers
  .querySelector(".reset-game")
  .addEventListener("click", function (e) {
    e.preventDefault();
    Gameboard.renderInitBoard();
    gameController.resetPlayer();
  });

overlayWinner.addEventListener("click", function (e) {
  Gameboard.renderInitBoard();
});
