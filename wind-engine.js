"use strict";


class WindEngine {

    constructor (numParticles = WindEngine.DEFAULT_NUM_PARTICLES, worldAspectRatio = 16 / 9) {
        this.numParticles = numParticles;
        this.worldWidth = 1;
        this.worldHeight = 1 / worldAspectRatio;

        this.auxVector = new Vector(0, 0);

        /** @type {WindParticle[]} */
        this.particles = new Array(this.numParticles);

        for (let i = 0; i < this.numParticles; i++) {
            const x = Math.random() * this.worldWidth;
            const y = Math.random() * this.worldHeight;
            const vmag = Math.random() < 0.5 ? 0.01 : 0.02;  // magnitude of 1 means 100% of the canvas in 1 second
            const vx = vmag;
            const vy = -vmag;
            this.particles[i] = new WindParticle(new Vector(x, y), new Vector(vx, vy));
        }
    }

    *getParticles() {
        for (const particle of this.particles) {
            yield particle;
        }
    }

    update(dt) {
        for (const particle of this.particles) {
            this.auxVector.copy(particle.velocity).multiply(dt / 1000);
            particle.position.add(this.auxVector);

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
