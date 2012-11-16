function CheckerBoard(parentElement) {
    var turnIndicatorContainer = document.createElement("div");
    turnIndicatorContainer.id = "TurnIndicatorContainer";
    parentElement.appendChild(turnIndicatorContainer);

    this.player0TurnIndicatorContainer = document.createElement("div");
    this.player0TurnIndicatorContainer.className = "Player0Container";
    turnIndicatorContainer.appendChild(this.player0TurnIndicatorContainer);
    this.player0TurnIndicator = document.createElement("img");
    this.player0TurnIndicator.className = "Player0TurnIndicator";
    this.player0TurnIndicator.setAttribute("src", "images/copied/Player-0-Indicator.png");
    this.player0TurnIndicatorContainer.appendChild(this.player0TurnIndicator);

    this.player1TurnIndicatorContainer = document.createElement("div");
    this.player1TurnIndicatorContainer.className = "Player1Container";
    turnIndicatorContainer.appendChild(this.player1TurnIndicatorContainer);
    this.player1TurnIndicator = document.createElement("img");
    this.player1TurnIndicator.className = "Player1TurnIndicator";
    this.player1TurnIndicator.setAttribute("src", "images/copied/Player-1-Indicator.png");
    this.player1TurnIndicatorContainer.appendChild(this.player1TurnIndicator);

    this.div = document.createElement("div");
    this.div.id = "CheckerBoard";
    this.div.innerHTML = "&nbsp";
    this.div.board = this;
    this.div.onclick = function () { this.board.clicked(); cancelBubble(event); };

    parentElement.appendChild(this.div);

    var buttonContainer = document.createElement("div");
    buttonContainer.id = "ButtonsContainer";
    parentElement.appendChild(buttonContainer);

    //this.addNewGameButton(buttonContainer);
    //this.addManageGamesButton(buttonContainer);
    //this.addHighScoresButton(buttonContainer);

    for (var x = 1; x < 8; x += 2)
        for (var y = 0; y < 7; y += 2)
            var square = new BoardSquare(this, x, y);
    for (var x = 0; x < 7; x += 2)
        for (var y = 1; y < 8; y += 2)
            var square = new BoardSquare(this, x, y);

    this.board = createMultiDimensionalArray(8, 8);
    this.pieces = createMultiDimensionalArray(2, 12);

    for (var i = 0; i < 12; ++i)
        this.pieces[0][i] = new Checker(0, this);

    for (var i = 0; i < 12; ++i)
        this.pieces[1][i] = new Checker(1, this);

    this.gameManager = new GameManager(this);
    this.highScores = new HighScoresPanel(this);
    this.endGame = new EndGame(this);

    this.resetGame();
}

CheckerBoard.prototype.addNewGameButton = function (buttonContainer) {
    this.newGameButton = document.createElement("button");
    this.newGameButton.className = "ButtonContents";
    this.newGameButton.checkerBoard = this;
    this.newGameButton.innerHTML = "New Game";
    if ('createTouch' in document)
        this.newGameButton.ontouchstart = function () { this.checkerBoard.newGameButtonClicked(); cancelBubble(event); };
    else
        this.newGameButton.onclick = function () { this.checkerBoard.newGameButtonClicked(); cancelBubble(event); };

    var buttonDiv = document.createElement("div");
    buttonDiv.className = "ButtonDiv";
    buttonDiv.appendChild(this.newGameButton);
    buttonContainer.appendChild(buttonDiv);
}

CheckerBoard.prototype.addManageGamesButton = function (buttonContainer) {
    this.manageGamesButton = document.createElement("button");
    this.manageGamesButton.className = "ButtonContents";
    this.manageGamesButton.checkerBoard = this;
    this.manageGamesButton.innerHTML = "Manage Games";
    if ('createTouch' in document)
        this.manageGamesButton.ontouchstart = function () { this.checkerBoard.manageGamesButtonClicked(); cancelBubble(event); };
    else
        this.manageGamesButton.onclick = function () { this.checkerBoard.manageGamesButtonClicked(); cancelBubble(event); };
    this.manageGamesButton.isShowing = false;

    buttonDiv = document.createElement("div");
    buttonDiv.className = "ButtonDiv";
    buttonDiv.appendChild(this.manageGamesButton);
    buttonContainer.appendChild(buttonDiv);
}

