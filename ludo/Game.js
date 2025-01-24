
import {
    STATE,
    PLAYERS,
    AI_CONFIG,
    HOME_ENTRANCE,
    SAFE_POSITIONS,
    HOME_POSITIONS,
    TURNING_POINTS,
    START_POSITIONS,
    BASE_POSITIONS

} from './constants.js';
import { UI } from './UI.js';
import { Board } from './Board.js';

import GameState from './State.js';
import { AIDecisionNode } from './node.js';



export class Game {
    board;
    _diceValue;
    _turn;
    _state;


    constructor() {
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

        console.log("Evaluating state:");
        console.log("\n--------------------------------");

        console.log(`Computer pieces: ${JSON.stringify(computerPieces)}`);
        console.log("\n--------------------------------");

        console.log(`Human pieces: ${JSON.stringify(humanPieces)}`);
        console.log("\n--------------------------------");

        const distanceToHome = (player, position) => {
            const turningPoint = TURNING_POINTS[player];
            if (position > turningPoint) {
                return 52 - Math.abs(turningPoint - position);
            }
            else {
                return (turningPoint + 6) - position;
            }
        };

        computerPieces.forEach(p => {
            if (!p.isHome) {
                const distance = distanceToHome('P2', p.position);
                score += (52 - distance) * 10;
                if (SAFE_POSITIONS.includes(p.position)) {
                    score += 50;
                }
            } else {
                score += 1000;
            }
        });

        humanPieces.forEach(p => {
            if (!p.isHome) {
                const distance = distanceToHome('P1', p.position);
                score -= (52 - distance) * 8;
                if (SAFE_POSITIONS.includes(p.position)) {
                    score -= 50;
                }
            }
            else {
                score -= 500;
            }
        });

        const nearHomeBonus = (pieces, player) => {
            const homeEntrance = HOME_ENTRANCE[player];
            return pieces.reduce((bonus, p) => {
                if (homeEntrance.includes(p.position)) {
                    bonus += 100;
                }
                return bonus;
            }, 0);
        };

        score += nearHomeBonus(computerPieces, 'P2');
        score -= nearHomeBonus(humanPieces, 'P1');

        console.log(`Evaluation score: ${score}`);
        console.log("\n--------------------------------");

        return score;
    }

    /**
     * 
     * @param {GameState} state 
     */
    stateIsOver(state) {
        let isOver = false;
        let count = 0;
        state.boardState.P1.forEach(
            piece => {
                if (piece.isHome) {
                    count++;
                    if (count === 4) {
                        isOver = true;
                    }
                }
            });
        count = 0;
        state.boardState.P2.forEach(
            piece => {
                if (piece.isHome) {
                    count++;
                    if (count === 4) {
                        isOver = true;
                    }
                }
            });
        return isOver;
    }

    /**
     * 
     * @param {AIDecisionNode} node 
     * @returns 
     */
    expectimax(node) {
        console.log(`Processing node at depth ${node.depth}, isComputerTurn: ${node.isComputerTurn}`);
        console.log("\n--------------------------------");

        if ((node.depth >= AI_CONFIG.SEARCH_DEPTH) || this.stateIsOver(node.gameState)) {
            let result = this.evaluateState(node.gameState);
            console.log(`Leaf node reached. Evaluation result: ${result}`);
            console.log("\n--------------------------------");

            return result;
        }

        if (node.isComputerTurn) {
            let maxValue = -Infinity;
            const moves = this.getPossibleMoves(node.gameState, 'P2');


            // moves.slice(0, AI_CONFIG.BRANCH_DEPTH)
            moves.forEach(move => {

                const newState = this.simulateMove(node.gameState, move, 'P2');

                let value = this.chanceMove(
                    new AIDecisionNode(newState, node.depth + 1, false, node)
                );
                console.log(`Computer move: ${JSON.stringify(move)}, Value: ${value}`);
                console.log("\n--------------------------------");

                maxValue = Math.max(maxValue, value);

            });
            console.log(`Max value for computer: ${maxValue}`);
            console.log("\n--------------------------------");

            return maxValue;
        } else {
            let minValue = Infinity;
            const moves = this.getPossibleMoves(node.gameState, 'P1');
            moves.forEach(move => {
                const newState = this.simulateMove(node.gameState, move, 'P1');
                let value = this.chanceMove(
                    new AIDecisionNode(newState, node.depth + 1, true, node)
                );

                console.log(`Human move: ${JSON.stringify(move)}, Value: ${value}`);
                console.log("\n--------------------------------");


                minValue = Math.min(minValue, value);
            });
            console.log(`Min value for human: ${minValue}`);
            console.log("\n--------------------------------");


            return minValue;
        }
    }

