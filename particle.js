"use strict";


class Particle {

    /**
     * @param {Vector} position
     * @param {Vector} velocity
     * @param {number} maxVelocity
     */
    constructor (position, velocity, maxVelocity) {
        this.initialPosition = position;
        this.initialVelocity = velocity;
        this.maxVelocity = maxVelocity;
        this.acceleration = new Vector(0, 0);
        this.reset(velocity);
    }

    reset(desiredVelocity) {
        this.position = new Vector(this.initialPosition);
        this.initialVelocity.set(desiredVelocity);
        this.velocity = this.initialVelocity;
        this.timeToLive = Math.floor(Math.random() * Particle.INITIAL_TTL);
    }

    update(desiredVelocity) {
        if (--this.timeToLive <= 0) {
            this.reset(desiredVelocity);
        }
    }
}

Particle.INITIAL_TTL = 100;
