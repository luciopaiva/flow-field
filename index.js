"use strict";


class WindMapApp {

    constructor () {
        this.scale = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--app-width'));
        this.width = this.scale;
        this.height = Math.round(this.scale / WindMapApp.ASPECT_RATIO);

        this.windEngine = new WindEngine(WindEngine.DEFAULT_NUM_PARTICLES, WindMapApp.ASPECT_RATIO);

        this.canvasManager = new CanvasManager('wind-map', this.width, this.height);

        // Flow field stuff
        const flowFieldSvg = document.getElementById('flow-field');
        const templateArrow = flowFieldSvg.querySelector('.field-arrow');
        this.svgFlowField = new SvgManager('flow-field', this.width, this.height);
        for (const arrow of this.windEngine.flowField) {
            const arrowElement = templateArrow.cloneNode(true);
            const x = arrow.x * this.scale;
            const y = arrow.y * this.scale;
            arrowElement.setAttribute('transform', `translate(${x},${y})`);
            arrowElement.classList.remove('hidden');
            flowFieldSvg.appendChild(arrowElement);
        }
        flowFieldSvg.addEventListener('mousemove', (event) => this.onMouseMove(event));

        this.mouseMovePreviousVector = new Vector(0, 0);
        this.mouseMoveDiffVector = new Vector(0, 0);
        this.mouseMoveBaseVector = new Vector(1, 0);

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

    onMouseMove(event) {
        this.mouseMoveDiffVector.set(event.offsetX, event.offsetY).subtract(this.mouseMovePreviousVector);
        if (this.mouseMoveDiffVector.length() >= 10) {
            const angle = this.mouseMoveDiffVector.angleInDegrees(this.mouseMoveBaseVector);
            console.info(angle);
            this.mouseMovePreviousVector.set(event.offsetX, event.offsetY);
        }
    }
}

WindMapApp.ASPECT_RATIO = 16 / 9;

new WindMapApp();
