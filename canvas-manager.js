"use strict";


class CanvasManager {

    constructor (elementId, width, height) {
        this.width = width;
        this.height = height;

        this.canvas = document.getElementById(elementId);
        this.canvas.setAttribute('width', width.toString());
        this.canvas.setAttribute('height', height.toString());

        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = 'black';
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    draw() {

    }
}

