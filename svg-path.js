

class SvgPath {

    constructor () {
        this.path = '';
    }

    move(x, y) {
        this.path += `M${x} ${y} `;
        return this;
    }

    horizontal(x) {
        this.path += `H${x} `;
        return this;
    }

    vertical(y) {
        this.path += `V${y} `;
        return this;
    }

    build() {
        return this.path;
    }
}
