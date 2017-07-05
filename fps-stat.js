"use strict";


class FpsStat {

    constructor (callback) {
        this.callback = callback;
        this.previousMark = 0;
        this.nextMark = 0;
        this.frameCount = 0;
    }

    update(timestamp) {
        this.frameCount++;
        if (this.nextMark < timestamp) {

            if (this.nextMark !== 0) {  // if it's not the very first update call, show FPS
                const elapsedMillis = timestamp - this.previousMark;
                const fps = Math.trunc(this.frameCount / (elapsedMillis / 1000));
                this.callback(fps);
            }

            this.frameCount = 0;
            this.previousMark = timestamp;
            this.nextMark = timestamp + 1000;
        }
    }
}
