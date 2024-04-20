"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white",
            },
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black",
            },
        }));
    }
    makeMove(socket, move) {
        // Validate move using ZOD
        // Means player 1 is trying to make a move
        // if (this.moveCount % 2 === 0 && socket !== this.player2) {
        //   console.log("Means player 1 is trying to make a move");
        //   return;
        // }
        // // Means player 2 is trying to make a move
        // if (this.moveCount % 2 === 0 && socket !== this.player1) {
        //   console.log("Means player 2 is trying to make a move");
        //   return;
        // }
        try {
            this.board.move(move);
        }
        catch (error) {
            console.log(error);
            return;
        }
        // Check if game if over?
        if (this.board.isGameOver()) {
            // Send the game over message to both players
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
            return;
        }
        // If game is not over tell other player that other player had made the move
        // now it's thier turn
        if (this.moveCount % 2 === 0) {
            console.log("Player 2");
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
        else {
            console.log("Player 1");
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
        this.moveCount++;
    }
}
exports.Game = Game;
