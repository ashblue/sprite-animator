'use strict';

(function () {
    var app = angular.module('spriteAnimatorApp');
    app.controller('FramesCtrl', function ($scope, timelineSrv, frameSrv, scrubSrv) {
        var disabled = false; // Used to prevent double creating elements on the timeline
        var ctrl = this;

        $scope.$on('clearFrames', function (e) {
            ctrl.clear();
        });

        $scope.$on('$destroy', function (e) {
            ctrl.clear();
        });

        $scope.$on('removeFrame', function (e, frame) {
            ctrl.remove(frame);
        });

        $scope.$on('setFrame', function (e, frame) {
            ctrl.setFrame(frame);
        });

        $scope.$on('setFrameCurrent', function (e, key, val) {
            frameSrv.set(frameSrv.current._id, key, val);
        });

        this.add = function (e, timeline) {
            if (disabled) return;
            var index = $(e.target).index();
            if (index === 0) return; // Never create something at the 0 index
            disabled = true;

            // Grab the previous frame and make a duplicate copy for insertion into the timeline
            var prevframe = frameSrv.getFrameIndex(timeline._id, index);
            var frame = window.sa.object.merge({}, prevframe);
            frame.index = index;
            frame.lock = false;
            frame.length = 1;
            delete frame.$$hashKey;
            delete frame._id;

            frameSrv.create(frame, function (item) {
                disabled = false;
                timeline.frames.push(item._id);
                ctrl.setFrame(item);
            });
        };

        this.setFrame = function (frame) {
            scrubSrv.index = frame.index;

            $scope.$emit('setFrameContext', frame);

            if (frameSrv.current === frame) {
                $scope.$emit('showFrameContext', frame);
            } else {
                frameSrv.current = frame;
                $scope.$emit('setTimeline', timelineSrv.get(frame.timeline));
                $scope.$emit('setFrame', frame);
            }
        };

        // Wipe the current active frame from memory
        this.clear = function () {
            $scope.$emit('clearFrame', frameSrv.current);
            frameSrv.current = null;
        };

        // Is the current frame active?
        this.isActive = function (frame) {
            return (frameSrv.current ? frameSrv.current._id === frame._id : false);
        };

        // Destory a key frame
        this.remove = function (frame) {
            var timeline = timelineSrv.get(frame.timeline);
            timeline.frames.erase(frame._id);
            if (this.isActive(frame)) frameSrv.current = null;
            $scope.$emit('clearFrame');
            frameSrv.destroy(frame);
        };

        // Calculates the correct position for a frame since they're all free floating
        this.getPos = function (frame) {
            var $tick = $('.tick-background .tick:first');
            return {
                left: frame.index * $tick.outerWidth(true),
                width: $tick.outerWidth() * frame.length
            };
        };

        // Runs a populate command to get all the frames
        this.getFrames = function (timeline) {
            return timeline.frames.map(function (id) {
                return frameSrv.get(id);
            });
        };
    });

    var _event = {};

    // Throws up the DAT GUI display
    app.controller('FrameEditorCtrl', function ($scope, frameSrv) {
        var self = this;
        var $gui = $('#dat-gui');
        var gui = new dat.GUI({ autoPlace: false });
        var guiPos = gui.addFolder('Position');
        var guiDetails = gui.addFolder('Details');

        // Hack to make property changes save on changed models
        _event.addDirt = function (val) {
            // In-case of isNaN corruption on a negative (damned DAT Gui) force the corrupted value to 0
            if (typeof val === 'number' && isNaN(val)) {
                for (var key in this) {
                    var target = this[key];
                    if (typeof target === 'number' && isNaN(target)) this[key] = 0;
                }
            }

            frameSrv.addDirt(this._id);
            $scope.$apply();
        };

        $gui.append(gui.domElement).hide();

        $scope.$on('setFrame', function (e, frame) {
            self.setFrame(frame);
        });

        ['clearFrame', 'clearTimelines'].forEach(function (call) {
            $scope.$on(call, function () {
                self.clearFrame();
            });
        });

        this.setFrame = function (frame) {
            this.clearFrame();

            // Looks nasty but we have to monitor all the model properties for changes so they can be saved to the server
            guiPos.add(frame, 'x').onChange(_event.addDirt.bind(frame));
            guiPos.add(frame, 'y').onChange(_event.addDirt.bind(frame));
            guiPos.open();

            guiDetails.add(frame, 'frame', 0).onChange(_event.addDirt.bind(frame));
            guiDetails.add(frame, 'alpha', 0, 1).step(0.01).onChange(_event.addDirt.bind(frame));
            guiDetails.add(frame, 'flipX').onChange(_event.addDirt.bind(frame));
            guiDetails.add(frame, 'flipY').onChange(_event.addDirt.bind(frame));
            guiDetails.add(frame, 'pivotX', 0).onChange(_event.addDirt.bind(frame));
            guiDetails.add(frame, 'pivotY', 0).onChange(_event.addDirt.bind(frame));
            guiDetails.add(frame, 'angle', 0, 360).onChange(_event.addDirt.bind(frame));
            guiDetails.open();

            $gui.show();
        };

        this.clearFrame = function () {
            $gui.hide();

            guiPos.__controllers.forEach(function (c) {
                guiPos.remove(c);
            });
            guiPos.__controllers = [];

            guiDetails.__controllers.forEach(function (c) {
                guiDetails.remove(c);
            });
            guiDetails.__controllers = [];
        };

        $scope.$on('$destroy', function () {
            $('#dat-gui').children().detach();
        });
    });

    // DAT GUI container
    app.directive('frameProperties', function() {
        return {
            restrict: 'E',
            templateUrl: 'views/frames/frames-properties-view.html',
            controller: 'FrameEditorCtrl',
            controllerAs: 'framesEditorCtrl'
        };
    });

    app.controller('FramesContextCtrl', function ($scope, frameSrv, timelineSrv) {
        var ctrl = this;
        this.current = null;
        this.currentImage = {};

        $scope.$on('showFrameContext', function (e, frame) {
            ctrl.show(frame);
        });

        ['clearFrame', 'clearTimelines'].forEach(function (call) {
            $scope.$on(call, function () {
                ctrl.current = null;
            });
        });

        this.show = function (frame) {
            var $container = $('#frame-context-select');
            var image = frameSrv.getImage(frame);
            var sprite = frameSrv.getSprite(frame);
            var frameWidth = image.width / sprite.width;

            this.currentImage = image;
            this.current = frame;

            var pos = this.getFramePos(frame, frame.frame);

            $('.frame-context-current-box').css(pos);
        };

        this.setHighlight = function (e) {
            // Turn event coordinates into a frame position
            var sprite = frameSrv.getSprite(this.current);
            var image = frameSrv.getImage(this.current);
            var parentOffset = $(e.currentTarget).offset();
            var widthAdjust = $(e.currentTarget).width() / image.width; // Percentage change from the real width and height
            var heightAdjust = $(e.currentTarget).height() / image.height;
            var x = (e.pageX - parentOffset.left) / widthAdjust;
            var y = (e.pageY - parentOffset.top) / heightAdjust;

            // We must figure out how large the stretched frame size is
            var frame = Math.max(Math.floor(x / sprite.width), 0) +  // x pos
                (Math.floor(y / sprite.height) * (image.width / sprite.width)); // y pos

            // Get position via getFramePos
            var pos = this.getFramePos(this.current, frame);
            $('.frame-context-select-box').css(pos).show();
        };

        this.highlightClear = function () {
            $('.frame-context-select-box').hide();
        };

        this.setFrame = function (e) {
            var sprite = frameSrv.getSprite(this.current);
            var image = frameSrv.getImage(this.current);
            var parentOffset = $(e.currentTarget).offset();
            var widthAdjust = $(e.currentTarget).width() / image.width; // Percentage change from the real width and height
            var heightAdjust = $(e.currentTarget).height() / image.height;
            var x = (e.pageX - parentOffset.left) / widthAdjust;
            var y = (e.pageY - parentOffset.top) / heightAdjust;
            var frame = Math.max(Math.floor(x / sprite.width), 0) +  // x pos
                (Math.floor(y / sprite.height) * (image.width / sprite.width)); // y pos

            this.current.frame = frame;
            this.show(this.current);
            frameSrv.addDirt(this.current._id);
            $scope.$emit('setFrame', this.current);
        };

        this.getFramePos = function (frame, framePos) {
            var image = frameSrv.getImage(frame);
            var sprite = frameSrv.getSprite(frame);
            var frameWidth = image.width / sprite.width;

            return {
                width: (sprite.width / image.width) * 100 + '%',
                height: (sprite.height / image.height) * 100 + '%',
                left: ((framePos === 0 ? 0 : (framePos % frameWidth) * sprite.width) / image.width) * 100 + '%',
                top: ((Math.floor(framePos / frameWidth) * sprite.height) / image.height) * 100 + '%'
            }
        };

        this.hide = function () {
            this.current = null;
        };

        this.remove = function () {
            var frame = this.current;
            var timeline = timelineSrv.get(frame.timeline);
            timeline.frames.erase(frame._id);
            $scope.$emit('clearFrame', frame);
            $scope.$emit('removeFrame', frame);
        };
    });

    app.directive('frameContext', function() {
        return {
            restrict: 'E',
            templateUrl: 'views/frames/frames-context-view.html',
            controller: 'FramesContextCtrl',
            controllerAs: 'framesContextCtrl',
            link: function (scope, el, attr) {
                el.draggable({ handle: '.modal-drag' });
            }
        };
    });
})();

