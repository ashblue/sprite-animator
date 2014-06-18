'use strict';

(function () {
angular.module('spriteAnimatorApp')
    .controller('TimelinesCtrl', function ($rootScope, $scope, animSrv, timelineSrv, spriteSrv, frameSrv, scrubSrv) {
        var ctrl = this;
        this.list = timelineSrv.current;
        this.selected = null;
        this.show = false;
        this.anim = null;

        $scope.$on('setAnim', function (e, anim) {
            ctrl.clear();
            if (!anim || !anim._id) return;

            ctrl.show = true;
            ctrl.anim = anim;

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

        $scope.$on('setTimelineFrame', function (e, timeline) {
            $scope.$emit('setStageSelect', timeline);
            ctrl.setSelected(timeline);
        });

        $scope.$on('setTimeline', function (e, timeline) {
            $scope.$emit('setStageSelect', timeline);
            ctrl.selected = timeline._id;
        });

        // @TODO Is this even used?
        $scope.$on('clearSelectTimeline', function () {
            ctrl.selected = null;
        });

        $scope.$on('clearAnim', function () {
            ctrl.clear();
        });

        $scope.$on('removeTimeline', function (e, timeline) {
            ctrl.remove(timeline);
        });

        this.clear = function () {
            // Erase current array without destroying its memory reference (maintains array watch across controllers)
            this.list.splice(0, ctrl.list.length);
            this.selected = null;
            this.show = false;
            this.anim = null;
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
            var frame = frameSrv.getFrameIndex(timeline._id, scrubSrv.index);
            $rootScope.$broadcast('setFrame', frame);
            this.selected = timeline._id;
            $scope.$emit('setStageSelect', timeline);
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
            this.remove(timeline);
        };

        this.remove = function (timeline) {
            this.list.erase(timeline);
            this.selected = null;
            $scope.$emit('clearFrames', timeline);
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
                    timelineSrv.set(timeline, 'frames', frame._id);
                    animSrv.set(ctrl.anim, 'timelines', timeline._id);
                    ctrl.list.push(timeline);
                });
            });
        };
    });
})();