CheckerBoard.prototype.addHighScoresButton = function (buttonContainer) {
    this.highScoreButton = document.createElement("button");
    this.highScoreButton.className = "ButtonContents";
    this.highScoreButton.checkerBoard = this;
    this.highScoreButton.innerHTML = "High Scores";
    if ('createTouch' in document)
        this.highScoreButton.ontouchstart = function () { this.checkerBoard.highScoreButtonClicked(); cancelBubble(event); };
    else
        this.highScoreButton.onclick = function () { this.checkerBoard.highScoreButtonClicked(); cancelBubble(event); };
    this.highScoreButton.isShowing = false;

    buttonDiv = document.createElement("div");
    buttonDiv.className = "ButtonDiv";
    buttonDiv.appendChild(this.highScoreButton);
    buttonContainer.appendChild(buttonDiv);
}

CheckerBoard.prototype.clicked = function () {
    // If there's no selection, this is a no-op.
    if (!this.selectedChecker)
        return;

    // This catches clicking on red regions, which is always an illegal move.
    new Flash("You must move diagonally.");
}

CheckerBoard.prototype.newGameButtonClicked = function () {
    this.highScores.hide();
    this.gameManager.hide();
    this.endGame.hide();

    var startNewGame = !this.gameInProgress;

    //TODO:
    //if (!startNewGame) {
    if(true){
        // Create the message dialog and set its content
        var msg = new Windows.UI.Popups.MessageDialog("There is a game in progress.\nAre you sure you want to start a new game?");

        var self = this;

        // Add commands and set their command handlers
        msg.commands.append(new Windows.UI.Popups.UICommand("Yes", function () {
            self.resetGame();
        }));
        msg.commands.append(new Windows.UI.Popups.UICommand("Cancel", function () { }));

        // Set the command that will be invoked by default
        msg.defaultCommandIndex = 0;

        // Set the command to be invoked when escape is pressed
        msg.cancelCommandIndex = 1;

        // Show the message dialog
        msg.showAsync();
    }
}

CheckerBoard.prototype.highScoreButtonClicked = function () {
    this.endGame.hide();

    if (this.highScores.isShowing) {
        this.highScores.hide();
    } else {
        this.gameManager.hide();
        this.highScores.show();
    }
}

CheckerBoard.prototype.manageGamesButtonClicked = function () {
    this.endGame.hide();

    if (this.gameManager.isShowing) {
        this.gameManager.hide();
    } else {
        this.highScores.hide();
        this.gameManager.show();
    }
}

CheckerBoard.prototype.setCheckerPosition = function (checker, x, y) {
    if (checker.x != -1)
        this.board[checker.x][checker.y] = null;

    checker.moveTo(x, y);
    this.board[x][y] = checker;
}

CheckerBoard.prototype.setBoardFromPieces = function () {
    for (var y = 0; y < 8; ++y)
        for (var x = 0; x < 8; ++x)
            this.board[x][y] = null;

    for (var i = 0; i < 12; ++i) {
        var checker = this.pieces[0][i];
        if (!checker.captured)
            this.board[checker.x][checker.y] = checker;

        checker = this.pieces[1][i];
        if (!checker.captured)
            this.board[checker.x][checker.y] = checker;
    }
}

