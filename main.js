import { Game } from './ludo/Game.js';
import { UI } from './ludo/UI.js';

UI.listenStartGame(() => {
    const gameMode = document.querySelector('#game-mode').value;
    let humanPlayers, computerPlayers;

    switch (gameMode) {
        case '1h3c':
            humanPlayers = 1;
            computerPlayers = 3;
            break;
        case '2h2c':
            humanPlayers = 2;
            computerPlayers = 2;
            break;
        case '3h1c':
            humanPlayers = 3;
            computerPlayers = 1;
            break;
        case '4c':
            humanPlayers = 0;
            computerPlayers = 4;
            break;
        case '4h':
            humanPlayers = 4;
            computerPlayers = 0;
            break;
        default:
            humanPlayers = 1;
            computerPlayers = 3;
    }

    const game = new Game(humanPlayers, computerPlayers);
    document.querySelector('#settings-menu').style.display = 'none';
    document.querySelector('.ludo-container').style.display = 'block';
});