'use strict';

(function () {
angular.module('spriteAnimatorApp')
    .controller('TimelinesCtrl', function ($scope, animSrv, timelineSrv, spriteSrv, frameSrv, scrubSrv, zoomSrv) {
        var ctrl = this;
        this.list = timelineSrv.current;
        this.selected = null;
        this.show = false;

        $scope.$on('setAnim', function (e, anim) {
            ctrl.clear();
            if (!anim || !anim._id) return;

            ctrl.show = true;

            anim.timelines.forEach(function (id) {
                var data = timelineSrv.get(id);
                if (data) ctrl.list.push(data);
            });
        });

        // Used for drag and drop layers to re-order items
        $scope.$on('setTimelineLayerPos', function (e, id, zIndex) {
            $scope.$apply(function () {
                ctrl.setPos(id, zIndex);
            });
        });

        $scope.$on('selectSprite', function (e, sprite) {
            ctrl.add(sprite);
        });

        $scope.$on('setTimeline', function (e, timeline) {
            ctrl.selected = timeline._id;
        });

        // @TODO Is this even used?
        $scope.$on('clearSelectTimeline', function () {
            ctrl.selected = null;
        });

        $scope.$on('clearAnim', function () {
            ctrl.clear();
        });

        this.clear = function () {
            // Erase current array without destroying its memory reference (maintains array watch across controllers)
            this.list.splice(0, ctrl.list.length);
            this.selected = null;
            this.show = false;
            $scope.$emit('clearTimelines');
        };

        this.setPos = function (id, zIndex) {
            var timeline = timelineSrv.get(id);

            // For each timeline in the list with this.zIndex >= zIndex
            if (timeline.zIndex > zIndex) {
                ctrl.list.forEach(function (item) {
                    if (item === timeline) return;
                    if (item.zIndex >= zIndex) timelineSrv.set(item, 'zIndex', Math.min(item.zIndex + 1, ctrl.list.length - 1));
                });
            } else if (timeline.zIndex < zIndex) {
                ctrl.list.forEach(function (item) {
                    if (item === timeline) return;
                    if (item.zIndex <= zIndex) timelineSrv.set(item, 'zIndex', Math.max(item.zIndex - 1, 0));
                });
            }

            timeline.zIndex = zIndex;
        };

        this.toggleLock = function (e, timeline) {
            e.preventDefault();
            e.stopPropagation();
            timelineSrv.set(timeline, 'lock', !timeline.lock);
        };

        this.toggleShow = function (e, timeline) {
            e.preventDefault();
            e.stopPropagation();
            timelineSrv.set(timeline, 'show', !timeline.show);
        };

        // Set the clicked item to active and strip active from all exiting items
        this.setSelected = function (timeline) {
            // @TODO Come back and fix this after frames are working again
//            var frame = frameSrv.getFrameIndex(timeline._id, scrubSrv.index);
//            $scope.$emit('setFrame', frame);
            this.selected = timeline._id;
        };

        this.isSelected = function (timeline) {
            return this.selected === timeline._id;
        };

        // Find the corresponding sprite sheet and dumps the user on it
        this.showImage = function (timeline) {
            var spriteName = spriteSrv.get(timeline.sprite).name;
            window.location = '/#/sprites?spriteSearch=' + spriteName;
        };

        this.setName = function (e, timeline) {
            e.preventDefault();
            e.stopPropagation();

            var name = prompt('Enter Name', timeline.name);
            if (name && name !== '') timelineSrv.set(timeline, 'name', name);
        };

        this.removeSelected = function () {
            if (!this.selected) return;
            if (!window.sa.confirm.remove()) return;

            // Clean out all existing frames
            var timeline = timelineSrv.get(this.selected);
            this.list.erase(timeline);
            this.selected = null;
            $scope.$emit('removeTimeline', timeline);
            timelineSrv.destroy(timeline);
        };

        this.showSprite = function () {
            $('#sprite-modal').modal('show');
        };

        this.toggleHitbox = function () {
            CONFIG.hitBoxVisible = !CONFIG.hitBoxVisible;
        };

        this.add = function (sprite) {
            timelineSrv.create({
                name: sprite.name,
                sprite: sprite._id,
                frames: [],
                zIndex: this.list.length,
                lock: false,
                show: true
            }, function (timeline) {
                frameSrv.create({
                    "timeline": timeline._id,
                    "index": 0,
                    "frame": 0,
                    "x": 0,
                    "y": 0,
                    "alpha": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "angle": 0,
                    "length": 1,
                    "flipX": false,
                    "flipY": false,
                    "lock": true
                }, function (frame) {
                    timeline.frames.push(frame._id);
                    ctrl.list.push(timeline);
                });
            });
        };

        // @TODO All proceeding code is in a directive attribute
//        var drag = false, prevPos, xCurrent, yCurrent;
//        this.dragImageStart = function (e, timeline) {
//            if (this.isSelected(timeline)) {
//                drag = true;
//                xCurrent = frameSrv.current.x;
//                yCurrent = frameSrv.current.y;
//                prevPos = { x: e.clientX, y: e.clientY };
//            }
//        };
//
//        this.dragImageDuring = function (e) {
//            if (!drag) return;
//
//            var xChange = prevPos.x - e.clientX;
//            var xChangeScale = Math.floor(xChange / zoomSrv.scale);
//            var xNew = xCurrent - xChangeScale;
//            $scope.$emit('setFrameCurrent', 'x', xNew);
//
//            var yChange = prevPos.y - e.clientY;
//            var yChangeScale = Math.floor(yChange / zoomSrv.scale);
//            var yNew = yCurrent - yChangeScale;
//            $scope.$emit('setFrameCurrent', 'y', yNew);
//        };
//
//        this.dragImageEnd = function () {
//            drag = false;
//        };
    });
})();