CheckerBoard.prototype.resetGame = function () {
    this.setCurrentPlayer(0);
    this.gameInProgress = true;
    this.chainJumper = null;
    this.selectedChecker = null;
    this.setTurnCount(1);

    for (var i = 0; i < 12; ++i) {
        this.pieces[0][i].reset();
        this.pieces[1][i].reset();
    }

    this.pieces[0][0].moveTo(0, 7, true);
    this.pieces[0][1].moveTo(2, 7, true);
    this.pieces[0][2].moveTo(4, 7, true);
    this.pieces[0][3].moveTo(6, 7, true);
    this.pieces[0][4].moveTo(1, 6, true);
    this.pieces[0][5].moveTo(3, 6, true);
    this.pieces[0][6].moveTo(5, 6, true);
    this.pieces[0][7].moveTo(7, 6, true);
    this.pieces[0][8].moveTo(0, 5, true);
    this.pieces[0][9].moveTo(2, 5, true);
    this.pieces[0][10].moveTo(4, 5, true);
    this.pieces[0][11].moveTo(6, 5, true);

    this.pieces[1][0].moveTo(1, 0, true);
    this.pieces[1][1].moveTo(3, 0, true);
    this.pieces[1][2].moveTo(5, 0, true);
    this.pieces[1][3].moveTo(7, 0, true);
    this.pieces[1][4].moveTo(0, 1, true);
    this.pieces[1][5].moveTo(2, 1, true);
    this.pieces[1][6].moveTo(4, 1, true);
    this.pieces[1][7].moveTo(6, 1, true);
    this.pieces[1][8].moveTo(1, 2, true);
    this.pieces[1][9].moveTo(3, 2, true);
    this.pieces[1][10].moveTo(5, 2, true);
    this.pieces[1][11].moveTo(7, 2, true);

    this.setBoardFromPieces();

    this.gameManager.newGameStarted();
}

CheckerBoard.prototype.freezeGame = function () {
    this.frozen = true;
}

CheckerBoard.prototype.unfreezeGame = function () {
    this.frozen = undefined;
    this.checkerMovementComplete();
}

CheckerBoard.prototype.checkerMovementComplete = function () {
    if (!this.frozen && this.currentPlayer == 1) {
        var f = calculateAIMove(this);
        if (f === "NP") {
            this.setCurrentPlayer(0);
            this.showEndGame();
        }
    }
}

CheckerBoard.prototype.checkerClicked = function (checker) {
    // Can't select when the game isn't going.
    if (!this.gameInProgress)
        return;

    // Can't select a checker you don't own.
    if (checker.player != this.currentPlayer) {
        new Flash("You don't own that checker.");
        return;
    }

    // If a jump is possible and this piece can't jump, don't allow the selection.
    // In fact, flash a different color for that error.
    if ((this.chainJumper && this.chainJumper != checker) || (!this.pieceCanJump(checker) && this.anyJumpPossible())) {
        new Flash("You cannot move that checker, you must jump.", true);
        return;
    }

    // If the clicked checker is already selected, we might try to clear the selection instead.
    if (this.selectedChecker == checker)
        checker = null;

    this.setSelectedChecker(checker);
}

CheckerBoard.prototype.setSelectedChecker = function (checker) {
    // If the player is in the middle of a chain jump, we should never change the selection.
    if (this.chainJumper)
        return;

    if (this.selectedChecker)
        this.selectedChecker.setSelected(false);

    this.selectedChecker = checker;

    if (checker)
        checker.setSelected(true);
}

CheckerBoard.prototype.gameOver = function () {
    var hasAnyPieces = false;
    for (var i = 0; i < 12; ++i) {
        if (!this.pieces[0][i].captured) {
            hasAnyPieces = true;
            break;
        }
    }

    if (!hasAnyPieces)
        return true;

    hasAnyPieces = false;
    for (var i = 0; i < 12; ++i) {
        if (!this.pieces[1][i].captured) {
            hasAnyPieces = true;
            break;
        }
    }

    return !hasAnyPieces;
}

CheckerBoard.prototype.anyJumpPossible = function () {
    for (var i = 0; i < 12; ++i) {
        if (this.pieceCanJump(this.pieces[this.currentPlayer][i]))
            return true;
    }

    return false;
}

