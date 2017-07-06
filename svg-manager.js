"use strict";


class SvgManager {

    constructor (elementId, width, height) {
        this.width = width;
        this.height = height;

        this.svg = document.getElementById(elementId);
        this.svg.setAttribute('width', width.toString());
        this.svg.setAttribute('height', height.toString());
    }
}
