(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
			var newGame = document.getElementById("newGame");
			var options = document.getElementById("options");


			var applicationData = Windows.Storage.ApplicationData.current;
			this.localSettings = applicationData.localSettings;

			if (typeof (this.localSettings.values["music"]) === "undefined")
			    this.localSettings.values["music"] = true;
			if (typeof (this.localSettings.values["sounds"]) === "undefined")
			    this.localSettings.values["sounds"] = true;
			if (typeof (this.localSettings.values["theme"]) === "undefined")
			    this.localSettings.values["theme"] = "standard";


			if (this.localSettings.values["music"] === true) {
			    if (!this.music) {
			        this.music = new Audio();
			        this.music.src = "pages/home/sounds/KingMe.mp3";
			        this.music.loop = true;
			        this.music.play();
			    } else {
			        this.music.play();
			    }
			} else {
			    if (this.music) {
			        this.music.pause();
			    }
			}

			newGame.addEventListener("click", function () {
			    WinJS.Navigation.navigate("/pages/game/game.html");
		    });

			options.addEventListener("click", function () {
			    WinJS.Navigation.navigate("/pages/options/options.html");
			});
        },

        unload: function () {
            if (this.music) {
                this.music.pause();
            }
        }
    });
})();
