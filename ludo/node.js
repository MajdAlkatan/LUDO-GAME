
class AIDecisionNode {
    static nodeNumber = 0;

    constructor(gameState, depth, isComputerTurn, parentNode = null) {
        this.gameState = gameState;
        this.depth = depth;
        this.isComputerTurn = isComputerTurn;
        this.parentNode = parentNode;
        AIDecisionNode.nodeNumber++;
    }
}
export { AIDecisionNode }