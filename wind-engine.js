"use strict";


class WindEngine {

    /**
     * @param {FlowField} flowField
     * @param {number} numParticles
     * @param {number} worldAspectRatio
     */
    constructor (flowField, numParticles = WindEngine.DEFAULT_NUM_PARTICLES, worldAspectRatio = 16 / 9) {
        this.flowField = flowField;
        this.numParticles = numParticles;
        this.worldWidth = 1;
        this.worldHeight = 1 / worldAspectRatio;

        // reusable auxiliary vectors
        this.desiredAcceleration = new Vector(0, 0);
        this.resultingVelocity = new Vector(0, 0);

        /** @type {WindParticle[]} */
        this.particles = new Array(this.numParticles);

        // particles
        for (let i = 0; i < this.numParticles; i++) {
            const x = Math.random() * this.worldWidth;
            const y = Math.random() * this.worldHeight;
            const maxVelocity = Math.random() < 0.5 ? 0.05 : 0.10;  // mag of 1 means the whole canvas width in 1 second
            const vx = maxVelocity;
            const vy = 0;
            this.particles[i] = new WindParticle(new Vector(x, y), new Vector(vx, vy), maxVelocity);
        }
    }

    *getParticles() {
        for (const particle of this.particles) {
            yield particle;
        }
    }

    update(dt) {
        // ToDo make particles steer more gracefully
        for (const particle of this.particles) {
            particle.update();

            // calculate desired acceleration vector based on flow field
            this.flowField.queryBilinear(particle.position, this.desiredAcceleration);
            this.desiredAcceleration.multiply(particle.maxVelocity);

            // steer
            const steerEaseFactor = 0.05;  // otherwise particles will steer too abruptly
            this.desiredAcceleration.subtract(particle.velocity).limit(particle.maxVelocity * steerEaseFactor);
            particle.acceleration.add(this.desiredAcceleration);

            // update particle position
            particle.velocity.add(particle.acceleration).limit(particle.maxVelocity);

            this.resultingVelocity.copy(particle.velocity).multiply(dt / 1000);

            particle.position.add(this.resultingVelocity);
            particle.acceleration.clear();

            this.positionWrapCheck(particle);
        }
    }

    positionWrapCheck(particle) {
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

WindEngine.DEFAULT_NUM_PARTICLES = 10000;
