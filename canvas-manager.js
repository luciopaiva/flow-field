"use strict";


class CanvasManager {

    constructor (elementId, width, height) {
        this.width = width;
        this.height = height;

        this.canvas = document.getElementById(elementId);
        this.canvas.setAttribute('width', width.toString());
        this.canvas.setAttribute('height', height.toString());

        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = '#aaa';
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * @param {Vector} v
     */
    drawParticle(v) {
        const side = 2;
        const x = this.width * v.x - side / 2;
        const y = this.width * v.y - side / 2;
        this.ctx.fillRect(x, y, side, side);
    }
}

