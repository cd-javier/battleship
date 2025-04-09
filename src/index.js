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

function renderGame(activePlayer, opponent) {
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

      if (player.gameboard.isAdjacentToSunk(cell)) {
        singleCell.classList.add('miss');
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

    player.gameboard.ships.forEach((ship) => {
      fleet.appendChild(renderFleet(ship));
    });

    player.shipsToPlace.forEach((ship) => {
      const shipToPlace = renderFleet(ship);
      shipToPlace.classList.add('unplaced');
      fleet.appendChild(shipToPlace);
    });
  }
  
  function renderFleet(ship) {
    const shipToPlace = document.createElement('div');
    shipToPlace.classList.add('ship');
    if (ship.sunk) shipToPlace.classList.add('sunk');
  
    for (let i = 0; i < ship.length; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      shipToPlace.appendChild(cell);
    }
  
    return shipToPlace;
  }

  renderGameboard(activePlayer, false);
  renderGameboard(opponent, true);
}

function renderMock() {
  function renderSingleMock(target) {
    target.innerHTML = '';

    for (let i = 0; i < 100; i++) {
      const singleCell = document.createElement('div');
      singleCell.classList.add('gameboard-cell');
      target.appendChild(singleCell);
    }
  }

  function renderSingleFleet(target) {
    const fleet = [5, 4, 3, 3, 2, 2];

    fleet.forEach((ship) => {
      const shipToPlace = document.createElement('div');
      shipToPlace.classList.add('ship');

      for (let i = 0; i < ship; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        shipToPlace.appendChild(cell);
      }

      target.appendChild(shipToPlace);
    });
  }

  renderSingleMock(Selector.playerGameboard);
  renderSingleMock(Selector.opponentGameboard);
  renderSingleFleet(Selector.playerFleet);
  renderSingleFleet(Selector.opponentFleet);
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

    renderGame(player1, player2);

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

  renderGame(player1, player2);

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

  player2.randomInit();

  renderGame(player1, player2);
  placeFleet(player1);
}

function placeFleet(player) {
  function place(e) {
    const targetCell = e.target.closest('.gameboard-cell');
    const y = targetCell.dataset.y;
    const x = targetCell.dataset.x;
    const ship = player.shipsToPlace[0];

    if (player.gameboard.canPlace(y, x, ship.length, true)) {
      player.placeShip(y, x);
      renderGame(player1, player2);
    } else {
      displayMessage("Oops, you can't place that ship there, try again");
    }

    if (player.shipsToPlace.length > 0) {
      placeFleet(player);
    } else {
      playerTurn();
    }
  }

  Selector.playerGameboard.addEventListener('click', place, { once: true });
}

let player1, player2;

cpuGame();
