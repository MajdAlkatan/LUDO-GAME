// Player.js
import { Piece } from './Piece.js';
import { HOME_POSITIONS ,BASE_POSITIONS, START_POSITIONS } from './constants.js';

export class Player {
    id;
    isComputer;
    pieces;

    constructor(id, isComputer = false) {
        this.id = id;
        this.isComputer = isComputer;
        this.pieces = [0, 1, 2, 3].map(pieceId => new Piece(this.id, pieceId));
    }

    resetPieces() {
        this.pieces.forEach(piece => piece.reset());
    }
    getPieceStates() {
        return this.pieces.map(piece => ({
            position: piece.position,
            isAtBase: piece.isAtBase(),
            isHome: piece.position === HOME_POSITIONS[this.id]
        }));
    }
    getPiece(pieceId) {
        return this.pieces[pieceId];
    }

    getEligiblePieces(diceValue) {
        return this.pieces
            .filter(piece => piece.isEligibleToMove(diceValue))
            .map(piece => piece.id);
    }

    movePieceToStart(pieceId) {
        const piece = this.getPiece(pieceId);
        piece.setPosition(START_POSITIONS[this.id]);
    }

    movePieceBy(pieceId, diceValue, board, game) {
        const piece = this.getPiece(pieceId);
        piece.incrementPosition(diceValue, board, game);
    }
    checkAllPiecesInHome() {
        return this.pieces.every(piece => piece.position === HOME_POSITIONS[this.id]);
    }
    
}