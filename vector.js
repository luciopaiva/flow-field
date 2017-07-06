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
            this.z = v.z;
        } else if (args.length < 4) {
            const [x, y, z] = args;
            this.x = x;
            this.y = y;
            this.z = z ? z : 0;
        } else {
            throw new Error('Invalid number of arguments');
        }
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    multiply(v) {
        if (v instanceof Vector) {
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;
        } else {
            this.x *= v;
            this.y *= v;
            this.z *= v;
        }
        return this;
    }

    divide(v) {
        if (v instanceof Vector) {
            this.x /= v.x;
            this.y /= v.y;
            this.z /= v.z;
        } else {
            this.x /= v;
            this.y /= v;
            this.z /= v;
        }
        return this;
    }

    negative() {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
    }

    cross(v) {
        this.x = this.y * v.z - this.z * v.y;
        this.y = this.z * v.x - this.x * v.z;
        this.z = this.x * v.y - this.y * v.x;
        return this;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    unit() {
        return (new Vector(this)).divide(this.length());
    }

    length() {
        return Math.sqrt(this.dot(this));
    }
}