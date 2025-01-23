class GameState {
    constructor(boardState, turn, diceValue) {
        this.boardState = boardState;
        this.turn = turn;
        this.diceValue = diceValue;
        this.score = null;
    }

    clone() {
        const clonedBoard = {
            P1: [...this.boardState.P1],
            P2: [...this.boardState.P2]
        };
        this.cloneBoard(clonedBoard);
        return new GameState(clonedBoard, this.turn, this.diceValue);
    }
    cloneBoard(board) {
        board.P1.map(piece => {
            return {
                position: piece.position,
                isAtBase: piece.isAtBase,
                isHome: piece.isHome,
                playerId: piece.playerId,
                id: piece.id,
            };
        });
        board.P2.map(piece => {
            return {
                position: piece.position,
                isAtBase: piece.isAtBase,
                isHome: piece.isHome,
                playerId: piece.playerId,
                id: piece.id,
            };
        });
    }
}

export default GameState;