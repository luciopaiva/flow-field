"use strict";


class SvgHelper {

    /**
     * Sets SVG width and height.
     *
     * @param {string} elementId
     * @param {number} width
     * @param {number} height
     * @return {Element}
     */
    static resize(elementId, width, height) {
        const svg = document.getElementById(elementId);
        svg.setAttribute('width', width.toString());
        svg.setAttribute('height', height.toString());
        return svg;
    }

    /**
     * Clones element `template` as a new sibling element at the specified [x, y] coordinate.
     *
     * @param {Element} template
     * @param {number} x
     * @param {number} y
     * @param {number} angle
     */
    static cloneElement(template, x, y, angle) {
        const arrowElement = template.cloneNode(true);
        arrowElement.setAttribute('transform', `translate(${x},${y}),rotate(${angle})`);
        arrowElement.classList.remove('hidden');
        template.parentNode.appendChild(arrowElement);
    }
}
