import { Player } from './Player.js';
import {STATE, BASE_POSITIONS, SAFE_POSITIONS } from './constants.js';
import { UI } from './UI.js';

export class Board {
    players;

    constructor() {
        this.players = {
            P1: new Player('P1'),
            P2: new Player('P2',true),
        };
    }

    resetPositions() {
        Object.values(this.players).forEach(player => player.resetPieces());
    }

    getEligiblePieces(playerId, diceValue) {
        return this.players[playerId].getEligiblePieces(diceValue);
    }

    handlePieceClick(playerId, pieceId, diceValue, game) {
        const player = this.players[playerId];
        
        // Validate piece ID
        if (pieceId < 0 || pieceId > 3) {
            console.error('Invalid piece ID:', pieceId);
            game.incrementTurn();
            return;
        }
    
        const piece = player.getPiece(pieceId);
    
        if (!piece) {
            console.error('Piece not found:', pieceId);
            game.incrementTurn();
            return;
        }
    
        if (piece.isAtBase()) {
            player.movePieceToStart(pieceId);
            game.state = STATE.DICE_NOT_ROLLED;
            return;
        }
    
        UI.unhighlightPieces();
        player.movePieceBy(pieceId, diceValue, this, game);
    }

    // Add this method for handling kills
    checkForKill(playerId, pieceId) {
        const currentPlayer = this.players[playerId];
        const currentPiece = currentPlayer.getPiece(pieceId);
        const currentPosition = currentPiece.position;

        const opponentId = playerId === 'P1' ? 'P2' : 'P1';
        const opponent = this.players[opponentId];

        let kill = false;

        opponent.pieces.forEach(opponentPiece => {
            if (
                opponentPiece.position === currentPosition && // Same position
                !SAFE_POSITIONS.includes(currentPosition) // Not in a safe position
            ) {
                // Move opponent's piece back to base
                opponentPiece.setPosition(BASE_POSITIONS[opponentId][opponentPiece.id]);
                kill = true;
            }
        });

        return kill;
    }
}