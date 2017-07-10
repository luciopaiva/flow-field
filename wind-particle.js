"use strict";


class WindParticle {

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
        this.reset();
    }

    reset() {
        this.position = new Vector(this.initialPosition);
        this.velocity = new Vector(this.initialVelocity);
        this.timeToLive = Math.floor(Math.random() * WindParticle.INITIAL_TTL);
    }

    update() {
        if (--this.timeToLive <= 0) {
            this.reset();
        }
    }
}

WindParticle.INITIAL_TTL = 100;
