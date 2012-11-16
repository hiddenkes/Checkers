function Achievement(descriptionText, checkerBoard) {
    this.overlayDiv = document.createElement("div");
    this.overlayDiv.className = "AchievementOverlay";

    this.div = document.createElement("div");
    this.div.className = "Achievement";

    var text = document.createElement("div");
    text.className = "AchievementText";
    this.div.appendChild(text);

    var caption = document.createElement("div");
    caption.className = "AchievementCaption";
    caption.innerHTML = "Achievement unlocked";
    text.appendChild(caption);

    var description = document.createElement("div");
    description.className = "AchievementDescription";
    description.innerHTML = descriptionText;
    text.appendChild(description);

    this.checkerBoard = checkerBoard;
    checkerBoard.div.parentElement.appendChild(this.overlayDiv);
    checkerBoard.div.parentElement.appendChild(this.div);

    var self = this;
    setTimeout(function () { self.fadeIn(); }, 0);
}

Achievement.prototype.fadeIn = function () {
    this.overlayDiv.style.setProperty('opacity', '.8');
    this.div.style.setProperty('opacity', '1');

    var self = this;
    setTimeout(function () { self.fadeAway(); }, 2500);
}

Achievement.prototype.fadeAway = function () {
    var self = this;
    this.div.addEventListener('webkitTransitionEnd', function () { self.fadedAway(); }, false);

    this.div.style.removeProperty('opacity');
    this.overlayDiv.style.removeProperty('opacity');
}

Achievement.prototype.fadedAway = function () {
    this.div.parentElement.removeChild(this.div);
    this.overlayDiv.parentElement.removeChild(this.overlayDiv);

    this.checkerBoard.achievementGone();
}