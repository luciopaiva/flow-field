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

        this.flowFieldSvg = SvgHelper.resize(elementId, width, height);
        const templateArrow = this.flowFieldSvg.querySelector('.field-arrow');

        this.BASE_VECTOR = new Vector(1, 0);  // base vector for angle calculation
        this.EAST_VECTOR = new Vector(1, 0);  // vectors start pointing East by default

        /** @type {{vector: Vector, svgX: number, svgY: number, node: Node}[]} */
        this.field = new Array(this.gridWidth * this.gridHeight);

        // initialize all vectors to point east
        for (let ri = 0; ri < this.gridHeight; ri++) {
            for (let ci = 0; ci < this.gridWidth; ci++) {
                const index = this.fieldCoordinatesToIndex(ci, ri);
                const [svgX, svgY] = this.fieldToSvgCoordinates(ci, ri);

                // render an equivalent arrow in the SVG element
                const angle = this.BASE_VECTOR.angleInDegrees(this.EAST_VECTOR);
                const node = SvgHelper.cloneElement(templateArrow, svgX, svgY, angle);

                this.field[index] = {
                    vector: new Vector(this.EAST_VECTOR),
                    svgX,
                    svgY,
                    node
                };
            }
        }

        this.flowFieldSvg.addEventListener('mousemove', (event) => this.onMouseMove(event));
        document.addEventListener('keydown', (event) => this.onKeyChange(event));
        document.addEventListener('keyup', (event) => this.onKeyChange(event));

        // auxiliary flow field editing vectors
        this.mouseMovePreviousVector = new Vector(0, 0);
        this.mouseMoveDiffVector = new Vector(0, 0);

    }

    fieldToSvgCoordinates(x, y) {
        // add 0.5 to offset first column/row a bit to the left/bottom when rendering arrows and center them on the SVG
        return [(x - 0.5) * this.fieldGridSizeInPixels, (y - 0.5) * this.fieldGridSizeInPixels];
    }

    svgToFieldCoordinates(x, y) {
        return [1 + Math.floor((x + 0.5) / this.fieldGridSizeInPixels), 1 + Math.floor((y + 0.5) / this.fieldGridSizeInPixels)];
    }

    fieldCoordinatesToIndex(x, y) {
        return y * this.gridWidth + x;
    }

    onKeyChange(event) {
        if (event.key === 'Shift') {
            // fade flow field in/out according to shift key state
            this.flowFieldSvg.style.opacity = event.shiftKey ? 1 : 0;
        }
    }

    onMouseMove(event) {
        this.mouseMoveDiffVector.set(event.offsetX, event.offsetY).subtract(this.mouseMovePreviousVector);

        // has to have some distance from first sample point to acquire enough resolution for the angle being computed
        if (event.shiftKey && this.mouseMoveDiffVector.length() >= 10) {
            const arrowIndex = this.fieldCoordinatesToIndex(...this.svgToFieldCoordinates(event.offsetX, event.offsetY));

            const angle = -this.mouseMoveDiffVector.angleInDegrees(this.BASE_VECTOR);

            // ToDo enlarge brush size and do this for each arrow affected
            const arrow = this.field[arrowIndex];
            SvgHelper.transform(arrow.node, arrow.svgX, arrow.svgY, angle);

            this.mouseMovePreviousVector.set(event.offsetX, event.offsetY);
        }
    }
}
