'use strict';

/**
 * @ngdoc service
 * @name spriteAnimatorApp.animSrv
 * @description
 * # animSrv
 * Service in the spriteAnimatorApp.
 */
angular.module('spriteAnimatorApp')
    .factory('animSrv', function ($rootScope, Resource) {
        var animSrv = new Resource(window.CONFIG.animations.root, 'anims', {
            last: null,

            clean: function (anim) {
                var animGroupSrv = sa.resources.get('animGroups');
                var timelineSrv = sa.resources.get('timelines');

                animGroupSrv.list.forEach(function (animGroup) {
                    if (animGroup.animations.has(anim._id))
                        animGroupSrv.unset(animGroup, 'animations', anim._id);
                });

                var stack = [];
                anim.timelines.forEach(function (timelineId) {
                    var timeline = timelineSrv.get(timelineId);
                    stack.push(timeline);
                });

                // Delete the timelines in a separate stack so the cleanup doesn't conflict
                stack.forEach(function (timeline) {
                    $rootScope.$broadcast('removeTimeline', timeline);
                });
            },

            verify: function (success, error) {
                var animGroupSrv = sa.resources.get('animGroups');
                var errorMessage = sa.verify.dataRef(this, animGroupSrv, 'animations');
                if (errorMessage) error(errorMessage);

                success();
            }
        });

        return animSrv;
    });
