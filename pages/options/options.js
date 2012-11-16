// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/options/options.html", {
        elements: {},
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            WinJS.UI.processAll().then((function () {
                var applicationData = Windows.Storage.ApplicationData.current;
                this.localSettings = applicationData.localSettings;

                // TODO: Initialize the page here.
                this.elements.music = document.getElementById("musicToggle");
                this.elements.sounds = document.getElementById("soundsToggle");
                this.elements.theme = document.getElementById("themeSelect");

                this.elements.music.addEventListener("change", this.optionsChange.bind(this), false);
                this.elements.sounds.addEventListener("change", this.optionsChange.bind(this), false);
                this.elements.theme.addEventListener("change", this.optionsChange.bind(this), false);

                if (typeof (this.localSettings.values["music"]) === "undefined")
                    this.localSettings.values["music"] = true;
                if (typeof (this.localSettings.values["sounds"]) === "undefined")
                    this.localSettings.values["sounds"] = true;
                if (typeof (this.localSettings.values["theme"]) === "undefined")
                    this.localSettings.values["theme"] = "standard";

                this.elements.music.winControl.checked = this.localSettings.values["music"];
                this.elements.sounds.winControl.checked = this.localSettings.values["sounds"];
                this.elements.theme.value = this.localSettings.values["theme"];
            }).bind(this));
        },

        optionsChange: function (event) {
            if (event.srcElement === this.elements.music) {
                this.localSettings.values["music"] = this.elements.music.winControl.checked;
            } else if (event.srcElement === this.elements.sounds) {
                this.localSettings.values["sounds"] = this.elements.sounds.winControl.checked;
            } else if (event.srcElement === this.elements.theme) {
                this.localSettings.values["theme"] = this.elements.theme.value;
            }
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
})();
