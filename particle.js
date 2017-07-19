"use strict";


class Particle {

    /**
     * @param {number} maxVelocity
     * @param {number} worldWidth
     * @param {number} worldHeight
     */
    constructor (maxVelocity, worldWidth, worldHeight) {
        this.maxVelocity = maxVelocity;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.position = new Vector(0, 0);
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.reset(this.velocity);
    }

    resetPosition() {
        const x = Math.random() * this.worldWidth;
        const y = Math.random() * this.worldHeight;
        this.position.set(x, y);
        this.timeToLive = Math.floor(Math.random() * Particle.INITIAL_TTL);
    }

    resetVelocity(velocity) {
        this.velocity.set(velocity);
    }

    reset(desiredVelocity) {
        this.resetPosition();
        this.resetVelocity(desiredVelocity);
    }

    checkTimeToLive() {
        const hasToReset = --this.timeToLive <= 0;
        if (hasToReset) {
            this.resetPosition();
        }
        return hasToReset;
    }
}

Particle.INITIAL_TTL = 100;
