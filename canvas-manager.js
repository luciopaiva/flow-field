"use strict";


class CanvasManager {

    constructor (elementId, width, height, renderMode) {
        this.width = width;
        this.height = height;
        this.renderMode = renderMode;

        this.canvas = document.getElementById(elementId);
        this.canvas.setAttribute('width', width.toString());
        this.canvas.setAttribute('height', height.toString());

        this.ctx = this.canvas.getContext('2d');
        this.particleSize = 2;
        if (this.renderMode === CanvasManager.RENDER_MODE_DOTS) {
            this.ctx.fillStyle = 'rgb(20,20,20)';
            this.ctx.clearRect(0, 0, this.width, this.height);
        } else if (this.renderMode === CanvasManager.RENDER_MODE_LINES) {
            this.ctx.fillStyle = 'rgb(20,20,20)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.particleSize = .75;
        }
    }

    clear() {
        if (this.renderMode === CanvasManager.RENDER_MODE_DOTS) {
            this.ctx.fillStyle = 'rgb(20,20,20)';
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = '#aaa';
        } else if (this.renderMode === CanvasManager.RENDER_MODE_LINES) {
            this.ctx.fillStyle = 'rgba(20,20,20,0.02)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = 'rgb(100,100,100)';
        }
    }

    /**
     * @param {Vector} v
     */
    drawParticle(v) {
        const x = this.width * v.x - this.particleSize / 2;
        const y = this.width * v.y - this.particleSize / 2;
        this.ctx.fillRect(x, y, this.particleSize, this.particleSize);
    }
}

CanvasManager.RENDER_MODE_DOTS = 1;
CanvasManager.RENDER_MODE_LINES = 2;
