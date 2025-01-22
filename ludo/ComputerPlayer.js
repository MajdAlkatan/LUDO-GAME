// import { Player } from './Player.js';
// import { PLAYERS, HOME_POSITIONS, BASE_POSITIONS } from './constants.js';

// export class ComputerPlayer extends Player {
//     constructor(id) {
//         super(id);
//     }

//     decideMove(board, diceValue) {
//         const bestMove = this.expectiminimax(board, diceValue, 2, true);
//         return bestMove?.pieceId ?? null;
//     }

//     expectiminimax(board, diceValue, depth, isMaximizing) {
//         if (depth === 0) return { score: this.evaluate(board) };

//         const playerId = isMaximizing ? this.id : PLAYERS.find(p => p !== this.id) || 'P1';
//         const eligiblePieces = board.getEligiblePieces(playerId, diceValue);

//         if (!eligiblePieces.length) return { score: this.evaluate(board) };

//         let best = { score: isMaximizing ? -Infinity : Infinity };

//         for (const pieceId of eligiblePieces) {
//             const simulated = board.clone();
//             simulated.simulateMove(playerId, pieceId, diceValue);
            
//             const result = this.expectiminimax(simulated, diceValue, depth-1, !isMaximizing);
            
//             if ((isMaximizing && result.score > best.score) || 
//                 (!isMaximizing && result.score < best.score)) {
//                 best = { score: result.score, pieceId };
//             }
//         }

//         return best;
//     }

//     evaluate(board) {
//         let score = 0;
//         Object.entries(board.players).forEach(([id, player]) => {
//             player.pieces.forEach(piece => {
//                 const mult = id === this.id ? 1 : -1;
//                 if (piece.position === HOME_POSITIONS[id]) score += 50 * mult;
//                 else if (!BASE_POSITIONS[id].includes(piece.position)) score += piece.position * mult;
//             });
//         });
//         return score;
//     }

//     clone() {
//         const cloned = new ComputerPlayer(this.id);
//         cloned.pieces = this.pieces.map((p, idx) => {
//             const piece = p.clone();
//             piece.id = idx;
//             piece.playerId = this.id;
//             return piece;
//         });
//         return cloned;
//     }
// }