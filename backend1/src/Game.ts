import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private moves: string[];
  private startTime: Date;
  private moveCount = 0;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.moves = [];
    this.startTime = new Date();

    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
        },
      })
    );
  }

  makeMove(
    socket: WebSocket,
    move: {
      from: string;
      to: string;
    }
  ) {
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
    } catch (error) {
      console.log(error);
      return;
    }

    // Check if game if over?
    if (this.board.isGameOver()) {
      // Send the game over message to both players
      this.player1.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );
      this.player2.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );
      return;
    }

    // If game is not over tell other player that other player had made the move
    // now it's thier turn
    if (this.moveCount % 2 === 0) {
      console.log("Player 2");
      this.player2.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    } else {
      console.log("Player 1");
      this.player1.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    }
    this.moveCount++;
  }
}
