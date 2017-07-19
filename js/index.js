var debug = true;

var TicTacToe = (function () {
    function TicTacToe() {

        var board = this.resetBoard();
        var cols = 3;
        var isPlayerX = null;
        var isPlayerTurn = null;

        this.resetBoard = function () {
            board = [];
            for (var i = 0; i < cols; i++) {
                board[i] = [];
            }
        }
        this.pickSide = function () {
            var playerChoice = prompt('Would you like to play as "X"s or "O"s', "X");
            isPlayerX = playerChoice.trim().toUpperCase() === "X" || playerChoice === null; //handle cancel
            isPlayerTurn = isPlayerX;
        }
        this.play = function () {
            while (!winner) {
                if (isPlayerTurn) this.playerTurn();
                else this.computerTurn();
                winner = this.checkForWinner()
                isPlayerTurn = isPlayerTurn ? false : true;
            }
            this.endGame();
        }
        this.playerTurn = function ([x, y]) {
            board[x][y] = isPlayerX ? "X" : "O";
        }
        this.computerTurn = function () {
            var isValid = false;
            while (!isValid) {
                var trial = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
                if (board[trial[0]][trial[1]] == null) isValid = true;
            }
            board[trial[0]][trial[1]] = isPlayerX ? "O" : "X";
        }
        this.checkForWinner = function () {
            for (var i = 0; i < cols; i++) {
                if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) return board[i][0];
            }
            for (var i = 0; i < cols; i++) {
                if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) return board[0][i];
            }
            if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) return board[0][0];
            if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) return board[0][2];
            return false;
        }
        this.endGame = function () {
            this.reset();
            prompt(); //listener on play again to this.play() and pickside()
        }
        this.reset = function () {
            this.resetBoard();
            winner = false;
            isPlayerTurn = null;
            isPlayerX = null;
        }
        this.startGame = function () {
            this.pickSide();
            this.play(); //DOESN'T UNWIND?! memory issue?
        }
        this.updateBoard = function () {

        }
        this.displayBreak = function () {
            $("#break .readout").html(this.break);
        }

        this.startTimer = function () {
            function tick() {
                that.decrementTime();
                if (that.isTimeOut()) { //Switch timers on TimeOut
                    that.switchTimer();
                }
                that.tid = setTimeout(tick, 1000);

            }

            var that = this;
            this.running = true;
            that.tid = setTimeout(tick, 1000);
        }
        this.stopTimer = function () {
            clearTimeout(this.tid);
            this.running = false;
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
    }
})();

var game = TicTacToe.getInstance();

$(document).ready(function () {
    setDisplay()
    setListeners();
    timer.setAlarm(new Sound("https://www.kganguly.com/media/A-Tone-His_Self-1266414414.mp3"));
});

function setDisplay() {
    timer.displayBreak();
    timer.displaySession();
    timer.setTime(timer.getSession());
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