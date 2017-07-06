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

    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

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

    negative() {
        this.x *= -1;
        this.y *= -1;
        return this;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    unit() {
        return (new Vector(this)).divide(this.length());
    }

    length() {
        return Math.sqrt(this.dot(this));
    }
}