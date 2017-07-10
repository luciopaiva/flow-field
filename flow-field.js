"use strict";


class FlowField {

    constructor (elementId, width, height, scale) {
        this.fieldWidth = 1;
        this.fieldHeight = height / width;

        // arrow field
        this.fieldGridSize = this.fieldWidth / 40;
        this.fieldGridSizeInPixels = this.fieldGridSize * scale;
        // console.info(`Grid size is ${this.fieldGridSizeInPixels} pixels`);
        this.rotationCenter = new Vector(this.fieldGridSizeInPixels / 2, this.fieldGridSizeInPixels / 2);
        this.gridWidth = Math.ceil(this.fieldWidth / this.fieldGridSize);
        this.gridHeight = Math.ceil(this.fieldHeight / this.fieldGridSize);

        this.flowFieldSvg = SvgHelper.resize(elementId, width, height);
        const templateArrow = this.flowFieldSvg.querySelector('.field-arrow');

        // this.debugGrid(scale);

        this.BASE_VECTOR = new Vector(1, 0);  // base vector for angle calculation
        this.EAST_VECTOR = new Vector(1, 0);  // vectors start pointing East by default

        /** @type {{vector: Vector, svgX: number, svgY: number, node: Node}[]} */
        this.field = new Array(this.gridWidth * this.gridHeight);

        const groupArrows = SvgHelper.createElement('g');
        // initialize all vectors to point east
        for (let ri = 0; ri < this.gridHeight; ri++) {
            for (let ci = 0; ci < this.gridWidth; ci++) {
                const index = this.fieldCoordinatesToIndex(ci, ri);
                const [svgX, svgY] = this.fieldToSvgCoordinates(ci, ri);

                // render an equivalent arrow in the SVG element
                const angle = this.BASE_VECTOR.angleInDegrees(this.EAST_VECTOR);
                const node = SvgHelper.cloneElement(templateArrow);
                groupArrows.appendChild(node);
                SvgHelper.transform(node, svgX, svgY, angle);

                this.field[index] = {
                    vector: new Vector(this.EAST_VECTOR),
                    svgX,
                    svgY,
                    node
                };
            }
        }
        this.flowFieldSvg.appendChild(groupArrows);

        this.flowFieldSvg.addEventListener('mousemove', (event) => this.onMouseMove(event));
        document.addEventListener('keydown', (event) => this.onKeyChange(event));
        document.addEventListener('keyup', (event) => this.onKeyChange(event));

        // auxiliary flow field editing vectors
        this.mouseMovePreviousVector = new Vector(0, 0);
        this.mouseMoveDiffVector = new Vector(0, 0);
    }

    /**
     * Query field vector at `point`, returning the result in `result`. Takes into account the nearest four vectors
     * surrounding the query point.
     *
     * @param {Vector} point
     * @param {Vector} result
     */
    query(point, result) {
        const index = this.fieldCoordinatesToIndex(
            Math.floor(this.gridWidth * point.x),
            Math.floor(this.gridWidth * point.y));
        result.set(this.field[index].vector);

        // const x = point.x;
        // const y = point.y;
        //
        // const fieldCoordLoX = Math.floor((this.gridWidth - 1) * x);
        // const fieldCoordHiX = Math.ceil((this.gridWidth - 1) * x);
        // const fieldCoordLoY = Math.floor((this.gridHeight - 1) * y);
        // const fieldCoordHiY = Math.ceil((this.gridHeight - 1) * y);
        //
        // const topLeft = this.fieldCoordinatesToIndex(fieldCoordLoX, fieldCoordLoY);
        // const topRight = this.fieldCoordinatesToIndex(fieldCoordHiX, fieldCoordLoY);
        // const bottomRight = this.fieldCoordinatesToIndex(fieldCoordHiX, fieldCoordHiY);
        // const bottomLeft = this.fieldCoordinatesToIndex(fieldCoordLoX, fieldCoordHiY);
        //
        // result.clear()
        //     .add(this.field[topLeft].vector)
        //     .add(this.field[topRight].vector)
        //     .add(this.field[bottomRight].vector)
        //     .add(this.field[bottomLeft].vector)
        //     .normalize();
    }

    fieldToSvgCoordinates(x, y) {
        // add 0.5 to offset first column/row a bit to the left/bottom when rendering arrows and center them on the SVG
        return [x * this.fieldGridSizeInPixels, y * this.fieldGridSizeInPixels];
    }

    svgToFieldCoordinates(x, y) {
        return [Math.floor(x / this.fieldGridSizeInPixels), Math.floor(y / this.fieldGridSizeInPixels)];
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

            const angle = -this.mouseMoveDiffVector.angle(this.BASE_VECTOR);

            // ToDo enlarge brush size and do this for each arrow affected
            const arrow = this.field[arrowIndex];
            const angleInDegrees = angle * (180 / Math.PI);
            arrow.vector.set(Math.cos(angle), Math.sin(angle));
            SvgHelper.transform(arrow.node, arrow.svgX, arrow.svgY, angleInDegrees,
                this.rotationCenter.x, this.rotationCenter.y);

            this.mouseMovePreviousVector.set(event.offsetX, event.offsetY);
        }
    }

    debugGrid(scale) {
        const gridGroup = SvgHelper.createElement('g', {id: 'debug-grid'});
        const path = new SvgPath();

        // rows
        for (let ri = 0; ri < this.gridHeight; ri++) {
            const y = ri * this.fieldGridSizeInPixels;
            path.move(0, y).horizontal(this.gridWidth * scale);
            const text = SvgHelper.createElement('text', {x: '0', y, 'text-anchor': 'start', dy: 10},
                `${ri + 1}/${this.gridHeight}`);
            gridGroup.appendChild(text);
        }
        // columns
        for (let ci = 0; ci < this.gridWidth; ci++) {
            const x = ci * this.fieldGridSizeInPixels;
            path.move(x, 0).vertical(this.gridWidth * scale);
            const text = SvgHelper.createElement('text', {x, y: '0', 'text-anchor': 'start', dx: 2, dy: 22},
                `${ci + 1}/${this.gridWidth}`);
            gridGroup.appendChild(text);
        }

        const gridPath = SvgHelper.createElement('path', {d: path.build()});
        gridGroup.appendChild(gridPath);
        this.flowFieldSvg.appendChild(gridGroup);
    }
}

FlowField.WIDTH_IN_GRID_CELLS = 40;
