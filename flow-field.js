"use strict";


class FlowField {

    constructor (elementId, width, height, scale) {
        this.fieldWidth = 1;
        this.fieldHeight = height / width;

        // arrow field
        this.fieldGridSize = this.fieldWidth / 40;
        this.fieldGridSizeInPixels = this.fieldGridSize * scale;
        this.gridWidth = Math.ceil(this.fieldWidth / this.fieldGridSize) + 1;
        this.gridHeight = Math.ceil(this.fieldHeight / this.fieldGridSize) + 1;

        const flowFieldSvg = SvgHelper.resize(elementId, width, height);
        const templateArrow = flowFieldSvg.querySelector('.field-arrow');

        const BASE = new Vector(-1, 1);  // base vector for angle calculation
        const EAST = new Vector(1, 0);  // vectors start pointing East by default

        /** @type {Vector[]} */
        this.field = new Array(this.gridWidth * this.gridHeight);

        // initialize all vectors to point east
        for (let i = 0; i < this.gridHeight; i++) {
            for (let j = 0; j < this.gridWidth; j++) {
                this.field[i * this.gridWidth + j] = new Vector(EAST);

                // render an equivalent arrow in the SVG element
                const x = j * this.fieldGridSizeInPixels;
                const y = i * this.fieldGridSizeInPixels;
                const angle = BASE.angleInDegrees(EAST);
                SvgHelper.cloneElement(templateArrow, x, y, angle);
            }
        }

        flowFieldSvg.addEventListener('mousemove', (event) => this.onMouseMove(event));

        this.mouseMovePreviousVector = new Vector(0, 0);
        this.mouseMoveDiffVector = new Vector(0, 0);
        this.mouseMoveBaseVector = new Vector(1, 0);

    }

    onMouseMove(event) {
        this.mouseMoveDiffVector.set(event.offsetX, event.offsetY).subtract(this.mouseMovePreviousVector);
        if (this.mouseMoveDiffVector.length() >= 10) {
            const angle = this.mouseMoveDiffVector.angleInDegrees(this.mouseMoveBaseVector);
            console.info(angle);
            this.mouseMovePreviousVector.set(event.offsetX, event.offsetY);
        }
    }
}
