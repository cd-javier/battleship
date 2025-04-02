import './styles.css';

import { Player, CPUPlayer } from './battleship';

const Selector = (function () {
  const display = document.getElementById('display');
  const actions = document.getElementById('actions');
  const playerGameboard = document.getElementById('player-gameboard');
  const opponentGameboard = document.getElementById('opponent-gameboard');

  return { display, actions, playerGameboard, opponentGameboard };
})();

function displayGameboard(player, isOpponent) {
  const board = player.gameboard.board;
  const target = isOpponent
    ? Selector.opponentGameboard
    : Selector.playerGameboard;

  board.flat().forEach((cell) => {
    const singleCell = document.createElement('div');
    singleCell.classList.add('gameboard-cell');

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

const player1 = new Player();
const player2 = new Player();

player1.placeShip(1, 2);
player1.placeShip(3, 5, false);
player1.placeShip(3, 8, false);
player1.placeShip(9, 1, true);
player1.placeShip(3, 1);
player1.placeShip(7, 7);

player2.placeShip(1, 2);
player2.placeShip(3, 5, false);
player2.placeShip(3, 8, false);
player2.placeShip(9, 1, true);
player2.placeShip(3, 1);
player2.placeShip(7, 7);

player1.gameboard.receiveAttack(0, 0);
player1.gameboard.receiveAttack(1, 2);
player1.gameboard.receiveAttack(1, 3);
player1.gameboard.receiveAttack(1, 4);
player1.gameboard.receiveAttack(1, 5);
player1.gameboard.receiveAttack(1, 6);

player2.gameboard.receiveAttack(0, 0);
player2.gameboard.receiveAttack(1, 2);
player2.gameboard.receiveAttack(1, 3);
player2.gameboard.receiveAttack(1, 4);
player2.gameboard.receiveAttack(1, 5);
player2.gameboard.receiveAttack(1, 6);

displayGameboard(player1, false);
displayGameboard(player2, true);
