'use strict';

/**
 * @ngdoc service
 * @name spriteAnimatorApp.timelineSrv
 * @description
 * # timelineSrv
 * Service in the spriteAnimatorApp.
 */
angular.module('spriteAnimatorApp')
  .factory('timelineSrv', function ($rootScope, Resource, frameSrv, animSrv) {
        var timelineSrv = new Resource(window.CONFIG.timelines.root, 'timelines', {
            current: [],

            clean: function (timeline) {
                // Remove all animation references
                animSrv.list.forEach(function (anim) {
                    if (anim.timelines.has(timeline._id)) {
                        anim.timelines.erase(timeline._id);
                    }
                });

                var frames = [];
                timeline.frames.forEach(function (id) {
                    frames.push(frameSrv.get(id));
                });
                frames.forEach(function (frame) {
                    $rootScope.$broadcast('removeFrame', frame);
                });
            },

            verify: function (success, error) {
                var errorMessage = sa.verify.dataRef(this, animSrv, 'timelines');
                if (errorMessage) error(errorMessage);
                success();
            }
        });

        return timelineSrv;
  });
