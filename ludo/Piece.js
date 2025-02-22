// Piece.js
import { STATE, BASE_POSITIONS, HOME_POSITIONS, TURNING_POINTS, HOME_ENTRANCE, SAFE_POSITIONS,COORDINATES_MAP } from './constants.js';
import { UI } from './UI.js'
export class Piece {
    playerId;
    id;
    position;

    constructor(playerId, id) {
        this.playerId = playerId;
        this.id = id;
        this.position;
        this.isHome = false;
        this.reset();
    }

    reset() {
        this.position = BASE_POSITIONS[this.playerId][this.id];
        UI.setPiecePosition(this.playerId, this.id, this.position);
    }

    isEligibleToMove(diceValue) {
        if (this.position === HOME_POSITIONS[this.playerId]) {
            return false;
        }

        if (BASE_POSITIONS[this.playerId].includes(this.position) && diceValue !== 6) {
            return false;
        }

        if (
            HOME_ENTRANCE[this.playerId].includes(this.position) &&
            diceValue > HOME_POSITIONS[this.playerId] - this.position
        ) {
            return false;
        }

        return true;
    }

    isAtBase() {
        return BASE_POSITIONS[this.playerId].includes(this.position);
    }

    setPosition(newPosition) {
        this.position = newPosition;
        UI.setPiecePosition(this.playerId, this.id, newPosition);
    }
    // Piece.js
incrementPosition(diceValue, board, game) {
    let moveBy = diceValue;
    console.log("Old position: " + this.position);
    console.log("Move by: " + moveBy);

    const interval = setInterval(() => {
        this.position = this.getNextPosition();
        UI.setPiecePosition(this.playerId, this.id, this.position);
        moveBy--;

        if (moveBy === 0) {
            clearInterval(interval);

            // Update piece status if reached home
            if (this.position === HOME_POSITIONS[this.playerId]) {
                game.state = STATE.DICE_NOT_ROLLED;
                this.isHome = true;
            }

            // Check win condition after any move completion
            console.log("Final home position coordinates:", COORDINATES_MAP[HOME_POSITIONS.P1]);
            if (board.players[this.playerId].checkAllPiecesInHome()) {
                
                alert(`Player ${this.playerId} wins!`);
                game.resetGame();
                return;
            }

            const isKill = board.checkForKill(this.playerId, this.id);

            if (isKill || diceValue === 6) {
                game.state = STATE.DICE_NOT_ROLLED;
                return;
            }

            game.incrementTurn();
        }
    }, 200);
}





    getNextPosition() {
        if (this.position === TURNING_POINTS[this.playerId]) {
            return HOME_ENTRANCE[this.playerId][0];
        } else if (this.position === 51) {
            return 0;
        }
        return this.position + 1;
    }
}
