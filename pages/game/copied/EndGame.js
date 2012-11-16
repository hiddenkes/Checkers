function EndGame(board) {
    this.board = board;
 
    this.endGameOverlay = document.createElement("div");
    this.endGameOverlay.id = "EndGameOverlay";
    this.endGameOverlay.className = "EndGame Overlay Hidden";

    this.endGamePanel = document.createElement("div");
    this.endGamePanel.id = "EndGamePanel";
    this.endGamePanel.className = "EndGame Panel Hidden";

    this.endGameText = document.createElement("p");
    this.endGameText.className = "EndGameText";
    this.endGameText.innerHTML = '<br><br>' + "Congratulations," + '<br>' + "you win!";
    this.endGamePanel.appendChild(this.endGameText);

    this.endGameImage = document.createElement("img");
    this.endGameImage.className = "EndGameImage";
    this.endGameImage.setAttribute("src", "images/copied/GoldStar.png");
    this.endGamePanel.appendChild(this.endGameImage);

    board.div.appendChild(this.endGameOverlay);
    board.div.appendChild(this.endGamePanel);

    this.isShowing = true;
    this.hide();
}

EndGame.prototype.hide = function () {
    if (!this.isShowing)
        return;

    this.endGameOverlay.hide();
    this.endGamePanel.hide();
    this.endGameImage.removeClassName('Showing');

    this.isShowing = false;
}

EndGame.prototype.showWinner = function () {
    if (this.isShowing)
        return;

    // Create the message dialog and set its content
    var msg = new Windows.UI.Popups.MessageDialog("Congratulations! \n \n You have beaten the computer! Would you like to start a new game?");

    var self = this.board;

    // Add commands and set their command handlers
    msg.commands.append(new Windows.UI.Popups.UICommand("Yes", function () {
        self.resetGame();
    }));
    msg.commands.append(new Windows.UI.Popups.UICommand("No", function () { }));

    // Set the command that will be invoked by default
    msg.defaultCommandIndex = 0;

    // Set the command to be invoked when escape is pressed
    msg.cancelCommandIndex = 1;

    // Show the message dialog
    msg.showAsync();

    /*this.endGameText.innerHTML = '<br><br>' + "Congratulations," + '<br>' + "you win!";
    this.endGameImage.setAttribute("src", "resources/GoldStar.png");
    this.endGameOverlay.unhide();
    this.endGamePanel.unhide();
    this.endGameImage.addClassName('Showing');
    */


    this.isShowing = true;
}

EndGame.prototype.showLoser = function () {
    if (this.isShowing)
        return;
    // Create the message dialog and set its content
    var msg = new Windows.UI.Popups.MessageDialog("On No! \n \n You lost the game! Better luck next time! Would you like to start a new game?");

    var self = this.board;

    // Add commands and set their command handlers
    msg.commands.append(new Windows.UI.Popups.UICommand("Yes", function () {
        self.resetGame();
    }));
    msg.commands.append(new Windows.UI.Popups.UICommand("No", function () { }));

    // Set the command that will be invoked by default
    msg.defaultCommandIndex = 0;

    // Set the command to be invoked when escape is pressed
    msg.cancelCommandIndex = 1;

    // Show the message dialog
    msg.showAsync();

    /*
    this.endGameText.innerHTML = '<br><br>' + "Too bad, you lost!";
    this.endGameImage.setAttribute("src", "resources/Loser.png");
    this.endGameOverlay.unhide();
    this.endGamePanel.unhide();
    this.endGameImage.addClassName('Showing');
    */

    this.isShowing = true;
}