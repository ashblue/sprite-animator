'use strict';

angular.module('spriteAnimatorApp')
    .factory('frameSrv', function ($rootScope, Resource) {
        var frameSrv = new Resource(window.CONFIG.frames.root, 'frames', {
            current: null,

            clean: function (frame) {
                // @TODO Why is this commented out?
//                spriteSrv.list.forEach(function (sprite) {
//                    if (sprite.image === image._id) {
//                        $rootScope.$broadcast('removeSprite', sprite);
//                    }
//                });
            },

            verify: function (success, error) {
                var timelineSrv = sa.resources.get('timelines');
                var errorMessage = sa.verify.dataRef(this, timelineSrv, 'frames');
                if (errorMessage) error(errorMessage);
                success();
            },

            getSprite: function (frame) {
                var spriteSrv = sa.resources.get('sprites');
                var timelineSrv = sa.resources.get('timelines');

                return spriteSrv.get(timelineSrv.get(frame.timeline).sprite);
            },

            getImage: function (frame) {
                var imageSrv = sa.resources.get('images');
                var sprite = this.getSprite(frame);
                return imageSrv.get(sprite.image);
            },

            /**
             * Finds and returns the nearest frame to the requested index
             * @param timeline {*} Timeline object or ID
             * @param index {number} Requested frame index
             * @returns {object}
             */
            getFrameIndex: function (timeline, index) {
                var timelineSrv = sa.resources.get('timelines');

                if (typeof timeline !== 'object') timeline = timelineSrv.get(timeline);
                var result = { index: Number.NEGATIVE_INFINITY };
                var frame;

                timeline.frames.forEach(function (id) {
                    frame = frameSrv.get(id);
                    if (frame.index <= index && frame.index > result.index) result = frame;
                });

                return result;
            }
        });

        return frameSrv;
    });
