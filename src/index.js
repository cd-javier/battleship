/* eslint-disable quotes */
import './styles.css';

import { Player, CPUPlayer } from './battleship';

const Selector = (function () {
  const display = document.getElementById('display');
  const actions = document.getElementById('actions');
  const playerGameboard = document.getElementById('player-gameboard');
  const opponentGameboard = document.getElementById('opponent-gameboard');
  const startBtn = document.getElementById('start');

  return { display, actions, playerGameboard, opponentGameboard, startBtn };
})();

function renderGameboard(player, isOpponent) {
  const board = player.gameboard.board;
  const target = isOpponent
    ? Selector.opponentGameboard
    : Selector.playerGameboard;

  target.innerHTML = '';

  board.flat().forEach((cell) => {
    const singleCell = document.createElement('div');
    singleCell.classList.add('gameboard-cell');
    const [cellY, cellX] = cell.coords;
    singleCell.dataset.y = cellY;
    singleCell.dataset.x = cellX;

    if (!isOpponent && cell.content) {
      singleCell.classList.add('ship');
    }

    if (cell.isHit) {
      if (cell.content) {
        singleCell.classList.add('hit');
        if (cell.content.sunk) {
          singleCell.classList.add('sunk');
        }
      } else {
        singleCell.classList.add('miss');
      }
    }

    target.appendChild(singleCell);
  });
}

function displayMessage(message) {
  Selector.display.textContent = message;
}

function playerTurn() {
  function playerOneEventListener(e) {
    const targetCell = e.target.closest('.gameboard-cell');

    const y = targetCell.dataset.y;
    const x = targetCell.dataset.x;

    let attack;

    if (
      !targetCell.classList.contains('hit') &&
      !targetCell.classList.contains('miss')
    ) {
      attack = player2.gameboard.receiveAttack(y, x);
      renderGameboard(player2, true);
      Selector.opponentGameboard.removeEventListener(
        'click',
        playerOneEventListener
      );

      if (attack) {
        if (player2.gameboard.hasUnsunkShips()) {
          playerTurn();
        } else {
          displayMessage('Game over - Player 1 Wins!');
        }
      } else {
        cpuTurn();
      }
    } else {
      displayMessage("You can't his the same cell twice");
    }
  }

  Selector.opponentGameboard.addEventListener('click', playerOneEventListener);
}

function cpuTurn() {
  const y = Math.floor(Math.random() * 10);
  const x = Math.floor(Math.random() * 10);
  let attack;

  try {
    attack = player1.gameboard.receiveAttack(y, x);
  } catch {
    cpuTurn();
  }

  renderGameboard(player1, false);

  if (attack) {
    if (player2.gameboard.hasUnsunkShips()) {
      cpuTurn();
    } else {
      displayMessage('Game over - Player 2 Wins!');
    }
  } else {
    playerTurn();
  }
}

function startGame() {
  Selector.startBtn.textContent = 'RESTART';

  player1 = new Player();
  player2 = new CPUPlayer();

  player1.placeShip(1, 2);
  player1.placeShip(3, 5, false);
  player1.placeShip(3, 8, false);
  player1.placeShip(8, 1, true);
  player1.placeShip(3, 1);
  player1.placeShip(7, 7);

  renderGameboard(player1, false);
  renderGameboard(player2, true);
  playerTurn();
}

let player1, player2;

Selector.startBtn.addEventListener('click', startGame);
