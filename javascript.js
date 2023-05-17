"use strict";

const containerGameboard = document.querySelector("#gameboard");
const formPlayers = document.querySelector("#player-form");

function Player(name, marker) {
  return { name, marker };
}

const displayController = (function () {
  const players = [];
  players[0] = Player("Player 1", "O");
  players[1] = Player("Player 2", "X");
  let activePlayer = players[0];

  const setPlayers = (e) => {
    console.log(formPlayers);
    players[0].name = formPlayers.querySelector(".player1").value;
    players[1].name = formPlayers.querySelector(".player2").value;
    activePlayer = players[0];
    console.log(players);
  };

  const selectSquare = (square) => {
    const row = square.dataset.row;
    const column = square.dataset.column;
    Gameboard.updateBoard(row, column);
    Gameboard.renderBoard(square);
    // console.log("before", activePlayer.marker);
    switchPlayer();
    // console.log("after", activePlayer.marker);
  };

  const switchPlayer = () => {
    // console.log("before", activePlayer.marker);
    return (activePlayer =
      activePlayer === players[0] ? players[1] : players[0]);
    // console.log("after", activePlayer.marker);
  };

  return { players, switchPlayer, selectSquare, activePlayer, setPlayers };
})();

const Gameboard = (function () {
  const board = [];

  for (let i = 0; i < 3; i++) {
    board[i] = [];

    for (let j = 0; j < 3; j++) {
      board[i].push("");
    }
  }

  const getBoard = () => board;
  const updateBoard = (row, column) => {
    if (board[row][column]) return;
    console.log(displayController.activePlayer.marker);
    board[row][column] = displayController.activePlayer.marker;
    console.log(getBoard());
  };

  const renderBoard = (square) => {
    square.textContent = displayController.activePlayer.marker;
  };

  return { getBoard, updateBoard, renderBoard };
})();

//
//
//

containerGameboard.addEventListener("click", function (e) {
  if (!e.target.dataset.row) return;
  displayController.selectSquare(e.target);
});

formPlayers.querySelector(".submit").addEventListener("click", function (e) {
  e.preventDefault();
  displayController.setPlayers();
});
