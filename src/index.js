/* eslint-disable quotes */
import './styles.css';

import { Player } from './battleship';

let player1, player2, activePlayer, opponent, gamemode;

const Selector = (function () {
  const display = document.getElementById('display');
  const actions = document.getElementById('actions');
  const playerGameboard = document.getElementById('player-gameboard');
  const playerFleet = document.getElementById('player-fleet');
  const opponentGameboard = document.getElementById('opponent-gameboard');
  const opponentFleet = document.getElementById('opponent-fleet');
  const startMultiplayer = document.getElementById('start-multiplayer');
  const startCPU = document.getElementById('start-cpu');
  const modal = document.getElementById('modal');
  const modalText = document.getElementById('modal-text');
  const modalBtn = document.getElementById('modal-btn');

  return {
    display,
    actions,
    playerGameboard,
    playerFleet,
    opponentGameboard,
    opponentFleet,
    startMultiplayer,
    startCPU,
    modal,
    modalText,
    modalBtn,
  };
})();

function renderGame() {
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
    target.innerHTML = '';
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

function displayTemporaryMessage(message) {
  const currentMessage = Selector.display.textContent;

  displayMessage(message);
  setTimeout(() => displayMessage(currentMessage), 2000);
}

function showModal(message, btnFnc) {
  Selector.modal.classList.toggle('hidden', false);
  Selector.modalText.textContent = message;

  renderMock();

  Selector.modalBtn.addEventListener(
    'click',
    () => {
      Selector.modal.classList.toggle('hidden', true);
      btnFnc();
    },
    { once: true }
  );
}

function addRestartBtn() {
  const restartBtn = document.createElement('button');
  Selector.actions.appendChild(restartBtn);
  restartBtn.textContent = 'Restart';

  restartBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to restart the game?')) {
      location.reload();
    }
  });
}

function playerTurn(player, opponent, nextTurnFunc) {
  function playerOneEventListener(e) {
    const targetCell = e.target.closest('.gameboard-cell');

    if (
      targetCell.classList.contains('hit') ||
      targetCell.classList.contains('miss')
    ) {
      displayTemporaryMessage("You can't his the same cell twice");
      playerTurn(player, opponent, nextTurnFunc);
      return;
    }

    const y = targetCell.dataset.y;
    const x = targetCell.dataset.x;

    const attack = opponent.gameboard.receiveAttack(y, x);

    renderGame();

    if (attack) {
      if (opponent.gameboard.hasUnsunkShips()) {
        playerTurn(player, opponent, nextTurnFunc);
      } else {
        displayMessage('Game over - You win!');
      }
    } else {
      nextTurnFunc();
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
    return;
  }

  renderGame();

  if (attack) {
    if (player2.gameboard.hasUnsunkShips()) {
      cpuTurn();
    } else {
      displayMessage('Game over - Player 2 Wins!');
    }
  } else {
    playerTurn(player1, player2, cpuTurn);
  }
}

function cpuGame() {
  gamemode = 'cpu';
  player1 = new Player();
  player2 = new Player();
  
  activePlayer = player1;
  opponent = player2;

  opponent.randomInit();

  renderGame();
  placeFleet(activePlayer);
}

function placeFleet(player) {
  let horizontal = true;

  Selector.actions.innerHTML = '';

  const verticalBtn = document.createElement('button');
  verticalBtn.textContent = 'Vertical';
  Selector.actions.appendChild(verticalBtn);
  verticalBtn.addEventListener('click', () => {
    horizontal = !horizontal;
    verticalBtn.textContent = horizontal ? 'Vertical' : 'Horizontal';
  });

  addRestartBtn();

  function place(e) {
    const targetCell = e.target.closest('.gameboard-cell');
    const y = targetCell.dataset.y;
    const x = targetCell.dataset.x;
    const ship = player.shipsToPlace[0];

    if (player.gameboard.canPlace(y, x, ship.length, horizontal)) {
      player.placeShip(y, x, horizontal);
      renderGame();
    } else {
      displayTemporaryMessage(
        "Oops, you can't place that ship there, try again"
      );
    }

    if (player.shipsToPlace.length > 0) {
      placeFleet(player);
    } else {
      playerTurn(player1, player2, cpuTurn);
    }
  }

  Selector.playerGameboard.addEventListener('click', place, { once: true });
}

(function () {
  renderMock();

  Selector.startMultiplayer.addEventListener('click', () => {});
  Selector.startCPU.addEventListener('click', cpuGame);
})();
