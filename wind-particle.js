"use strict";


class WindParticle {

    /**
     * @param {Vector} position
     * @param {Vector} velocity
     * @param {number} maxVelocity
     */
    constructor (position, velocity, maxVelocity) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = new Vector(0, 0);
        this.maxVelocity = maxVelocity;
    }
}
