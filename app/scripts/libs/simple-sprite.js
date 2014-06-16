(function () {
    'use strict';

    var SETTINGS = {
        scale: 1, // How much to scale the Canvas up by
        target: 'canvas', // Id or element to append the Canvas element to
        speed: 1, // Speed per frame
        sequenceIndex: 0, // Current sequence item
        sequence: [0], // Animation sequence for the sprite
        frame: 0, // Currently displayed frame
        repeat: false, // Should this sprite loop infinitely?
        flipX: false, // Flip the drawn image horizontally
        flipY: false, // Flip the drawn image vertically
        spriteSheet: null, // Sprite sheet used for resampling
        _loaded: false // Triggered when the image data is fully loaded
    };

    var _event = {
        imageReady: function (spriteSheet) {
            this.spriteSheet = spriteSheet;

            // Number of frames
            this.frameWidth = (this.spriteSheet.canvas.width / (this.width * this.scale));
            this.frameHeight = (this.spriteSheet.canvas.height / (this.height * this.scale));

            this._loaded = true;
            this.draw();
        }
    };

    var _private = {
        setTransform: function (value) {
            this.canvas.style.mozTransform = value;
            this.canvas.style.webkitTransform = value;
            this.canvas.style.transform = value;
        }
    };

    /**
     * Allows you to quickly create a sprite animation on the fly (lightweight)
     * @param image {string|object} Canvas element, url, or dataurl
     * @param width {number} Size of a frame on the sprite, should be the real size of the image (not scaled)
     * @param height {number}
     * @param options {object} @see SETTINGS
     * @returns {*}
     * @constructor
     */
    var SimpleSprite = function (image, width, height, options) {
        // Inject settings
        for (var key in SETTINGS) {
            this[key] = SETTINGS[key];
        }

        if (typeof options === 'object') {
            for (var key in options) {
                this[key] = options[key];
            }
        }

        // Setup the Canvas at the correct location
        if (this.target.nodeName === 'CANVAS') {
            this.canvas = this.target;

        } else if (typeof this.target === 'string') {
            this.target = document.getElementById(this.target);

            if (this.target.nodeName === 'CANVAS') {
                this.canvas = this.target;
            } else {
                this.canvas = document.createElement('canvas');
                this.target.appendChild(this.canvas);
            }

        } else { // Assumed target is a parent element
            this.canvas = document.createElement('canvas');
            this.target.appendChild(this.canvas);
        }

        this.setCanvas(width, height, this.scale);
        this.ctx = this.canvas.getContext('2d');
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;

        new SimpleSpriteSheet(image, {
            scale: this.scale,
            callback: _event.imageReady.bind(this)
        });
    };

    SimpleSprite.prototype.setCanvas = function (width, height, scale) {
        if (scale) this.scale = scale;
        if (width) this.width = width;
        if (height) this.height = height;

        this.canvas.width = this.width * this.scale;
        this.canvas.height = this.height * this.scale;

        if (this.flipX && this.flipY) {
            _private.setTransform.apply(this, ['scale(-1, -1)']);
        } else if (this.flipX) {
            _private.setTransform.apply(this, ['scale(-1, 1)']);
        } else if (this.flipY) {
            _private.setTransform.apply(this, ['scale(1, -1)']);
        }
    };

    SimpleSprite.prototype.setScale = function (scale) {
        this.setCanvas(null, null, scale);
        this.spriteSheet.draw(scale);

        this.frameWidth = (this.spriteSheet.canvas.width / (this.width * this.scale));
        this.frameHeight = (this.spriteSheet.canvas.height / (this.height * this.scale));

        this.draw();
    };

    SimpleSprite.prototype.draw = function () {
        if (!this._loaded) return;
        this.ctx.clearRect(0, 0, this.width * this.scale, this.height * this.scale);
        var frameX = this.frame % this.frameWidth; // Current frame pos
        var frameY = Math.floor(this.frame / this.frameWidth);

        this.ctx.drawImage(this.spriteSheet.canvas,
            this.width * this.scale * frameX, this.height * this.scale * frameY, this.width * this.scale, this.height * this.scale,
            0, 0, this.width * this.scale, this.height * this.scale);
    };

    SimpleSprite.prototype.update = function () {
        if (this.sequenceIndex >= this.sequence.length - 1) {
            if (this.repeat) this.sequenceIndex = 0;
        } else {
            this.sequenceIndex += 1;
        }

        this.frame = this.sequence[this.sequenceIndex];

        this.draw();
    };

    SimpleSprite.prototype.setFrame = function (frame) {
        this.frame = frame;
        this.draw();
    };

    SimpleSprite.prototype.rewind = function () {
        this.stop();
        this.play();
    };

    SimpleSprite.prototype.play = function () {
        if (this.timer) window.clearInterval(this.timer);
        this.frame = this.sequence[this.sequenceIndex];
        this.draw();
        this.timer = window.setInterval(this.update.bind(this), this.speed * 1000);
    };

    SimpleSprite.prototype.stop = function () {
        if (this.timer) window.clearInterval(this.timer);
        this.sequenceIndex = 0;
        this.frame = this.sequence[this.sequenceIndex];
        this.draw();
    };

    SimpleSprite.prototype.pause = function () {
        if (this.timer) window.clearInterval(this.timer);
    };

    window.SimpleSprite = SimpleSprite;
})();