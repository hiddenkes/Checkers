function HighScoresPanel(board) {
    this.board = board;

    this.highScoresOverlay = document.createElement("div");
    this.highScoresOverlay.id = "HighScoresOverlay";
    this.highScoresOverlay.className = "HighScores Overlay Hidden";

    this.highScoresPanel = document.createElement("div");
    this.highScoresPanel.id = "HighScoresPanel";
    this.highScoresPanel.className = "HighScores Panel Hidden";

    var fewestMovesTitle = document.createElement("div");
    fewestMovesTitle.className = "HighScoresTitle";
    fewestMovesTitle.innerHTML = "Fewest Moves";
    this.highScoresPanel.appendChild(fewestMovesTitle);

    this.fewestMovesRanking = document.createElement("div");
    this.highScoresPanel.appendChild(this.fewestMovesRanking);

    var fewestPiecesLostTitle = document.createElement("div");
    fewestPiecesLostTitle.className = "HighScoresTitle";
    fewestPiecesLostTitle.innerHTML = "Fewest Pieces Lost";
    this.highScoresPanel.appendChild(fewestPiecesLostTitle);

    this.fewestPiecesLostRanking = document.createElement("div");
    this.highScoresPanel.appendChild(this.fewestPiecesLostRanking);

    this.fewestMoves = new Array(3);
    this.fewestPiecesLost = new Array(3);

    for (var i = 0; i < 3; ++i) {
        this.fewestMoves[i] = new HighScore(0, i, this.fewestMovesRanking);
        this.fewestPiecesLost[i] = new HighScore(1, i, this.fewestPiecesLostRanking);
    }

    board.div.appendChild(this.highScoresOverlay);
    board.div.appendChild(this.highScoresPanel);

    this.isShowing = true;
    this.hide();
}

HighScoresPanel.prototype.show = function () {
    if (this.isShowing)
        return;

    this.highScoresOverlay.unhide();
    this.highScoresPanel.unhide();

    this.isShowing = true;
}

HighScoresPanel.prototype.hide = function () {
    if (!this.isShowing)
        return;

    this.highScoresOverlay.hide();
    this.highScoresPanel.hide();

    this.isShowing = false;
}

HighScoresPanel.prototype.registerScore = function (numberMoves, numberPiecesLost) {
    var fewestMovesIndex = -1;
    for (var i = 0; i < 3; ++i) {
        var score = this.fewestMoves[i].score;
        if (score == undefined || score >= numberMoves) {
            fewestMovesIndex = i;
            break;
        }
    }

    var fewestPiecesLostIndex = -1;
    for (var i = 0; i < 3; ++i) {
        var score = this.fewestPiecesLost[i].score;
        if (score == undefined || score >= numberPiecesLost) {
            fewestPiecesLostIndex = i;
            break;
        }
    }

    if (fewestMovesIndex == -1 && fewestPiecesLostIndex == -1)
        return false;

    var userName = prompt("Please enter your name");

    if (fewestMovesIndex == 0) {
        this.fewestMoves[2].setScore(this.fewestMoves[1].name, this.fewestMoves[1].score);
        this.fewestMoves[1].setScore(this.fewestMoves[0].name, this.fewestMoves[0].score);
        this.fewestMoves[0].setScore(userName, numberMoves);
    } else if (fewestMovesIndex == 1) {
        this.fewestMoves[2].setScore(this.fewestMoves[1].name, this.fewestMoves[1].score);
        this.fewestMoves[1].setScore(userName, numberMoves);
    } else if (fewestMovesIndex == 2)
        this.fewestMoves[2].setScore(userName, numberMoves);

    if (fewestPiecesLostIndex == 0) {
        this.fewestPiecesLost[2].setScore(this.fewestPiecesLost[1].name, this.fewestPiecesLost[1].score);
        this.fewestPiecesLost[1].setScore(this.fewestPiecesLost[0].name, this.fewestPiecesLost[0].score);
        this.fewestPiecesLost[0].setScore(userName, numberPiecesLost);
    } else if (fewestPiecesLostIndex == 1) {
        this.fewestPiecesLost[2].setScore(this.fewestPiecesLost[1].name, this.fewestPiecesLost[1].score);
        this.fewestPiecesLost[1].setScore(userName, numberPiecesLost);
    } else if (fewestPiecesLostIndex == 2)
        this.fewestPiecesLost[2].setScore(userName, numberPiecesLost);

    return true;
}


// ====== HighScore (entry) =====

function HighScore(scoreType, index, parent) {
    this.scoreType = scoreType;
    this.index = index;
    this.score = -1;

    var div = document.createElement("div");
    div.className = "HighScoreContainer";
    parent.appendChild(div);

    this.nameDiv = document.createElement("div");
    this.nameDiv.className = "HighScorer";
    div.appendChild(this.nameDiv);

    this.scoreDiv = document.createElement("div");
    this.scoreDiv.className = "Score";
    div.appendChild(this.scoreDiv);

    if (!this.loadScore())
        this.setScore(null, null);
}

HighScore.prototype.refreshUI = function () {
    if (this.score)
        this.scoreDiv.innerHTML = this.score;
    else
        this.scoreDiv.innerHTML = "-";

    if (this.name)
        this.nameDiv.innerHTML = this.name;
    else
        this.nameDiv.innerHTML = "-";
}

function highScoreStoragePrefix(scoreType, index) {
    return 'HS ' + scoreType + ',' + index + ':';
}

HighScore.prototype.storagePrefix = function () {
    return highScoreStoragePrefix(this.scoreType, this.index);
}

HighScore.prototype.setScore = function (name, score) {
    this.name = name;
    this.score = score;

    if (!window.localStorage) {
        this.refreshUI();
        return;
    }

    var storagePrefix = this.storagePrefix();
    if (this.name) {
        localStorage[storagePrefix + "Name"] = this.name;
        localStorage[storagePrefix + "Score"] = this.score;
    } else {
        delete localStorage[storagePrefix + "Name"];
        delete localStorage[storagePrefix + "Score"];
    }

    this.refreshUI();
}

HighScore.prototype.loadScore = function () {
    if (!window.localStorage)
        return;

    var storagePrefix = this.storagePrefix();

    this.name = localStorage[storagePrefix + "Name"];
    this.score = localStorage[storagePrefix + "Score"];

    if (!this.name || !this.score) {
        this.name = null;
        this.score = null;
    }

    this.refreshUI();
    return this.name;
}
