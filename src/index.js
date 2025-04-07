/* eslint-disable quotes */
import './styles.css';

import { Player } from './battleship';

const Selector = (function () {
  const display = document.getElementById('display');
  const actions = document.getElementById('actions');
  const playerGameboard = document.getElementById('player-gameboard');
  const playerFleet = document.getElementById('player-fleet');
  const opponentGameboard = document.getElementById('opponent-gameboard');
  const opponentFleet = document.getElementById('opponent-fleet');
  const startBtn = document.getElementById('start');

  return {
    display,
    actions,
    playerGameboard,
    playerFleet,
    opponentGameboard,
    opponentFleet,
    startBtn,
  };
})();

function renderGameboard(player, isOpponent) {
  const board = player.gameboard.board;
  const target = isOpponent
    ? Selector.opponentGameboard
    : Selector.playerGameboard;

  const fleet = isOpponent ? Selector.opponentFleet : Selector.playerFleet;

  target.innerHTML = '';
  fleet.innerHTML = '';

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

  player.shipsToPlace.forEach((ship) => {
    const shipToPlace = renderFleet(ship);
    shipToPlace.classList.add('unplaced');
    fleet.append(shipToPlace);
  });

  player.gameboard.ships.forEach((ship) => {
    fleet.append(renderFleet(ship));
  });
}

function renderFleet(ship) {
  const shipToPlace = document.createElement('div');
  shipToPlace.classList.add('ship');
  if (ship.sunk) shipToPlace.classList.add('sunk');

  for (let i = 0; i < ship.length; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    shipToPlace.append(cell);
  }

  return shipToPlace;
}

function displayMessage(message) {
  Selector.display.textContent = message;
}

function playerTurn() {
  function playerOneEventListener(e) {
    const targetCell = e.target.closest('.gameboard-cell');
  
    // Doesn't allow the player to hit the same cell twice
    if (
      targetCell.classList.contains('hit') ||
      targetCell.classList.contains('miss')
    ) {
      displayMessage("You can't his the same cell twice");
      playerTurn();
      return;
    }
  
    const y = targetCell.dataset.y;
    const x = targetCell.dataset.x;
  
    const attack = player2.gameboard.receiveAttack(y, x);
  
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
  }
  Selector.opponentGameboard.addEventListener('click', playerOneEventListener, {
    once: true,
  });
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

function cpuGame() {
  Selector.startBtn.textContent = 'RESTART';

  player1 = new Player();
  player2 = new Player();

  // player1.randomInit();
  player2.randomInit();

  renderGameboard(player1, false);
  renderGameboard(player2, true);
  playerTurn();
}

let player1, player2;

Selector.startBtn.addEventListener('click', cpuGame);
