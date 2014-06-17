'use strict';

/**
 * @ngdoc service
 * @name spriteAnimatorApp.animGroupSrv
 * @description
 * # animGroupSrv
 * Service in the spriteAnimatorApp.
 */
angular.module('spriteAnimatorApp')
    .service('animGroupSrv', function ($rootScope, Resource, animSrv) {
        var animGroupSrv = new Resource(window.CONFIG.animationGroups.root, 'animGroups', {
            current: null, // Keeps a record of the current animation group in memory

            clean: function (animGroup) {
                // Find all animations, timelines, and frames. Then delete them
                var stack = [];
                animGroup.animations.forEach(function (id) {
                    stack.push(animSrv.get(id));
                });

                // Delete the animations in a separate stack so the cleanup doesn't conflict
                stack.forEach(function (anim) {
                    $rootScope.$broadcast('removeAnim', anim);
                });
            }
        });

        return animGroupSrv;
    });