CheckerBoard.prototype.pieceCanJump = function (checker) {
    if (checker.captured)
        return false;

    var board = this.board;

    // Any jumps to the left?
    if (checker.x > 1) {
        if (checker.y > 1 && board[checker.x - 1][checker.y - 1] && board[checker.x - 1][checker.y - 1].player != checker.player && !board[checker.x - 2][checker.y - 2] && (checker.player == 0 || checker.isKing))
            return true;
        if (checker.y < 6 && board[checker.x - 1][checker.y + 1] && board[checker.x - 1][checker.y + 1].player != checker.player && !board[checker.x - 2][checker.y + 2] && (checker.player == 1 || checker.isKing))
            return true;
    }

    // Any jumps to the right?
    if (checker.x < 6) {
        if (checker.y > 1 && board[checker.x + 1][checker.y - 1] && board[checker.x + 1][checker.y - 1].player != checker.player && !board[checker.x + 2][checker.y - 2] && (checker.player == 0 || checker.isKing))
            return true;
        if (checker.y < 6 && board[checker.x + 1][checker.y + 1] && board[checker.x + 1][checker.y + 1].player != checker.player && !board[checker.x + 2][checker.y + 2] && (checker.player == 1 || checker.isKing))
            return true;
    }

    return false;
}

CheckerBoard.prototype.attemptMove = function (checker, x, y) {
    // Attempting to move within the same row or column is invalid, as is moving more than 2 rows or columns away.
    if (checker.x == x || Math.abs(checker.x - x) > 2 || checker.y == y || Math.abs(checker.y - y) > 2)
        return false;

    // Attempting to move one row away.
    var delta = checker.player ? 1 : -1;
    if (Math.abs(checker.y - y) == 1) {
        // Cancel if we should be required to continue a chain jump.
        if (this.chainJumper)
            return false;

        // Or if a jump is possible (one must be taken).
        if (this.anyJumpPossible())
            return false;

        // Or if the movement is backwards and the piece is not a king.
        if (checker.y - delta == y && !checker.isKing)
            return false;

        // Or if it's not exactly one column in either direction.
        if (Math.abs(checker.x - x) != 1)
            return false;

        // Or if that square is not clear.
        if (this.board[x][y])
            return false;

        return true;
    }

    // Attempting to move two rows away (jumping).
    delta = delta * 2;
    var jumpedPiece;
    if (Math.abs(checker.y - y) == 2) {
        // Cancel if the movement is backwards and the piece is not a king.
        if (checker.y - delta == y && !checker.isKing)
            return false;

        // Or if it's not two columns in either direction.
        if (Math.abs(checker.x - x) != 2)
            return false;

        // Or if that square is not clear.
        if (this.board[x][y])
            return false;

        // Or if there wasn't an enemy piece in between.
        if (checker.x > x) {
            if (checker.y > y) {
                if (!this.board[x + 1][y + 1] || this.board[x + 1][y + 1].player == checker.player)
                    return false;
                jumpedPiece = this.board[x + 1][y + 1];
            } else {
                if (!this.board[x + 1][y - 1] || this.board[x + 1][y - 1].player == checker.player)
                    return false;
                jumpedPiece = this.board[x + 1][y - 1];
            }
        } else {
            if (checker.y > y) {
                if (!this.board[x - 1][y + 1] || this.board[x - 1][y + 1].player == checker.player)
                    return false;
                jumpedPiece = this.board[x - 1][y + 1];
            } else {
                if (!this.board[x - 1][y - 1] || this.board[x - 1][y - 1].player == checker.player)
                    return false;
                jumpedPiece = this.board[x - 1][y - 1];
            }
        }

        // The jump was valid - remove the jumped piece from the grid.
        jumpedPiece.setCaptured(true);
        this.board[jumpedPiece.x][jumpedPiece.y] = null;

        var result = new Object();
        result.jumped = true;
        return result;
    }
}

CheckerBoard.prototype.achievementGone = function () {
    this.setCurrentPlayer((this.currentPlayer + 1) % 2);
    this.unfreezeGame();
}

CheckerBoard.prototype.changePlayer = function () {
    if (this.currentAchievement) {
        // setCurrentPlayer() will occur after achievement fades out
        this.freezeGame();
        new Achievement(this.currentAchievement, this);
        delete this.currentAchievement;
    } else
        this.setCurrentPlayer((this.currentPlayer + 1) % 2);

    // If we just went from player 1 back to player 0, increment the turn counter.
    if (!this.currentPlayer)
        this.setTurnCount(this.turnCount + 1);
}

