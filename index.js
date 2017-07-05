"use strict";


class WindMapApp {

    constructor () {
        this.width = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--app-width'));
        this.height = Math.round(this.width / WindMapApp.ASPECT_RATIO);

        this.canvas = new CanvasManager('wind-map', this.width, this.height);
        this.engine = new WindEngine(100, WindMapApp.ASPECT_RATIO);
        this.fpsStat = new FpsStat(fps => console.info(fps));

        window.requestAnimationFrame((timestamp) => {
            this.lastTimestamp = timestamp;
            this.update(timestamp);
        });
    }

    /**
     * Hopefully called 60 times a second.
     * @param {number} timestamp - current time in millis
     */
    update(timestamp) {
        const dt = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        this.engine.update(dt);
        this.canvas.draw();
        this.fpsStat.update(timestamp);

        window.requestAnimationFrame(this.update.bind(this));
    }
}

WindMapApp.ASPECT_RATIO = 16 / 9;

new WindMapApp();
