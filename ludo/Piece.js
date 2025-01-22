// Piece.js
import { STATE ,BASE_POSITIONS, HOME_POSITIONS, TURNING_POINTS, HOME_ENTRANCE, SAFE_POSITIONS } from './constants.js';
import {UI} from './UI.js'
export class Piece {
    playerId;
    id;
    position;

    constructor(playerId, id) {
        this.playerId = playerId;
        this.id = id;
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

    incrementPosition(diceValue, board, game) {
        let moveBy = diceValue;
    
        const interval = setInterval(() => {
            this.position = this.getNextPosition();
            UI.setPiecePosition(this.playerId, this.id, this.position);
            moveBy--;
    
            if (moveBy === 0) {
                clearInterval(interval);
    

                // التحقق من القتل (إذا تم قتل قطعة من الخصم)
                const isKill = board.checkForKill(this.playerId, this.id);
    
                if (isKill || diceValue === 6) {
                    game.state = STATE.DICE_NOT_ROLLED;
                    return;
                }
    
                // التحقق إذا كانت جميع القطع قد وصلت إلى المنزل
                if (board.players[this.playerId].checkAllPiecesInHome()) {  // التعديل هنا
                    alert(`Player ${this.playerId} wins!`);
                    game.resetGame();
                    return;
                }
    
                // زيادة الدور
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
