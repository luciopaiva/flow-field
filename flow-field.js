"use strict";


class FlowField {

    constructor (elementId, width, height, scale) {
        this.fieldWidth = 1;
        this.fieldHeight = height / width;

        // arrow field
        this.fieldGridSize = this.fieldWidth / 40;
        this.fieldGridSizeInPixels = this.fieldGridSize * scale;
        this.gridWidth = Math.ceil(this.fieldWidth / this.fieldGridSize) + 2;
        this.gridHeight = Math.ceil(this.fieldHeight / this.fieldGridSize) + 2;

        const flowFieldSvg = SvgHelper.resize(elementId, width, height);
        const templateArrow = flowFieldSvg.querySelector('.field-arrow');

        const BASE = new Vector(1, 0);  // base vector for angle calculation
        const EAST = new Vector(1, 0);  // vectors start pointing East by default

        /** @type {Vector[]} */
        this.field = new Array(this.gridWidth * this.gridHeight);
        /** @type {Map<number, Node>} */
        this.elementByArrowIndex = new Map();

        // initialize all vectors to point east
        for (let ri = 0; ri < this.gridHeight; ri++) {
            for (let ci = 0; ci < this.gridWidth; ci++) {
                const index = ri * this.gridWidth + ci;
                this.field[index] = new Vector(EAST);

                // render an equivalent arrow in the SVG element
                const [x, y] = this.fieldToSvgCoordinates(ci, ri);
                const angle = BASE.angleInDegrees(EAST);
                this.elementByArrowIndex.set(index, SvgHelper.cloneElement(templateArrow, x, y, angle));
            }
        }

        flowFieldSvg.addEventListener('mousemove', (event) => this.onMouseMove(event));

        this.mouseMovePreviousVector = new Vector(0, 0);
        this.mouseMoveDiffVector = new Vector(0, 0);
        this.mouseMoveBaseVector = new Vector(1, 0);

    }

    fieldToSvgCoordinates(x, y) {
        // add 0.5 to offset first column/row a bit to the left/bottom when rendering arrows and center them on the SVG
        return [(x - 0.5) * this.fieldGridSizeInPixels, (y - 0.5) * this.fieldGridSizeInPixels];
    }

    svgToFieldCoordinates(x, y) {
        return [1 + Math.floor((x + 0.5) / this.fieldGridSizeInPixels), 1 + Math.floor((y + 0.5) / this.fieldGridSizeInPixels)];
    }

    getArrowElementByFieldCoordinate(x, y) {
        return this.elementByArrowIndex.get(y * this.gridWidth + x);
    }

    onMouseMove(event) {
        this.mouseMoveDiffVector.set(event.offsetX, event.offsetY).subtract(this.mouseMovePreviousVector);

        // has to have some distance from first sample point to acquire enough resolution for the angle being computed
        if (this.mouseMoveDiffVector.length() >= 10) {
            const [x, y] = this.svgToFieldCoordinates(event.offsetX, event.offsetY);
            const [svgX, svgY] = this.fieldToSvgCoordinates(x, y);
            const arrow = this.getArrowElementByFieldCoordinate(x, y);
            const angle = this.mouseMoveDiffVector.angleInDegrees(this.mouseMoveBaseVector);
            SvgHelper.transform(arrow, svgX, svgY, -angle);
            this.mouseMovePreviousVector.set(event.offsetX, event.offsetY);
        }
    }
}
