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
        }
        this.pickSide = function () {
            var playerChoice = prompt('Would you like to play as "X"s or "O"s', "X");
            isPlayerX = playerChoice === null || playerChoice.trim().toUpperCase() === "X"; //handle cancel
            isPlayerTurn = isPlayerX;
        }
        this.play = function () {
            while (!winner && numMoves < this.cols * this.cols) {
                if (isPlayerTurn) this.playerTurn();
                else this.computerTurn();
                console.log(this.printBoard());
                this.updateBoard();
                winner = this.checkForWinner()
                isPlayerTurn = isPlayerTurn ? false : true;
            }
            this.endGame();
        }
        this.playerTurn = function () {
            sleep(1000);
            var move = getRandomMove();
            var mark = isPlayerX ? "X" : "O";
            board[move[0]][move[1]] = mark;
            $("#bCell-" + move[0] + "-" + move[1]).html(mark);
            //board[x][y] = isPlayerX ? "X" : "O";
            numMoves++;
        }

        function getRandomMove() {
            var isValid = false;
            while (!isValid) {
                var trial = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
                if (board[trial[0]][trial[1]] == null) isValid = true;
            }
            return trial;
        }

        function sleep(ms) {
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > ms) {
                    break;
                }
            }
        }
        this.computerTurn = function () {
            sleep(1000);
            var move = getRandomMove();
            var mark = isPlayerX ? "O" : "X";
            board[move[0]][move[1]] = mark;
            $("#bCell-" + move[0] + "-" + move[1]).html(mark);
            numMoves++;
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
            if (winner) {
                alert("The winner is " + winner + "!");
            } else {
                alert("The game ended in a draw.");
            }

        }
        this.endGame = function () {
            this.declareWinner();
            this.reset();
            //prompt(); //listener on play again to this.play() and pickside()
        }
        this.reset = function () {
            this.resetBoard();
            winner = false;
            isPlayerTurn = null;
            isPlayerX = null;
            numMoves = 0;
        }
        this.startGame = function () {
            this.resetBoard();
            if (play) {
                this.pickSide();
                this.play(); //DOESN'T UNWIND?! memory issue?
            }
        }
        this.updateBoard = function () {
            //$("#banner").html(board);
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
    //setListeners();
    game.startGame();
});

function setDisplay() {
    var bHtml = "";

    for (var i = 0; i < game.cols; i++) {
        bHtml += "<div class='bRow' id='bRow-" + i + "'>"
        for (var j = 0; j < game.cols; j++) {
            bHtml += "<div class='bCell' id='bCell-" + i + "-" + j + "'></div>"
        }
        bHtml += "</div>"
    }
    $("#board").html(bHtml);
}

function setListeners() {
    $("#break .minus").click(function () {
        if (!timer.isRunning()) {
            timer.decrementBreak();
            if (!timer.sessionTimer) timer.setTime(timer.getBreak());
        }
    });
    $("#timer").click(function () {
        var alarm = timer.getAlarm();
        if (!alarm.sound.src) {
            try {
                alarm.play();
                alarm.stop();
                alarm.sound.src = alarm.src;
            } catch (err) {
                console.log(err);
            }
        }

        if (timer.isRunning()) {
            timer.stopTimer();
        } else {
            timer.startTimer();
        }
    });
}