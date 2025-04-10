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
  const errorModal = document.getElementById('error-modal');
  const errorModalText = document.getElementById('error-modal-text');

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
    errorModal,
    errorModalText,
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

function displayError(message, time = 2000) {
  Selector.errorModalText.textContent = message;

  Selector.errorModal.classList.toggle('hidden', false);
  setTimeout(() => {
    Selector.errorModal.classList.toggle('hidden', true);
  }, time);
}

function showModal(message) {
  Selector.modal.classList.toggle('hidden', false);
  Selector.modalText.textContent = message;

  renderMock();

  Selector.modalBtn.addEventListener(
    'click',
    () => {
      Selector.modal.classList.toggle('hidden', true);
      playerTurn();
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

function playerTurn(placeHorizontal = true) {
  function playerTurnEventListener(e) {
    const targetCell = e.target.closest('.gameboard-cell');

    if (
      targetCell.classList.contains('hit') ||
      targetCell.classList.contains('miss')
    ) {
      displayError("Oops! You can't his the same cell twice.", 2000);
      playerTurn();
      return;
    }

    const y = targetCell.dataset.y;
    const x = targetCell.dataset.x;

    const attack = opponent.gameboard.receiveAttack(y, x);

    renderGame();

    if (attack) {
      if (opponent.gameboard.hasUnsunkShips()) {
        playerTurn();
      } else {
        displayMessage('Game over - You win!');
      }
    } else {
      if (gamemode === 'cpu') {
        cpuTurn();
      } else if (gamemode === 'multi') {
        setTimeout(switchPlayers, 1000);
      }
    }
  }

  renderGame();

  if (activePlayer.shipsToPlace.length > 0) {
    placeFleet(placeHorizontal);
    return;
  }

  displayMessage('Attack your opponent');

  Selector.actions.innerHTML = '';
  addRestartBtn();

  Selector.opponentGameboard.addEventListener(
    'click',
    playerTurnEventListener,
    {
      once: true,
    }
  );
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
    playerTurn();
  }
}

function cpuGame() {
  gamemode = 'cpu';
  player1 = new Player();
  player2 = new Player();

  activePlayer = player1;
  opponent = player2;

  opponent.randomInit();

  playerTurn();
}

function multiPlayerGame() {
  gamemode = 'multi';
  player1 = new Player();
  player2 = new Player();

  activePlayer = player1;
  opponent = player2;

  playerTurn();
}

function placeFleet(placeHorizontal = true) {
  let horizontal = placeHorizontal;

  renderGame();
  Selector.playerGameboard.addEventListener('click', place, { once: true });

  Selector.actions.innerHTML = '';

  const verticalBtn = document.createElement('button');
  verticalBtn.textContent = horizontal ? 'Vertical' : 'Horizontal';
  Selector.actions.appendChild(verticalBtn);
  verticalBtn.addEventListener('click', () => {
    horizontal = !horizontal;
    verticalBtn.textContent = horizontal ? 'Vertical' : 'Horizontal';
  });

  const randomBtn = document.createElement('button');
  randomBtn.textContent = 'Place randomly';
  Selector.actions.appendChild(randomBtn);
  randomBtn.addEventListener('click', () => {
    activePlayer.randomInit();
    renderGame();

    if (gamemode === 'multi') {
      Selector.playerGameboard.removeEventListener('click', place, {
        once: true,
      });
      setTimeout(switchPlayers, 1000);
      return;
    }

    playerTurn();
  });

  addRestartBtn();

  displayMessage('Place your fleet');

  function place(e) {
    const targetCell = e.target.closest('.gameboard-cell');
    const y = targetCell.dataset.y;
    const x = targetCell.dataset.x;
    const ship = activePlayer.shipsToPlace[0];

    if (activePlayer.gameboard.board[y][x].content) {
      activePlayer.removeShip(activePlayer.gameboard.board[y][x].content);
    } else if (activePlayer.gameboard.canPlace(y, x, ship.length, horizontal)) {
      activePlayer.placeShip(y, x, horizontal);
    } else {
      displayError(
        'Oops! Ships must stay within bounds, not overlap, or touch each other.',
        2500
      );
    }

    if (gamemode === 'multi' && activePlayer.shipsToPlace.length === 0) {
      renderGame();
      setTimeout(switchPlayers, 1000);
      return;
    }

    playerTurn(horizontal);
  }
}

function switchPlayers() {
  [activePlayer, opponent] = [opponent, activePlayer];

  showModal('Give the device to your opponent');
}

(function () {
  renderMock();

  Selector.startMultiplayer.addEventListener('click', multiPlayerGame);
  Selector.startCPU.addEventListener('click', cpuGame);
})();
