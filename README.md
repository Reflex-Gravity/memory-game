# memory-game

A memory test game built on vanilla javascript.

Here's the [demo](https://memorygame.joeldsouza.me/).

## Rules

You play the game as follows:

1. Begin with an m by n grid of squares. You are free to define m and n as you wish.
2. Let r be a number less than (m*n) and greater than zero. Color r squares red and color (m*n - r) squares blue.
3. After s seconds, color all squares white. You are free to define s as you wish.
4. The player then needs to click the squares that were previously red. If he/she clicks a blue square, he/she loses. When the player has found all the red squares, he/she wins. Please notify the user accordingly.