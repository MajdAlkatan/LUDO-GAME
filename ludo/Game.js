
import { 
    STATE, 
    PLAYERS, 
    AI_CONFIG,
    HOME_ENTRANCE ,
    SAFE_POSITIONS,
    HOME_POSITIONS,
    START_POSITIONS, 

} from './constants.js';
import { UI } from './UI.js';
import { Board } from './Board.js';

import GameState from './State.js';
import AIDecisionNode from './node.js';



export class Game {
    board;
    _diceValue;
    _turn;
    _state;

    constructor() {
        console.log('Hello World! Lets play Ludo!');
        this.board = new Board();
        this.listenDiceClick();
        this.listenResetClick();
        this.listenPieceClick();
        this.resetGame();
    }


    get diceValue() {
        return this._diceValue;
    }
    set diceValue(value) {
        this._diceValue = value;
        UI.setDiceValue(value);
    }

    get turn() {
        return this._turn;
    }
    set turn(value) {
        this._turn = value;
        UI.setTurn(value);
    }

    get state() {
        return this._state;
    }
    set state(value) {
        this._state = value;

        if (value === STATE.DICE_NOT_ROLLED) {
            UI.enableDice();
            UI.unhighlightPieces();
        } else {
            UI.disableDice();
        }
        if (this._state === STATE.DICE_NOT_ROLLED) {
            const currentPlayerId = PLAYERS[this.turn];
            const currentPlayer = this.board.players[currentPlayerId];
            if (currentPlayer?.isComputer) {
                setTimeout(() => this.onDiceClick(), 1000);
            }
        }
    }

    getCurrentGameState() {
        return new GameState(
            {
                P1: this.board.players.P1.getPieceStates(),
                P2: this.board.players.P2.getPieceStates()
            },
            this.turn,
            this.diceValue
        );
    }
    evaluateState(gameState) {
        // Computer is P2
        let score = 0;
        const computerPieces = gameState.boardState.P2;
        const humanPieces = gameState.boardState.P1;

        // Progress towards home
        computerPieces.forEach(p => {
            if (!p.isHome) {
                score += (52 - p.position) * 10; // Max 520 per piece
            } else {
                score += 1000; // Bonus for pieces in home
            }
        });

        humanPieces.forEach(p => {
            if (!p.isHome) {
                score -= (52 - p.position) * 8;
            }
        });

        computerPieces.forEach(p => {
            if (!SAFE_POSITIONS.includes(p.position) && !p.isHome) {
                score -= 50;
            }
        });

        return score;
    }
    expectimax(node) {
        if (node.depth >= AI_CONFIG.SEARCH_DEPTH) {
            return this.evaluateState(node.gameState);
        }

        if (node.isComputerTurn) {
            let maxValue = -Infinity;
            const moves = this.getPossibleMoves(node.gameState, 'P2');

            // moves.slice(0, AI_CONFIG.BRANCH_DEPTH)
            moves.forEach(move => {
                const newState = this.simulateMove(node.gameState, move);
                const value = this.chanceMove(
                    new AIDecisionNode(newState, node.depth + 1, false)
                );
                maxValue = Math.max(maxValue, value);
            });

            return maxValue;
        } else {
            let minValue = Infinity;
            const moves = this.getPossibleMoves(node.gameState, 'P1');
            moves.forEach(move => {
                const newState = this.simulateMove(node.gameState, move);
                const value = this.chanceMove(
                    new AIDecisionNode(newState, node.depth + 1, true)
                );
                minValue = Math.min(minValue, value);
            });

            return minValue;
        }
    }

