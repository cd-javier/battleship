/* eslint-disable quotes */
import './styles.css';

import { Player, CPUPlayer } from './battleship';

let activePlayer, opponent, gamemode;

// -----------------------------------
//           DOM SELECTORS
// -----------------------------------
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

// -----------------------------------
//           GAME RENDERING
// -----------------------------------
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
      // Creates each cell of the gameboard
      const singleCell = document.createElement('div');
      singleCell.classList.add('gameboard-cell');
      const [cellY, cellX] = cell.coords;
      singleCell.dataset.y = cellY;
      singleCell.dataset.x = cellX;

      if (!isOpponent && cell.content) {
        // Shows where the ships are for the active player
        singleCell.classList.add('ship');
      }

      if (player.gameboard.isAdjacentToSunk(cell)) {
        // Automatically hits cells surrounding sunk ships
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
      // Populates the gameboard
      const singleCell = document.createElement('div');
      singleCell.classList.add('gameboard-cell');
      target.appendChild(singleCell);
    }
  }

  function renderSingleFleet(target) {
    // Populates the fleets
    target.innerHTML = '';
    const fleet = [5, 4, 3, 3, 2, 2];

    fleet.forEach((ship) => {
      const shipToPlace = document.createElement('div');
      shipToPlace.classList.add('ship');

      for (let i = 0; i < ship; i++) {
        // Creates cell of each ship
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
  // Shows the modal for the users to turn the device
  Selector.modal.classList.toggle('hidden', false);
  Selector.modalText.textContent = message;

  // Renders mock gameboards and fleets to avoid cheating
  renderMock();

  Selector.modalBtn.addEventListener(
    'click',
    () => {
      // If the button is clicked, the modal is hidden and the turn starts
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
      // After confirmation, it reloads the page
      location.reload();
    }
  });
}

// -----------------------------------
//          GAMEPLAY MODES
// -----------------------------------
function cpuGame() {
  gamemode = 'cpu';

  activePlayer = new Player();
  opponent = new CPUPlayer();

  opponent.randomInit();

  playerTurn();
}

function multiPlayerGame() {
  gamemode = 'multi';

  activePlayer = new Player();
  opponent = new Player();

  playerTurn();
}

// -----------------------------------
//          GAMEPLAY LOGIC
// -----------------------------------
function placeFleet(placeHorizontal = true) {
  let horizontal = placeHorizontal;

  renderGame();
  Selector.playerGameboard.addEventListener('mouseup', place, { once: true });

  // Populates the action menu
  Selector.actions.innerHTML = '';

  // Toggle horizontal / vertical placement
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
    // Sets players game in random order
    activePlayer.randomInit();
    // Renders gameboard
    renderGame();

    // Removes listener on the gameboard
    Selector.playerGameboard.removeEventListener('mouseup', place, {
      once: true,
    });

    if (gamemode === 'multi') {
      // If multiplayer, it switches after 1s
      setTimeout(switchPlayers, 1000);
      return;
    }

    // If CPU, it starts the first turn
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
      // If the cell clicked contains a ship, it's removed from the board for replacing
      activePlayer.removeShip(activePlayer.gameboard.board[y][x].content);
    } else if (activePlayer.gameboard.canPlace(y, x, ship.length, horizontal)) {
      activePlayer.placeShip(y, x, horizontal);
    } else {
      // If it's out of bounds, over, or adjacent to another ship, it displays error
      displayError(
        'Oops! Ships must stay within bounds, not overlap, or touch each other.',
        2500
      );
    }

    if (gamemode === 'multi' && activePlayer.shipsToPlace.length === 0) {
      // If multiplayer and no more ships to place, it switches players
      renderGame();
      setTimeout(switchPlayers, 1000);
      return;
    }

    playerTurn(horizontal);
  }
}

function playerTurn(placeHorizontal = true) {
  function playerTurnEventListener(e) {
    const targetCell = e.target.closest('.gameboard-cell');

    if (
      targetCell.classList.contains('hit') ||
      targetCell.classList.contains('miss')
    ) {
      // If the cell has already been hit, display error and start over
      displayError("Oops! You can't his the same cell twice.", 2000);
      playerTurn();
      return;
    }

    const y = targetCell.dataset.y;
    const x = targetCell.dataset.x;

    const attack = opponent.gameboard.receiveAttack(y, x);

    renderGame();

    if (attack) {
      // If the attack hits a ship
      if (opponent.gameboard.hasUnsunkShips()) {
        // And the opponent still has ships to place, start over
        playerTurn();
      } else {
        // If no more ships, end of game
        displayMessage('Game over - You win!');
      }
    } else {
      // If it's a miss
      if (gamemode === 'cpu') {
        // On CPU mode, it's the CPU's turn
        displayMessage("CPU's turn");
        setTimeout(cpuTurn, 1000);
      } else if (gamemode === 'multi') {
        // On multiplayer, it switches players
        setTimeout(switchPlayers, 1000);
      }
    }
  }

  renderGame();

  if (activePlayer.shipsToPlace.length > 0) {
    // If the game hasn't started yet (not all ships placed) the placeFleet func is called
    placeFleet(placeHorizontal);
    return;
  }

  displayMessage('Your turn - Attack your opponent');

  Selector.actions.innerHTML = '';
  addRestartBtn();

  Selector.opponentGameboard.addEventListener(
    'mouseup',
    playerTurnEventListener,
    {
      once: true,
    }
  );
}

function cpuTurn() {
  // Get coordinates of the attack
  const [y, x] = opponent.probBoard.getNextHit();

  // Perform the attack
  const attack = activePlayer.gameboard.receiveAttack(y, x);

  renderGame();

  if (attack) {
    // If the attack hits a ship

    if (!activePlayer.gameboard.hasUnsunkShips()) {
      // If the player doesn't have any more ships to sink the game is over
      displayMessage('Game over - You lose!');
      return;
    }

    // Records it on the probBoard
    opponent.probBoard.hit(y, x);

    if (activePlayer.gameboard.board[y][x].content.sunk) {
      // If the ship that has just been hit has been sunk
      // Restarts the probBoard accordingly
      opponent.probBoard.sunkShip();
    }

    setTimeout(cpuTurn, 1000);
  } else {
    // If the attack misses
    // Records it on the probBoard
    opponent.probBoard.miss(y, x);

    // And it's the player's turn
    playerTurn();
  }
}

function switchPlayers() {
  // Swaps active player and opponent
  [activePlayer, opponent] = [opponent, activePlayer];

  // Shows the modal to turn the device
  showModal('Give the device to your opponent');
}

// Automatically on loading
(function () {
  // Renders mock gameboards and fleets
  renderMock();

  // Activates listeners on gamemode buttons
  Selector.startMultiplayer.addEventListener('click', multiPlayerGame);
  Selector.startCPU.addEventListener('click', cpuGame);
})();
