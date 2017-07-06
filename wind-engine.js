"use strict";


class WindEngine {

    constructor (numParticles = WindEngine.DEFAULT_NUM_PARTICLES, worldAspectRatio = 16 / 9) {
        this.numParticles = numParticles;
        this.worldWidth = 1;
        this.worldHeight = 1 / worldAspectRatio;

        this.particles = new Array(this.numParticles);
        for (let i = 0; i < this.numParticles; i++) {
            const x = Math.random() * this.worldWidth;
            const y = Math.random() * this.worldHeight;
            this.particles[i] = new WindParticle(new Vector(x, y), new Vector(1, 0));
        }
    }

    *getParticles() {
        for (const particle of this.particles) {
            yield particle;
        }
    }

    update(dt) {

    }
}

WindEngine.DEFAULT_NUM_PARTICLES = 10000;