    /**
    * @param {AIDecisionNode} node
    */
    chanceMove(node){
        if (node.depth >= AI_CONFIG.SEARCH_DEPTH) {
            return this.evaluateState(node.gameState);
        }
        let expectedValue = 0;
        AI_CONFIG.ROLL_PROBABILITIES.forEach(
            (possibility, idx) => {
                let value = 0;
                if (node.isComputerTurn){
                    let state = node.gameState.clone();
                    state.diceValue = idx;
                    value = this.expectimax(new AIDecisionNode(state, node.depth, true));
                }
                else
                {
                    let state = node.gameState.clone();
                    state.diceValue = idx;
                    value = this.expectimax(new AIDecisionNode(state, node.depth, false));
                }
                expectedValue += possibility * value;
            }
        )
        return expectedValue;
    }
    getPossibleMoves(gameState, playerId) {
        const currentPositions = gameState.boardState[playerId];
        return currentPositions
            .map((piece, idx) => ({
                pieceId: idx,
                eligible: this.isPieceEligible(piece, gameState.diceValue)
            }))
            .filter(p => p.eligible)
            .map(p => p.pieceId);
    }
    isPieceEligible(pieceState, diceValue) {
 
        if (pieceState.isHome) return false;
        if (pieceState.isAtBase && diceValue !== 6) return false;
        
        const playerId = 'P2';
        const homeEntrance = HOME_ENTRANCE[playerId];
        if (homeEntrance.includes(pieceState.position)) {
            const remainingSteps = HOME_POSITIONS[playerId] - pieceState.position;
            if (diceValue > remainingSteps) return false;
        }
        
        return true;
    }
    simulateMove(originalState, pieceId) {
        const newState = originalState.clone();
        const piece = newState.boardState.P2[pieceId];


        if (piece.isAtBase) {
            piece.position = START_POSITIONS.P2;
        } else {
            piece.position = Math.min(
                piece.position + newState.diceValue,
                HOME_POSITIONS.P2
            );
        }

        return newState;
    }
    getBestComputerMove() {
        // returns the current game state
        const originalState = this.getCurrentGameState();
        // returns all possible movable pieces for computer
        const possibleMoves = this.getPossibleMoves(originalState, 'P2');
    
        // Return null if no valid moves
        if (!possibleMoves || possibleMoves.length === 0) {
            return null;
        }
    
        let bestMove = possibleMoves[0];
        let bestValue = -Infinity;
    
        possibleMoves.forEach(move => {
            const newState = this.simulateMove(originalState, move);
            const node = new AIDecisionNode(newState, 0, false);
            const value = this.expectimax(node);
    
            if (value > bestValue) {
                bestValue = value;
                bestMove = move;
            }
        });
    
        return bestMove;
    }

    listenDiceClick() {
        UI.listenDiceClick(this.onDiceClick.bind(this));
    }

    onDiceClick() {
        console.log('dice clicked!');
        this.diceValue = 1 + Math.floor(Math.random() * 6);
        this.state = STATE.DICE_ROLLED;

        this.checkForEligiblePieces();
    }

    checkForEligiblePieces() {
        const playerId = PLAYERS[this.turn];
        const player = this.board.players[playerId];
        const eligiblePieces = this.board.getEligiblePieces(playerId, this.diceValue);
    
        if (eligiblePieces.length) {
            if (player.isComputer) {
                setTimeout(() => {
                    const pieceId = this.getBestComputerMove();
                    // Add proper validation
                    if (pieceId !== null && pieceId >= 0 && pieceId <= 3) {
                        this.board.handlePieceClick(playerId, pieceId, this.diceValue, this);
                    } else {
                        this.incrementTurn();
                    }
                }, 1000);
            } else {
                UI.highlightPieces(playerId, eligiblePieces);
            }
        } else {
            this.incrementTurn();
        }
    }

    incrementTurn() {
        this.turn = this.turn === 0 ? 1 : 0;
        this.state = STATE.DICE_NOT_ROLLED;
    }

    listenResetClick() {
        UI.listenResetClick(this.resetGame.bind(this));
    }

    resetGame() {
        console.log('reset game');
        this.board.resetPositions();
        this.turn = 0;
        this.state = STATE.DICE_NOT_ROLLED;
    }

    listenPieceClick() {
        UI.listenPieceClick(this.onPieceClick.bind(this));
    }

    onPieceClick(event) {
        const target = event.target;

        if (!target.classList.contains('player-piece') || !target.classList.contains('highlight')) {
            return;
        }
        console.log('piece clicked');

        const player = target.getAttribute('player-id');
        const piece = target.getAttribute('piece');
        this.board.handlePieceClick(player, piece, this.diceValue, this);
    }
}