"use strict";


class FlowFieldApp {

    constructor () {
        this.scale = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--app-width'));
        this.width = this.scale;
        this.height = Math.round(this.scale / FlowFieldApp.ASPECT_RATIO);

        this.flowField = new FlowField('flow-field', this.width, this.height, this.scale);

        this.flowEngine = new FlowEngine(this.flowField, FlowEngine.DEFAULT_NUM_PARTICLES, FlowFieldApp.ASPECT_RATIO);

        this.canvasManager = new CanvasManager('flow-map', this.width, this.height, CanvasManager.RENDER_MODE_LINES);

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

        if (dt < 200) {  // avoid huge deltas; they might break the simulation by sending particles way off bounds
            this.flowEngine.update(dt);

            this.canvasManager.clear();
            for (const particle of this.flowEngine.getParticles()) {
                this.canvasManager.drawParticle(particle.position);
            }

            this.fpsStat.update(timestamp);
        }

        window.requestAnimationFrame(this.update.bind(this));
    }
}

FlowFieldApp.ASPECT_RATIO = FlowField.WIDTH_IN_GRID_CELLS / 22;  // originally 16:9, but adjusted so the grid fits nicely

new FlowFieldApp();
