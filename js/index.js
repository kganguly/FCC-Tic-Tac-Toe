var debug = true;
var play = true;

var TicTacToe = (function () {
    function TicTacToe() {

        var board = null;
        this.cols = 3;
        var isPlayerX = null;
        var isPlayerTurn = null;
        var winner = false;
        var numMoves = 0;

        this.resetBoard = function () {
            board = [];
            for (var i = 0; i < this.cols; i++) {
                board[i] = [];
            }
            this.clearBoard();
        }
        this.pickSide = function () {
            this.displayChoicePrompt();
        }
        this.displayChoicePrompt = function () {
            $("#choicePrompt").css("display", "block");
            $("#choicePrompt").animate({
                opacity: 1
            }, 500);
        }
        this.playerChoice = function (choice) {
            console.log("Player chooses: ", choice);
            isPlayerX = choice == null || choice.trim().toUpperCase() === "X"; //handle cancel
            isPlayerTurn = isPlayerX;
        }
        this.play = function () {
            console.log(this.printBoard());
            winner = this.checkForWinner();
            if (winner || numMoves === this.cols * this.cols) {
                this.endGame();
            } else {
                if (isPlayerTurn) this.givePlayerTurn();
                else this.computerTurn();
            }
        }
        this.givePlayerTurn = function () {
            this.displayPrompt("Your turn!", function () {
                locked = false;
            });
        }
        this.playerTurn = function (x, y) {
            if (!isPlayerTurn || locked) return;
            var mark = isPlayerX ? "X" : "O";
            board[x][y] = mark;
            var bCellId = "#bCell-" + x + "-" + y;
            $(bCellId).html(mark);
            $(bCellId).addClass(isPlayerX ? "blue" : "red");
            numMoves++;
            isPlayerTurn = false;
            locked = true;
            this.play();
        }

        function getRandomMove() {
            var isValid = false;
            while (!isValid) {
                var trial = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
                if (board[trial[0]][trial[1]] == null) isValid = true;
            }
            return trial;
        }
        this.computerTurn = function () {
            function makeMove() {
                var move = getRandomMove();
                var mark = isPlayerX ? "O" : "X";
                board[move[0]][move[1]] = mark;
                var bCellId = "#bCell-" + move[0] + "-" + move[1];
                $(bCellId).html(mark);
                $(bCellId).addClass(isPlayerX ? "red" : "blue");
                numMoves++;
                isPlayerTurn = true;
                game.play();
            }
            isPlayerTurn = false;
            setTimeout(makeMove, 1000);
        }
        this.checkForWinner = function () {
            for (var i = 0; i < this.cols; i++) {
                if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) return board[i][0];
            }
            for (var i = 0; i < this.cols; i++) {
                if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) return board[0][i];
            }
            if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) return board[0][0];
            if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) return board[0][2];
            return false;
        }
        this.declareWinner = function () {
            console.log("WINNER IS: ", winner);
            if (winner) {
                this.displayPrompt("The winner is " + winner + "!", this.play);
            } else {
                this.displayPrompt("The game ended in a draw.", this.play);
            }

        }
        this.endGame = function () {
            this.declareWinner();
            this.reset();
            // this.play();
        }
        this.reset = function () {
            this.resetBoard();
            winner = false;
            isPlayerTurn = isPlayerX;
            numMoves = 0;
        }
        this.startGame = function () {
            this.resetBoard();
            if (play) {
                this.pickSide();
            }
        }
        this.clearBoard = function () {
            for (var i = 0; i < this.cols; i++) {
                for (var j = 0; j < this.cols; j++) {
                    $("#bCell-" + i + "-" + j).html("");
                }
            }
        }
        this.updateBoard = function () {
            for (var i = 0; i < this.cols; i++) {
                for (var j = 0; j < this.cols; j++) {
                    var mark = board[i][j]
                    if (mark) $("bCell-" + i + "-" + j).html(mark);
                }
            }
        }
        this.printBoard = function () {
            var output = "";
            for (var i = 0; i < this.cols; i++) {
                for (var j = 0; j < this.cols; j++) {
                    output += board[i][j] + " "
                }
                output += "<br>\n";
            }
            return output;
        }
        this.displayPrompt = function (prompt, nextGameAction) {
            $("#userPrompt>button").off("click");
            $("#userPrompt>button").on("click", function () {
                $("#userPrompt").animate({
                    opacity: 0
                }, 300, function () {
                    $("#userPrompt").css("display", "none");
                    if (nextGameAction) nextGameAction.apply(game);
                });
            });
            $("#userPrompt>.modalInfo").html(prompt);
            $("#userPrompt").css("display", "block");
            $("#userPrompt").animate({
                opacity: 1
            }, 500);
        }
    }

    var instance;
    return {
        getInstance: function () {
            if (instance === undefined) {
                instance = new TicTacToe();
                // Hide the constructor so the returned objected can't be new'd...
                instance.constructor = null;
            }
            return instance;
        }
    };

})();

var game = TicTacToe.getInstance();

$(document).ready(function () {
    setDisplay()
    setListeners();
    game.startGame();
});

function setDisplay() {
    var bHtml = "";

    for (var i = 0; i < game.cols; i++) {
        bHtml += "<div class='bRow' id='bRow-" + i + "'>"
        for (var j = 0; j < game.cols; j++) {
            bHtml += "<div class='bCell' id='bCell-" + i + "-" + j + "' onclick='game.playerTurn(" + i + ", " + j + ")'></div>"
        }
        bHtml += "</div>"
    }
    $("#board").html(bHtml);
}

function setListeners() {
    $("#xButton").on("click", function () {
        $("#choicePrompt").animate({
            opacity: 0
        }, 300, function () {
            $("#choicePrompt").css("display", "none");
            game.playerChoice("X");
            game.play();
        });
    });
    $("#oButton").on("click", function () {
        $("#choicePrompt").animate({
            opacity: 0
        }, 300, function () {
            $("#choicePrompt").css("display", "none");
            game.playerChoice("O");
            game.play();
        });
    });
}