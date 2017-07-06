"use strict";


class WindEngine {

    constructor (numParticles = WindEngine.DEFAULT_NUM_PARTICLES, worldAspectRatio = 16 / 9) {
        this.numParticles = numParticles;
        this.worldWidth = 1;
        this.worldHeight = 1 / worldAspectRatio;

        /** @type {WindParticle[]} */
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
        const dv = new Vector(.0001, -.0001);
        for (const particle of this.particles) {
            particle.position.add(dv);

            // wrap particle around horizontal axis
            if (particle.position.x > this.worldWidth) {
                particle.position.x -= this.worldWidth;
            } else if (particle.position.x < 0) {
                particle.position.x += this.worldWidth;
            }

            // wrap particle around vertical axis
            if (particle.position.y > this.worldHeight) {
                particle.position.y -= this.worldHeight;
            } else if (particle.position.y < 0) {
                particle.position.y += this.worldHeight;
            }
        }
    }
}

WindEngine.DEFAULT_NUM_PARTICLES = 10000;
