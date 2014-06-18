'use strict';

(function () {
angular.module('spriteAnimatorApp')
    .controller('FramesCtrl', function ($scope, timelineSrv, frameSrv) {
        var disabled = false; // Used to prevent double creating elements on the timeline
        var ctrl = this;

        $scope.$on(['clearFrames', '$destroy'], function (e) {
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
            if (frameSrv.current === frame) {
                $scope.$emit('showFrameContext');
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
})();

