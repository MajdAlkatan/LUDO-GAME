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
        return new GameState(clonedBoard, this.turn, this.diceValue);
    }
}

export default GameState;