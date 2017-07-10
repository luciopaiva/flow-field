"use strict";


class SvgHelper {

    static createElement(tagName, attributes, value) {
        const elem = document.createElementNS('http://www.w3.org/2000/svg', tagName);
        if (attributes) {
            Object.keys(attributes).forEach(attributeName => elem.setAttribute(attributeName, attributes[attributeName]));
        }
        if (value) {
            const textNode = document.createTextNode(value);
            elem.appendChild(textNode);
        }
        return elem;
    }

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
     * Clones element `template`.
     *
     * @param {Element} template
     * @return {Node}
     */
    static cloneElement(template) {
        const arrowElement = template.cloneNode(true);
        arrowElement.classList.remove('hidden');
        return arrowElement;
    }

    static transform(node, x, y, angle, rotationX = 0, rotationY = 0) {
        node.setAttribute('transform', `translate(${x},${y}),rotate(${angle} ${rotationX} ${rotationY})`);
    }
}
