(function () {
    'use strict';

    var SETTINGS = {
        scale: 1, // How much to scale the Canvas up by
        _loaded: false,
        debugId: 'simple-sprite-image',
        callback: null // Only fired immediately after first load
    };

    var _event = {
        imageReady: function () {
            this._loaded = true;
            this.draw();
            if (this.callback) this.callback(this);
        }
    };

    var SimpleSpriteSheet = function (image, options) {
        // Inject settings
        for (var key in SETTINGS) {
            this[key] = SETTINGS[key];
        }

        if (typeof options === 'object') {
            for (var key in options) {
                this[key] = options[key];
            }
        }

        // Setup the Canvas properly
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        var debug = document.getElementById('simple-sprite-image');
        if (debug) debug.appendChild(this.canvas);

        if (typeof image === 'string') {
            this.image = new Image();
            this.image.onload = _event.imageReady.bind(this);
            this.image.src = image;
        } else {
            this.image = image;
            _event.imageReady.call(this);
        }
    };

    SimpleSpriteSheet.prototype.draw = function (scale) {
        if (!this._loaded) return;
        if (scale) this.scale = scale;

        this.canvas.width = this.image.width * this.scale;
        this.canvas.height = this.image.height * this.scale;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    };

    window.SimpleSpriteSheet = SimpleSpriteSheet;
})();