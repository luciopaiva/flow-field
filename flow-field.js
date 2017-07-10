"use strict";


class FlowField {

    constructor (elementId, width, height, scale) {
        this.fieldWidth = 1;
        this.fieldHeight = height / width;

        // arrow field
        this.fieldGridSize = this.fieldWidth / FlowField.WIDTH_IN_GRID_CELLS;
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
        this.NORTH_VECTOR = new Vector(0, -1);  // vectors start pointing East by default

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
        document.addEventListener('keypress', (event) => this.onCommand(event));

        // auxiliary vectors
        this.mouseMovePreviousVector = new Vector(0, 0);
        this.mouseMoveDiffVector = new Vector(0, 0);
        this.queryAux = new Vector(0, 0);
    }

    /**
     * Query field vector at `point`, returning the result in `result`. Takes into account the nearest field vector.
     *
     * @param {Vector} point
     * @param {Vector} result
     */
    querySimple(point, result) {
        const index = this.fieldCoordinatesToIndex(
            Math.floor(this.gridWidth * point.x),
            Math.floor(this.gridWidth * point.y));
        result.set(this.field[index].vector);
    }

    /**
     * Query field vector at `point`, returning the result in `result`. Takes into account the nearest four vectors
     * surrounding the query point.
     *
     * @param {Vector} point
     * @param {Vector} result
     */
    queryBilinear(point, result) {
        const x = point.x;
        const y = point.y;

        const gridX = this.gridWidth * x;
        const gridY = this.gridWidth * y;

        // get vectors at surrounding corners
        const fieldCoordLoX = Math.floor(gridX);
        const fieldCoordLoY = Math.floor(gridY);
        const fieldCoordHiX = fieldCoordLoX + 1;
        const fieldCoordHiY = fieldCoordLoY + 1;

        // // query position relative to surrounding corners
        // const dx = gridX - fieldCoordLoX / this.fieldGridSize;
        // const dy = gridY - fieldCoordLoY / this.fieldGridSize;

        // field array indices
        const topLeft = this.fieldCoordinatesToIndex(fieldCoordLoX, fieldCoordLoY);
        const topRight = this.fieldCoordinatesToIndex(fieldCoordHiX, fieldCoordLoY);
        const bottomRight = this.fieldCoordinatesToIndex(fieldCoordHiX, fieldCoordHiY);
        const bottomLeft = this.fieldCoordinatesToIndex(fieldCoordLoX, fieldCoordHiY);

        // ToDo must calculate weighted average to be a real bilinear interpolation
        result.clear()
            .add(this.queryAux.copy(this.field[topLeft].vector))
            .add(this.queryAux.copy(this.field[topRight].vector))
            .add(this.queryAux.copy(this.field[bottomRight].vector))
            .add(this.queryAux.copy(this.field[bottomLeft].vector))
            .normalize();
    }

    fieldToSvgCoordinates(x, y) {
        // add 0.5 to offset first column/row a bit to the left/bottom when rendering arrows and center them on the SVG
        return [x * this.fieldGridSizeInPixels, y * this.fieldGridSizeInPixels];
    }

    svgToFieldCoordinates(x, y) {
        return [Math.floor(x / this.fieldGridSizeInPixels), Math.floor(y / this.fieldGridSizeInPixels)];
    }

    fieldCoordinatesToIndex(x, y) {
        if (x >= this.gridWidth) { x -= this.gridWidth; }
        if (y >= this.gridHeight) { y -= this.gridHeight; }
        return y * this.gridWidth + x;
    }

    onCommand(event) {
        const key = event.key.toLowerCase();

        switch (key) {
            case 'r': return this.randomField();
            case 'e': return this.eastField();
            case 'w': return this.westField();
            case 'c': return this.fieldCenter();
        }
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
            if (arrowIndex >= 0) {  // sometimes it gets negative! still don't know why
                const angle = -this.mouseMoveDiffVector.angle(this.BASE_VECTOR);

                // ToDo enlarge brush size and do this for each arrow affected
                const arrow = this.field[arrowIndex];
                this.updateFieldArrow(arrow, angle);
                this.mouseMovePreviousVector.set(event.offsetX, event.offsetY);
            }
        }
    }

    updateFieldArrow(arrow, angle) {
        arrow.vector.setFromAngle(angle);
        const angleInDegrees = angle * (180 / Math.PI);
        SvgHelper.transform(arrow.node, arrow.svgX, arrow.svgY, angleInDegrees,
            this.rotationCenter.x, this.rotationCenter.y);
    }

    randomField() {
        const TWO_PI = Math.PI * 2;
        for (const arrow of this.field) {
            this.updateFieldArrow(arrow, Math.random() * TWO_PI);
        }
    }

    eastField() {
        for (const arrow of this.field) {
            this.updateFieldArrow(arrow, 0);
        }
    }

    westField() {
        for (const arrow of this.field) {
            this.updateFieldArrow(arrow, Math.PI);
        }
    }

    fieldCenter() {
        const centerX = Math.round(this.gridWidth / 2);
        const centerY = Math.round(this.gridHeight / 2);
        const center = new Vector(centerX, centerY);
        const pVec = new Vector(0, 0);

        for (let ri = 0; ri < this.gridHeight; ri++) {
            for (let ci = 0; ci < this.gridWidth; ci++) {
                const angle = center.set(centerX, centerY).subtract(pVec.set(ci, ri)).angle(this.NORTH_VECTOR);
                // const angle = pVec.set(ci, ri).subtract(center)
                const arrowIndex = this.fieldCoordinatesToIndex(ci, ri);
                const arrow = this.field[arrowIndex];
                this.updateFieldArrow(arrow, angle);
            }
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
