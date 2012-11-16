function GameManager(board) {
    this.board = board;

    this.gameManagerOverlay = document.createElement("div");
    this.gameManagerOverlay.id = "GameManagerOverlay";
    this.gameManagerOverlay.className = "GameManager Overlay Hidden";

    this.gameManagerPanel = document.createElement("div");
    this.gameManagerPanel.id = "GameManagerPanel";
    this.gameManagerPanel.className = "GameManager Panel Hidden";

    var autoSavedGamesTitle = document.createElement("div");
    autoSavedGamesTitle.className = "SavedGamesTitle";
    autoSavedGamesTitle.innerHTML = "Auto Saved Games";
    this.gameManagerPanel.appendChild(autoSavedGamesTitle);

    this.autoSavedGames = new Array(3);
    for (var i = 0; i < 3; ++i) {
        this.autoSavedGames[i] = new SavedGame(this, 0, i);

        var div = document.createElement("div");
        div.className = "SavedGameEntryContainer";
        div.appendChild(this.autoSavedGames[i].button);
        this.gameManagerPanel.appendChild(div);
    }

    var savedGamesTitle = document.createElement("div");
    savedGamesTitle.className = "SavedGamesTitle";
    savedGamesTitle.innerHTML = "Saved Games";
    this.gameManagerPanel.appendChild(savedGamesTitle);

    this.savedGames = new Array(3);
    for (var i = 0; i < 3; ++i) {
        this.savedGames[i] = new SavedGame(this, 1, i);

        var div = document.createElement("div");
        div.className = "SavedGameEntryContainer";
        div.appendChild(this.savedGames[i].button);
        this.gameManagerPanel.appendChild(div);
    }

    board.div.appendChild(this.gameManagerOverlay);
    board.div.appendChild(this.gameManagerPanel);

    if (this.autoSavedGames[2].hasData())
        this.currentAutosave = 2;
    else if (this.autoSavedGames[1].hasData())
        this.currentAutosave = 1;
    else if (this.autoSavedGames[0].hasData())
        this.currentAutosave = 0;
    else
        this.currentAutosave = -1;

    this.newGameStarted();

    this.isShowing = true;
    this.hide();
}

GameManager.prototype.gameClicked = function (savedGame) {
    if (savedGame.hasData()) {
        var result = confirm("Would you like to load this saved game?");
        if (result) {
            savedGame.restore(this.board);
            this.hide();
            return;
        }
    }

    // Auto-saves are read-only
    if (savedGame.saveType == 0)
        return;

    // Automatically save to empty slots, or overwrite if confirmed
    if (!savedGame.hasData() || confirm("Overwrite saved game data?")) {
        savedGame.save(this.board, (new Date).getTime());
        this.hide();
    }
}

GameManager.prototype.show = function () {
    if (this.isShowing)
        return;

    this.gameManagerOverlay.unhide();
    this.gameManagerPanel.unhide();

    this.isShowing = true;
}

GameManager.prototype.hide = function () {
    if (!this.isShowing)
        return;

    this.gameManagerOverlay.hide();
    this.gameManagerPanel.hide();

    this.isShowing = false;
}

GameManager.prototype.newGameStarted = function () {
    this.advanceAutosaves = true;
}

GameManager.prototype.moveMade = function () {
    return;
    if (this.advanceAutosaves) {
        ++this.currentAutosave;
        this.advanceAutosaves = false;

        if (this.currentAutosave == 3) {
            this.autoSavedGames[0].adoptSavedGame(this.autoSavedGames[1]);
            this.autoSavedGames[1].adoptSavedGame(this.autoSavedGames[2]);
            this.currentAutosave = 2;
        }
    }

    // Illegal state, should never happen
    if (this.currentAutosave < 0 || this.currentAutosave > 2)
        return;

    this.autoSavedGames[this.currentAutosave].save(this.board, (new Date).getTime());
}

// =========== Saved Game ===========

function SavedGame(manager, type, index) {
    this.saveType = type;
    this.index = index;

    this.button = document.createElement("button");
    this.button.className = "SavedGameEntry";
    this.button.manager = manager;
    this.button.savedGame = this;

    this.button.onclick = function (event) { event.target.manager.gameClicked(event.target.savedGame); };

    this.refreshUI();
}

function savedGameStoragePrefix(saveType, index) {
    return 'SG ' + saveType + ',' + index + ':';
}

SavedGame.prototype.storagePrefix = function () {
    return savedGameStoragePrefix(this.saveType, this.index);
}

SavedGame.prototype.adoptSavedGame = function (savedGame) {
    var myPrefix = this.storagePrefix();
    var otherPrefix = savedGame.storagePrefix();

    localStorage[myPrefix + 'Player0'] = localStorage[otherPrefix + 'Player0'];
    localStorage[myPrefix + 'Player1'] = localStorage[otherPrefix + 'Player1'];
    localStorage[myPrefix + 'CurrentPlayer'] = localStorage[otherPrefix + 'CurrentPlayer'];
    localStorage[myPrefix + 'TurnCount'] = localStorage[otherPrefix + 'TurnCount'];
    localStorage[myPrefix + 'TurnDate'] = localStorage[otherPrefix + 'TurnDate'];

    this.refreshUI();
}

SavedGame.prototype.refreshUI = function () {
    var buttonText, keyPrefix = 0, timeStamp = 0;
    if (window.localStorage) {
        keyPrefix = this.storagePrefix();
        timeStamp = localStorage[keyPrefix + 'TurnDate'];
    }

    if (timeStamp) {
        var date = new Date(parseInt(timeStamp));
        buttonText = date.getFullYear()
            + "-" + ("0" + (date.getMonth() + 1)).substr(-2)
            + "-" + ("0" + date.getDate()).substr(-2)
            + " at " + date.getHours()
            + ":" + ("0" + date.getMinutes()).substr(-2);
    } else
        buttonText = "- Empty -";

    this.button.innerText = buttonText;
}

SavedGame.prototype.hasData = function () {
    return window.localStorage && localStorage[this.storagePrefix() + 'Player0'];
}

SavedGame.prototype.save = function (board, timeStamp) {
    var keyPrefix = this.storagePrefix();

    localStorage[keyPrefix + 'Player0'] = serializeArray(board.pieces[0]);
    localStorage[keyPrefix + 'Player1'] = serializeArray(board.pieces[1]);
    localStorage[keyPrefix + 'CurrentPlayer'] = board.currentPlayer;
    localStorage[keyPrefix + 'TurnCount'] = board.turnCount;
    localStorage[keyPrefix + 'TurnDate'] = timeStamp;

    this.refreshUI();
}

SavedGame.prototype.restore = function (board) {
    board.resetGame();
    board.freezeGame();

    var keyPrefix = this.storagePrefix();

    var pieces = eval(localStorage[keyPrefix + 'Player0']);
    for (var i = 0; i < 12; ++i)
        board.pieces[0][i].load(pieces[i]);

    pieces = eval(localStorage[keyPrefix + 'Player1']);
    for (var i = 0; i < 12; ++i)
        board.pieces[1][i].load(pieces[i]);

    board.setBoardFromPieces();

    var currentPlayer = parseInt(localStorage[keyPrefix + 'CurrentPlayer']);
    board.setCurrentPlayer(currentPlayer);

    var turnCount = parseInt(localStorage[keyPrefix + 'TurnCount']);
    board.setTurnCount(turnCount);

    board.unfreezeGame();
}