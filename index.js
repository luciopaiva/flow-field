"use strict";


class WindMapApp {

    constructor () {
        this.width = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--app-width'));
        this.height = Math.round(this.width / WindMapApp.ASPECT_RATIO);

        this.engine = new WindEngine(WindEngine.DEFAULT_NUM_PARTICLES, WindMapApp.ASPECT_RATIO);

        this.canvas = new CanvasManager('wind-map', this.width, this.height);

        // Flow field stuff
        const flowFieldSvg = document.getElementById('flow-field');
        const templateArrow = flowFieldSvg.querySelector('.field-arrow');
        this.svgFlowField = new SvgManager('flow-field', this.width, this.height);
        for (const arrow of this.engine.flowField) {
            const arrowElement = templateArrow.cloneNode(true);
            const x = arrow.x * this.width;
            const y = arrow.y * this.width;
            arrowElement.setAttribute('transform', `translate(${x},${y})`);
            arrowElement.classList.remove('hidden');
            flowFieldSvg.appendChild(arrowElement);
        }

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

        this.engine.update(dt);

        this.canvas.clear();
        for (const particle of this.engine.getParticles()) {
            this.canvas.drawParticle(particle.position);
        }

        this.fpsStat.update(timestamp);

        window.requestAnimationFrame(this.update.bind(this));
    }
}

WindMapApp.ASPECT_RATIO = 16 / 9;

new WindMapApp();