CheckerBoard.prototype.setCurrentPlayer = function (player) {
    if (player) {
        this.currentPlayer = 1;
        this.player0TurnIndicator.style.setProperty('opacity', '0.25', null);
        this.player1TurnIndicator.style.setProperty('opacity', '1.0', null);
    } else {
        this.player0TurnIndicator.style.setProperty('opacity', '1.0', null);
        this.player1TurnIndicator.style.setProperty('opacity', '0.25', null);
        this.currentPlayer = 0;
    }
}

CheckerBoard.prototype.setTurnCount = function (count) {
    this.turnCount = count;
}

CheckerBoard.prototype.squareClicked = function (x, y) {
    if (!this.gameInProgress || !this.selectedChecker)
        return;

    // At this point, we'll always clear the selection whether the move ends up valid or not.
    var checker = this.selectedChecker;

    var result = this.attemptMove(checker, x, y);

    // If the move failed, flash an error and bail.
    if (!result) {
        new Flash("You cannot move there.");
        return;
    }

    // The move was successful so commit the new location.
    this.setCheckerPosition(checker, x, y);

    // King the piece if necessary.
    if ((checker.player == 0 && y == 0) || (checker.player == 1 && y == 7))
        checker.kingMe(true);

    // Set up for a chain jump if necessary.
    if (result.jumped && this.pieceCanJump(checker)) {
        this.setSelectedChecker(checker);
        this.chainJumper = checker;
    } else {
        this.chainJumper = null;
        this.setSelectedChecker(null);
    }

    // If the game isn't over, switch current players and bail.
    if (!this.gameOver()) {
        if (this.turnCount == 1 && this.currentPlayer == 0) {
            //this.currentAchievement = "Moved a piece";
        }

        if (!this.chainJumper)
            this.changePlayer();

        this.gameManager.moveMade();

        return;
    }

    this.gameInProgress = false;
    var self = this;
    setTimeout(function () { self.showEndGame(); }, 500);
    cancelBubble(event);
}

CheckerBoard.prototype.showEndGame = function () {
    if (this.currentPlayer == 1)
        this.endGame.showLoser();
    else {
        this.endGame.showWinner();

        var self = this;
        setTimeout(function () {}, 2000);
    }
}

CheckerBoard.prototype.addHighScore = function () {
    if (this.currentPlayer == 0) {
        var piecesLost = 0;
        for (var i = 0; i < 12; ++i) {
            if (this.pieces[0][i].captured)
                ++piecesLost;
        }
        //if (this.highScores.registerScore(this.turnCount, piecesLost)) {
            this.endGame.hide();
            //this.highScores.show();
        //}
    }
}

// =========== BoardSquare ===========

function BoardSquare(board, x, y) {
    this.board = board;
    this.div = document.createElement("div");
    this.div.className = "BoardSquare";
    this.div.innerHTML = "&nbsp";
    this.div.square = this;
    this.div.onclick = function () { this.square.board.squareClicked(this.square.x, this.square.y); cancelBubble(event); };
    board.div.appendChild(this.div);

    // This should never happen
    if (x < 0 || x > 7 || y < 0 || y > 7)
        return;

    this.x = x;
    this.y = y;
    var tileSize = 72;

    this.div.style.setProperty('left', x * tileSize + 'px', null);
    this.div.style.setProperty('top', y * tileSize + 'px', null);
}

// =========== Checker ===========

function Checker(player, board) {
    this.board = board;
    this.selected = false;
    this.x = -1;
    this.y = -1;

    this.div = document.createElement("div");
    this.div.innerHTML = "&nbsp";
    this.div.className = "Checker";
    this.div.checker = this;
    this.div.onclick = function () { this.checker.board.checkerClicked(this.checker); cancelBubble(event); };
    this.div.addEventListener('transitionend', function (event) { cancelBubble(event); }, false);

    this.setPlayer(player);

    this.img = document.createElement("img");
    this.img.className = "KingImage";
    this.img.setAttribute("src", "images/copied/CrownOverlay.png");
    this.img.addEventListener("dragstart", function () { /*event.preventDefault();*/ }, false);
    this.img.checker = this;
    this.img.onclick = function () { this.checker.board.checkerClicked(this.checker); cancelBubble(event); };
    this.div.appendChild(this.img);

    this.outerDiv = document.createElement("div");
    this.outerDiv.innerHTML = "&nbsp";
    this.outerDiv.className = "OuterChecker";
    this.outerDiv.checker = this;
    var self = this;
    this.outerDiv.addEventListener('transitionend', function (event) { self.transitionEnded(event); }, false);

    this.outerDiv.appendChild(this.div);

    board.div.appendChild(this.outerDiv);
}

