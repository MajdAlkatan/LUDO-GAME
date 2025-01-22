# Ludo Game Code Explanation

This document provides a detailed explanation of the code implementation for a Ludo game. Each class and its methods are explained to help you understand the functionality and logic.

---

## 1. **Board.js**

### Purpose
The `Board` class manages the state and interactions of all players and pieces on the game board.

### Properties
- **`players`**: An object containing two players, `P1` and `P2`, each represented by an instance of the `Player` class.

### Methods

#### `constructor()`
Initializes the board with two players (`P1` and `P2`).

#### `resetPositions()`
Resets all player pieces to their initial positions.

#### `getEligiblePieces(playerId, diceValue)`
Returns an array of piece IDs for the specified player that can move based on the dice roll.

#### `handlePieceClick(playerId, pieceId, diceValue, game)`
Handles the logic when a piece is clicked:
- If the piece is at the base, it is moved to the starting position.
- If not, the piece is moved by the dice value.
- Highlights and updates the game state accordingly.

#### `checkForKill(playerId, pieceId)`
Checks if the current move results in a kill:
- If an opponent’s piece is on the same position (and not in a safe position), it is moved back to the base.
- Returns `true` if a kill occurs, otherwise `false`.

---

## 2. **Game.js**

### Purpose
The `Game` class orchestrates the overall gameplay, including turn management, dice rolls, and interactions with the board.

### Properties
- **`board`**: Instance of the `Board` class.
- **`_diceValue`**: Stores the current dice value.
- **`_turn`**: Tracks the current player's turn (0 for `P1`, 1 for `P2`).
- **`_state`**: Represents the current game state (‘DICE_NOT_ROLLED’ or ‘DICE_ROLLED’).

### Methods

#### `constructor()`
Initializes the game, sets up event listeners, and resets the game state.

#### `listenDiceClick()`
Attaches an event listener for the dice button click.

#### `onDiceClick()`
Handles the dice roll logic:
- Randomly generates a dice value between 1 and 6.
- Updates the game state to ‘DICE_ROLLED’ and checks for eligible pieces.

#### `checkForEligiblePieces()`
Determines if the current player has any pieces that can move. If not, the turn is incremented.

#### `incrementTurn()`
Switches the turn to the other player and resets the state to ‘DICE_NOT_ROLLED’.

#### `listenResetClick()`
Attaches an event listener for the reset button click.

#### `resetGame()`
Resets the game state, including player positions and turn.

#### `listenPieceClick()`
Attaches an event listener for piece clicks.

#### `onPieceClick(event)`
Handles the logic for moving a clicked piece.

---

## 3. **Piece.js**

### Purpose
The `Piece` class represents an individual piece on the board and manages its state and movement.

### Properties
- **`playerId`**: The ID of the player that owns the piece.
- **`id`**: The unique ID of the piece.
- **`position`**: The current position of the piece on the board.

### Methods

#### `constructor(playerId, id)`
Initializes a piece with its player ID and unique ID, and sets its position to the base.

#### `reset()`
Resets the piece to its base position.

#### `isEligibleToMove(diceValue)`
Determines if the piece can move based on its position and the dice value.

#### `isAtBase()`
Checks if the piece is at its base position.

#### `setPosition(newPosition)`
Updates the piece’s position and updates the UI.

#### `incrementPosition(diceValue, board, game)`
Moves the piece step by step based on the dice value:
- Handles turn points and home entrance logic.
- Checks for kills and winning conditions.

#### `getNextPosition()`
Calculates the next position of the piece based on its current position.

---

## 4. **Player.js**

### Purpose
The `Player` class manages the pieces and actions of an individual player.

### Properties
- **`id`**: The ID of the player.
- **`pieces`**: An array of the player’s pieces, each represented by an instance of the `Piece` class.

### Methods

#### `constructor(id)`
Initializes the player with a unique ID and four pieces.

#### `resetPieces()`
Resets all pieces to their base positions.

#### `getPiece(pieceId)`
Returns the piece with the specified ID.

#### `getEligiblePieces(diceValue)`
Returns an array of IDs of pieces that can move based on the dice value.

#### `movePieceToStart(pieceId)`
Moves a specified piece from the base to the starting position.

#### `movePieceBy(pieceId, diceValue, board, game)`
Moves a piece by the dice value, considering board and game state.

---

## 5. **UI.js**

### Purpose
The `UI` class handles the user interface, including piece movements, turn indicators, and dice rolls.

### Methods

#### `listenDiceClick(callback)`
Attaches a click listener to the dice button.

#### `listenResetClick(callback)`
Attaches a click listener to the reset button.

#### `listenPieceClick(callback)`
Attaches a click listener to the player pieces.

#### `setPiecePosition(player, piece, newPosition)`
Updates the position of a piece on the board based on coordinates.

#### `setTurn(index)`
Highlights the active player’s turn and updates the UI.

#### `enableDice()`
Enables the dice button.

#### `disableDice()`
Disables the dice button.

#### `highlightPieces(player, pieces)`
Highlights pieces that are eligible to move.

#### `unhighlightPieces()`
Removes highlighting from all pieces.

#### `setDiceValue(value)`
Displays the current dice value in the UI.

---

## 6. **constants.js**

### Purpose
Defines constants used throughout the game, including:

- **`COORDINATES_MAP`**: Maps positions to coordinates on the board.
- **`STEP_LENGTH`**: Defines the size of each step on the board.
- **`PLAYERS`**: List of player IDs.
- **`BASE_POSITIONS`**: Starting positions for all pieces.
- **`START_POSITIONS`**: Starting points on the board for each player.
- **`HOME_ENTRANCE`**: Positions leading to the home area.
- **`HOME_POSITIONS`**: Final home positions for each player.
- **`TURNING_POINTS`**: Key turning points for each player’s path.
- **`SAFE_POSITIONS`**: Positions where pieces cannot be killed.
- **`STATE`**: Defines the states of the game (‘DICE_NOT_ROLLED’ and ‘DICE_ROLLED’).

---

This concludes the explanation of the Ludo game code. Each class plays a specific role in ensuring the game’s functionality and user experience. If you have any further questions, feel free to ask!

