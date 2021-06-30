const data = [
  ["X", "O", "X"],
  ["O", "O", "O"],
  ["X", "",  "O"],
];

class Game {

  static get winningCombos() {
    return [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  }

  constructor(data) {
    this.data = data;
  }

  defineWinner(){
    switch(true) {
      case this.winnerX(): return 'X';
      case this.winnerO(): return 'O';
      default: return 'not defined';
    }
  }

  winnerX() {
     return this.constructor.winningCombos.some((combo) => {
      return combo.every((cell) => {
        let y = Math.floor(cell/3);
        let x = cell%3;
        return this.data[y][x] === "X"
      });
    });
  }

  winnerO() {
    return this.constructor.winningCombos.some((combo) => {
      return combo.every((cell) => {
        let y = Math.floor(cell/3);
        let x = cell%3;
        return this.data[y][x] === "O"
      });
    });
  }
}
const game = new Game(data);
console.log('Winner is ' + game.defineWinner());
