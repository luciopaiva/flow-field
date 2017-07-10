"use strict";


class Vector {

    /**
     * Creates a new vector.
     *
     * @param {Vector|[number,number,number]} args - either a Vector or an array of numbers (2 or 3) corresponding to
     *                                               the vector magnitude in each dimension
     */
    constructor (...args) {
        if (args.length === 1) {
            const v = args[0];
            this.x = v.x;
            this.y = v.y;
        } else if (args.length === 2) {
            const [x, y] = args;
            this.x = x;
            this.y = y;
        } else {
            throw new Error('Invalid number of arguments');
        }
    }

    clear() {
        this.x = 0;
        this.y = 0;
        return this;
    }

    /**
     * Sets this vector's coordinates.
     * @param {number|Vector} x
     * @param {number?} y
     * @return {Vector} returns itself so it can be chained
     */
    set(x, y) {
        if (x instanceof Vector) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
        return this;
    }

    /**
     * Copies v into this vector.
     * @param {Vector} v
     * @return {Vector} returns itself so it can be chained
     */
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    /**
     * Adds v to this vector (modifies this vector).
     * @param {Vector|number} v
     * @return {Vector} returns itself so it can be chained
     */
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    /**
     * Subtracts v from this vector (modifies this vector).
     * @param {Vector|number} v
     * @return {Vector} returns itself so it can be chained
     */
    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    /**
     * Multiplies this vector by v, which can be a vector or a scalar (modifies this vector).
     * @param {Vector|number} v
     * @return {Vector} returns itself so it can be chained
     */
    multiply(v) {
        if (v instanceof Vector) {
            this.x *= v.x;
            this.y *= v.y;
        } else {
            this.x *= v;
            this.y *= v;
        }
        return this;
    }

    /**
     * Divides this vector by v, which can be a vector or a scalar (modifies this vector).
     * @param {Vector|number} v
     * @return {Vector} returns itself so it can be chained
     */
    divide(v) {
        if (v instanceof Vector) {
            this.x /= v.x;
            this.y /= v.y;
        } else {
            this.x /= v;
            this.y /= v;
        }
        return this;
    }

    /**
     * Invert this vector.
     * @return {Vector} returns itself so it can be chained
     */
    negative() {
        this.x *= -1;
        this.y *= -1;
        return this;
    }

    /**
     * Dot-product between this vector and v.
     * @param {Vector} v
     * @return {number}
     */
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    /**
     * Cross-product between this vector and v.
     * @param {Vector} v
     * @return {number}
     */
    cross(v) {
        return this.x * v.y - this.y * v.x;
    }

    /**
     * Transforms the vector into its equivalent unit vector.
     * @return {Vector} returns itself so it can be chained
     */
    normalize() {
        return this.divide(this.length());
    }

    /**
     * Limit vector magnitude to a maximum `value`.
     * @param {number} value
     * @return {Vector} returns itself so it can be chained
     */
    limit(value) {
        const magnitude = this.length();
        if (magnitude > value) {
            this.multiply(value / magnitude);
        }
        return this;
    }

    /**
     * A scalar representing the length of the vector (a.k.a. magnitude).
     * @return {number}
     */
    length() {
        return Math.sqrt(this.dot(this));
    }

    /**
     * Returns the angle between this vector and v, in radians.
     * @param {Vector} v - the other vector
     * @return {number} angle in radians
     */
    angle(v) {
        return Math.atan2(this.cross(v), this.dot(v));
    }

    /**
     * Returns the angle between this vector and v, in degrees.
     * @param {Vector} v - the other vector
     * @return {number} angle in degrees
     */
    angleInDegrees(v) {
        return this.angle(v) * 180 / Math.PI;
    }
}