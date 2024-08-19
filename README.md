## Tic-Tac-Toe Game

[Click here to start!](https://tic-tac-toe-lac-iota-37.vercel.app/)

---

Game rules:

- Choose the board size**_(from 3x3 up to 10x10)_**
- Click on the board to add **X** or **O**
  - Click **Reset** button to clear the board
  - Choose a step from the game history to adjust your move

---

Development overview

- initial grid structure:

```
  new Map<number, Record<number, CellType>>([
    [0, { 0: null, 1: null, 2: null }],
    [1, { 0: null, 1: null, 2: null }],
    [2, { 0: null, 1: null, 2: null }],
  ]);
```
