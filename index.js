"use strict";


class WindMapApp {

    constructor () {
        this.scale = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--app-width'));
        this.width = this.scale;
        this.height = Math.round(this.scale / WindMapApp.ASPECT_RATIO);

        this.windEngine = new WindEngine(WindEngine.DEFAULT_NUM_PARTICLES, WindMapApp.ASPECT_RATIO);

        this.canvasManager = new CanvasManager('wind-map', this.width, this.height);

        this.flowField = new FlowField('flow-field', this.width, this.height, this.scale);

        this.fpsElement = document.getElementById('fps');
        this.fpsStat = new FpsStat(fps => this.fpsElement.innerText = fps + ' FPS');

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

        this.windEngine.update(dt);

        this.canvasManager.clear();
        for (const particle of this.windEngine.getParticles()) {
            this.canvasManager.drawParticle(particle.position);
        }

        this.fpsStat.update(timestamp);

        window.requestAnimationFrame(this.update.bind(this));
    }
}

WindMapApp.ASPECT_RATIO = 16 / 9;

new WindMapApp();
