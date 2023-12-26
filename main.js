/*
 * A complete tic-tac-toe widget, using JQuery.  Just include this
 * script in a browser page and play.  A tic-tac-toe game will be
 * included as a child element of the element with id "tictactoe".
 * If the page has no such element, it will just be added at the end
 * of the body.
 */
$(function () {
  const GAME_ID = "TIC_TAC_TOE_GAME";
  const btnStartGame = $("#start-game-btn");
  const btnPlayAgain = $("#play-again-btn");
  const pGamesPlayed = $("#games-played-counter");
  const toast = $(".toast");
  const squares = [];
  const SIZE = 3;
  const EMPTY = "&nbsp;";
  let board;
  let score;
  let moves;
  let turn = "X";
  /*
   * To determine a win condition, each square is "tagged" from left
   * to right, top to bottom, with successive powers of 2.  Each cell
   * thus represents an individual bit in a 9-bit string, and a
   * player's squares at any given time can be represented as a
   * unique 9-bit value. A winner can thus be easily determined by
   * checking whether the player's current 9 bits have covered any
   * of the eight "three-in-a-row" combinations.
   *
   *     273                 84
   *        \               /
   *          1 |   2 |   4  = 7
   *       -----+-----+-----
   *          8 |  16 |  32  = 56
   *       -----+-----+-----
   *         64 | 128 | 256  = 448
   *       =================
   *         73   146   292
   *
   */
  (wins = [7, 56, 448, 73, 146, 292, 273, 84]),
    /*
     * Clears the score and move count, erases the board, and makes it
     * X's turn.
     */
    (startNewGame = function () {
      turn = "X";
      score = {
        X: 0,
        O: 0,
      };
      moves = 0;

      setCurrPlayer();

      squares.forEach(function (square) {
        square.html(EMPTY);
      });
    }),
    /*
     * Returns whether the given score is a winning score.
     */
    (win = function (score) {
      for (let i = 0; i < wins.length; i += 1) {
        if ((wins[i] & score) === wins[i]) {
          return true;
        }
      }
      return false;
    }),
    /*
     * Sets the clicked-on square to the current player's mark,
     * then checks for a win or cats game.  Also changes the
     * current player.
     */
    (set = function () {
      if ($(this).html() !== EMPTY) {
        return;
      }

      $(this).html(turn);

      moves += 1;
      score[turn] += $(this)[0].indicator;

      if (win(score[turn])) {
        toast.addClass("show");
        toast.html(`<div class='toast-body'>${turn} wins the game!</div>`);
        board.addClass("pe-none");
        btnPlayAgain.removeClass("d-none");

        saveStats();
        pGamesPlayed.text(`Games played: ${getGamesPlayed()}`);
      } else if (moves === SIZE * SIZE) {
        toast.addClass("show");
        toast.html(`<div class='toast-body'>Draw!</div>`);
        board.addClass("pe-none");
        btnPlayAgain.removeClass("d-none");

        saveStats();
        pGamesPlayed.text(`Games played: ${getGamesPlayed()}`);
      } else {
        turn = turn === "X" ? "O" : "X";
      }

      setCurrPlayer();
    }),
    /*
     * Creates and attaches the DOM elements for the board as an
     * HTML table, assigns the indicators for each cell, and starts
     * a new game.
     */
    (play = function () {
      board = $(
        "<table class='table-bordered mx-auto user-select-none'><tbody></tbody></table>"
      );
      let indicator = 1;

      for (let i = 0; i < SIZE; i += 1) {
        const row = $("<tr></tr>");

        board.append(row);

        for (let j = 0; j < SIZE; j += 1) {
          const cell = $(
            "<td height=100 width=100 class='text-center fw-semibold h2'></td>"
          );
          cell[0].indicator = indicator;
          cell.click(set);
          row.append(cell);
          squares.push(cell);
          indicator += indicator;
        }
      }

      // Attach under tictactoe if present, otherwise to body.
      $(document.getElementById("tictactoe") || document.body).append(board);

      // Remove play button once games starts
      btnStartGame.on("click", () => {
        btnStartGame.addClass("d-none");
        $("#curr-player").removeClass("d-none");
        $("#tictactoe").removeClass("d-none");
      });

      // Starts a new game
      $("#play-again-btn").on("click", () => {
        toast.removeClass("show");
        board.removeClass("pe-none");
        btnPlayAgain.addClass("d-none");
        startNewGame();
      });

      startNewGame();
    });

  setCurrPlayer = function () {
    $("#curr-player").text(`Current player: ${turn}`);
  };

  // Saves the number of games played locally
  saveStats = function () {
    let stats = getStats();

    if (!stats) {
      stats = {
        gamesPlayed: 1,
      };
    } else {
      stats.gamesPlayed += 1;
    }

    localStorage.setItem(GAME_ID, JSON.stringify(stats));
  };

  // Gets the game data from localStorage
  getStats = function () {
    return JSON.parse(localStorage.getItem(GAME_ID));
  };

  // Gets the number of games played from localStorage
  getGamesPlayed = function () {
    const stats = getStats();
    return stats?.gamesPlayed ?? 0;
  };

  pGamesPlayed.text(`Games played: ${getGamesPlayed()}`);
  play();
});
