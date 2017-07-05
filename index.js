"use strict";


class WindMapApp {

    constructor () {
        const ratio = 16 / 9;
        this.width = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--app-width'));
        this.height = Math.round(this.width / ratio);

        this.canvas = new CanvasManager('wind-map', this.width, this.height);
    }
}

new WindMapApp();