Checker.prototype.setPlayer = function (player) {
    this.div.removeClassName("Player" + this.player);
    this.player = player;
    this.div.addClassName("Player" + player);
    this.div.addClassName(Windows.Storage.ApplicationData.current.localSettings.values["theme"] || "standard");
}

Checker.prototype.moveTo = function (x, y, reset) {
    // This should never happen
    if (x < 0 || x > 7 || y < 0 || y > 7)
        return;

    this.x = x;
    this.y = y;
    var tileSize = 72;

    var xStyle = 2 + x * tileSize;
    var yStyle = 2 + y * tileSize;
    this.outerDiv.style.setProperty('transform', 'translate(' + xStyle + 'px, ' + yStyle + 'px)', null);

    if (Windows.Storage.ApplicationData.current.localSettings.values["sounds"] === true && !reset) {
        console.log("playing sound");
        var tap = new Audio();
        tap.src = "pages/game/sounds/tap.wav";
        tap.play();
    }
}

Checker.prototype.setSelected = function (selected) {
    if (selected)
        this.div.addClassName('Selected');
    else
        this.div.removeClassName('Selected');
}

Checker.prototype.kingMe = function (kinged) {
    this.isKing = kinged;
    if (kinged)
        this.div.addClassName('King');
    else
        this.div.removeClassName('King');
}

Checker.prototype.setCaptured = function (captured) {
    this.captured = captured;
    if (captured)
        this.outerDiv.addClassName('Captured');
    else
        this.outerDiv.removeClassName('Captured');
}

Checker.prototype.reset = function () {
    this.setSelected(false);
    this.kingMe(false);
    this.setCaptured(false)
}

Checker.prototype.toString = function () {
    return "{x:" + this.x + ", y:" + this.y + ", player:" + this.player + ", isKing:" + this.isKing + ", captured:" + this.captured + "}";
}

Checker.prototype.load = function (checkerInfo) {
    this.kingMe(checkerInfo.isKing);
    this.setCaptured(checkerInfo.captured);
    this.setPlayer(checkerInfo.player);
    this.setSelected(false);
    this.moveTo(checkerInfo.x, checkerInfo.y);
}

Checker.prototype.transitionEnded = function (event) {
    if (event.propertyName == 'transform')
        this.board.checkerMovementComplete();
}








var flashes = [];

function Flash(options, jump) {
    this.alerts = document.getElementById("alerts");

    this.div = document.createElement("div");
    this.div.innerHTML = options || "Default Alert";
    this.div.className = "flashAlert win-type-medium";

    this.parent = document.getElementById("alerts");
    this.parent.insertBefore(this.div);

    var self = this;
    window.setTimeout(function () {
        if (flashes.length > 0) {
            flashes.forEach(function (val) {
                val.speedup();
            });
        }
        this.index = flashes.length;
        flashes.push(self);

        self.show();
    }, 1);
}

Flash.prototype = {
    show: function () {
        this.div.addClassName("showing");
        this.timeout = window.setTimeout(this.hide.bind(this), 3000);
    },
    speedup: function () {
        this.removed = true;
        flashes.splice(this.index, 1);
        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(this.hide.bind(this), 500);
    },
    hide: function () {
        window.clearTimeout(this.timeout);
        if(!this.removed)
            flashes.splice(this.index, 1);
        this.div.removeClassName("showing");
        this.div.addClassName("hide");
        this.div.addEventListener("MSAnimationEnd", this.remove.bind(this), false);
    },
    remove: function () {
        this.parent.removeChild(this.div);
        console.log("Removed");
    }
}