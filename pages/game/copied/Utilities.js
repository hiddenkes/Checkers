Element.prototype.moveOffScreen = function () {
    this.addClassName('Hidden');
}

Element.prototype.hide = function () {
    if (!this.hideableSet) {
        this.addClassName('Hideable');
        this.hideableSet;
    }

    this.addEventListener('webkitTransitionEnd', this.moveOffScreen, false);
    this.style.setProperty('opacity', '0.0', null);
}

Element.prototype.unhide = function () {
    if (!this.hideableSet) {
        this.addClassName('Hideable');
        this.hideableSet;
    }

    this.removeEventListener('webkitTransitionEnd', this.moveOffScreen, false);
    this.removeClassName('Hidden');
    this.style.removeProperty('opacity');
}

Element.prototype.addClassName = function (name) {
    var nameList = this.className.split(' ');
    var i = 0;
    while (i < nameList.length && nameList[i] != name)
        ++i;

    if (i == nameList.length)
        this.className += " " + name;
}

Element.prototype.removeClassName = function (name) {
    var nameList = this.className.split(' ');
    var newClassName = "";
    for (var i = 0; i < nameList.length; ++i) {
        if (nameList[i] != name)
            newClassName += nameList[i] + " ";
    }

    this.className = newClassName;
}

function serializeArray(array) {
    return "[" + array.toString() + "]";
}

function createMultiDimensionalArray(rows, cols) {
    var result = new Array(rows);
    for (var i = 0; i < rows; ++i)
        result[i] = new Array(cols);

    return (result);
}

function copyMultiDimensionalArray(array) {
    var copy = new Array(array.length);
    for (var i = 0; i < array.length; ++i) {
        copy[i] = new Array(array[i].length);
        for (var j = 0; j < array[i].length; ++j)
            copy[i][j] = array[i][j];
    }
    return copy;
}

function dismiss() {
    document.getElementById('AddToHomeScreen').style.opacity = '0';
    window.setTimeout("scrollTo(0,1);", 1000);
    window.setTimeout("document.getElementById('AddToHomeScreen').style.display = 'none'", 1000);
}

function initializeScreen() {
    return;
    if ('createTouch' in document) {
        /* if this web app isn't running in full-screen mode, show prompt to add to home screen */
        if (!window.navigator.standalone) {
            var addToHomeScreen = document.createElement("div");
            addToHomeScreen.id = "AddToHomeScreen";
            addToHomeScreen.innerHTML = "<br><br>To run in full-screen mode,<h1>Add to Home Screen<div id='dismissHomeScreen' ontouchstart='dismiss()'>( dismiss )</div></h1>";
            document.body.appendChild(addToHomeScreen);
        }
            /* if it's running in full-screen mode, add some vertical space to the main UI elements */
        else {
            document.getElementById('ButtonsContainer').style.marginTop = '40px';
            document.getElementById('TurnIndicatorContainer').style.marginTop = '40px';
            document.getElementById('CheckerBoard').style.marginTop = '40px';
        }
    }
    else {
        window.resizeTo(665, 780);
    }
}