    /**
    * @param {AIDecisionNode} node
    */
    chanceMove(node) {

        let expectedValue = 0;
        AI_CONFIG.ROLL_PROBABILITIES.forEach(
            (possibility, idx) => {
                let state = node.gameState.clone();
                const diceValue = idx + 1;
                state.diceValue = diceValue;

                let value = this.expectimax(
                    new AIDecisionNode(state, node.depth, node.isComputerTurn, node)
                );
                console.log(`Dice roll: ${diceValue}, Probability: ${possibility}, Value: ${value}`);
                console.log("\n--------------------------------");
                if (Number.isFinite(value)) {
                    expectedValue += value * possibility;
                }
            }
        )
        console.log(`Expected value: ${expectedValue}`);
        console.log("\n--------------------------------");

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

    getBestComputerMove() {
        // returns the current game state
        const originalState = this.getCurrentGameState();
        // returns all possible movable pieces for computer
        const possibleMoves = this.getPossibleMoves(originalState, 'P2');


        // Return null if no valid moves
        if (!possibleMoves || possibleMoves.length === 0) {
            console.log("No valid moves for computer.");
            console.log("\n--------------------------------");

            return null;
        }

        let bestMove = possibleMoves[0];
        let bestValue = -Infinity;

        possibleMoves.forEach(move => {
            const newState = this.simulateMove(originalState, move, 'P2');
            const node = new AIDecisionNode(newState, 0, false);
            const value = this.expectimax(node);
            console.log(`Evaluating move: ${move}, Value: ${value}`);
            console.log("\n--------------------------------");


            if (value > bestValue) {
                bestValue = value;
                bestMove = move;
            }
        });

        console.log("best move value  " + bestValue);
        console.log("\n--------------------------------");
        console.log("\n--------------------------------");

        console.log("node number :", AIDecisionNode.nodeNumber);
        console.log("\n--------------------------------");
        console.log("\n--------------------------------");


        AIDecisionNode.nodeNumber = 0;
        console.log("\n--------------------------------");
        console.log("\n--------------------------------");

        console.log(`Best move: ${bestMove}, Best value: ${bestValue}`);
        console.log("\n--------------------------------");
        console.log("\n--------------------------------");


        return bestMove;
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
    simulateMove(originalState, pieceId, player) {
        const newState = originalState.clone();
        const piece = newState.boardState[player][pieceId];

        if (piece.isAtBase) {
            piece.position = START_POSITIONS[player];
            piece.isAtBase = false;
        } else {
            let newPosition = piece.position + newState.diceValue;
            if (newPosition > 51) {
                newPosition = newPosition - 52;
            }
            if (newPosition > TURNING_POINTS[player]) {
                let diff = newPosition - TURNING_POINTS[player]
                newPosition = HOME_ENTRANCE[player][0] + diff;
            }
            piece.position = Math.min(
                newPosition,
                HOME_POSITIONS[player]
            );
            if (piece.position === HOME_POSITIONS[player])
                piece.isHome = true;

        }
        this.checkForKill(newState, piece, player);

        return newState;
    }

    /**
     * 
     * @param {GameState} state 
     * @param {*} piece 
     */
    checkForKill(state, piece, player) {
        let piecePos = piece.position;
        let opponent = 'P1';
        if (player === 'P1') {
            opponent = 'P2';
        }
        else {
            opponent = 'P1';
        }
        let piecesInSamePosition = [];
        state.boardState[opponent].forEach(
            (piece) => {
                if ((piece.position === piecePos) && !SAFE_POSITIONS.includes(piece.position)) {
                    piecesInSamePosition.push(piece);
                }
            }
        )
        if (piecesInSamePosition.length !== 1) {
            return false;
        }
        let killedPiece = piecesInSamePosition[0];
        killedPiece.position = BASE_POSITIONS[opponent][killedPiece.id]
        return true;
    }

    listenDiceClick() {
        UI.listenDiceClick(this.onDiceClick.bind(this));
    }

    onDiceClick() {
        const diceElement = document.querySelector('.dice-value');
        const DICE_ANIMATION_DURATION = 1000; //ms

        UI.disableDice();
        // logic of dice rolling  
        
            // Calculate the dice value based on the defined probability distribution
            const rollProbabilities = AI_CONFIG.ROLL_PROBABILITIES; // [1/6, 1/6, 1/6, 1/6, 1/6, 1/6]
            const cumulativeProbabilities = rollProbabilities.reduce((acc, prob, index) => {
                acc.push((acc[index - 1] || 0) + prob);
                return acc;
            }, []);
        
            const randomValue = Math.random();
            this.diceValue = cumulativeProbabilities.findIndex(cumProb => randomValue < cumProb) + 1;
        
        // Slot machine animation
        let startTime = Date.now();
        const animateDice = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / DICE_ANIMATION_DURATION;

            if (progress < 1) {
                // Generate random value during animation
                const tempValue = Math.floor(Math.random() * 6) + 1;
                diceElement.textContent = tempValue;
                requestAnimationFrame(animateDice);
            } else {
                // Set final value
                diceElement.textContent = this.diceValue;
                diceElement.classList.remove('rolling');
                UI.enableDice();

                // Handle dice logic
                this.handleDiceResult();
            }
        };

        requestAnimationFrame(animateDice);
    }

    handleDiceResult() {
        console.log(`Final dice value: ${this.diceValue}`);

        if (this.diceValue === 6) {
            this.consecutiveSixes = (this.consecutiveSixes || 0) + 1;
        } else {
            this.consecutiveSixes = 0;
        }

        if (this.consecutiveSixes === 3) {
            console.log("Three 6s! Skipping turn.");
            this.consecutiveSixes = 0;
            this.incrementTurn();
            return;
        }

        this.state = STATE.DICE_ROLLED;
        this.checkForEligiblePieces();
    }


    incrementTurn() {
        this.turn = this.turn === 0 ? 1 : 0; // Switch turns
        this.state = STATE.DICE_NOT_ROLLED; // Reset state
        console.log(`Turn changed! It's now player ${this.turn === 0 ? 'P1' : 'P2'}'s turn.`);
    }



    checkForEligiblePieces() {

        const playerId = PLAYERS[this.turn]; // 'P1' أو 'P2' يعني هون 
        const player = this.board.players[playerId]; // P1 أو P2 عم جيب الاوبجيكت لاعب يلي هو يا 
        const eligiblePieces = this.board.getEligiblePieces(playerId, this.diceValue);

        if (eligiblePieces.length) {
            if (player.isComputer) {
                setTimeout(() => {
                    const pieceId = this.getBestComputerMove();
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