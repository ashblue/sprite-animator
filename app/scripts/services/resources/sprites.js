'use strict';

/**
 * @ngdoc service
 * @name spriteAnimatorApp.spriteSrv
 * @description
 * # spriteSrv
 * Service in the spriteAnimatorApp.
 */
angular.module('spriteAnimatorApp')
  .service('spriteSrv', function ($rootScope, Resource) {
        var spriteSrv = new Resource(window.CONFIG.sprites.root, 'sprites', {
            clean: function (sprite) {
                var timelineSrv = window.sa.resources.get('timelines');
                timelineSrv.list.forEach(function (timeline) {
                    if (timeline.sprite === sprite._id) {
                        $rootScope.$broadcast('removeTimeline', timeline);

                        // @TODO Should be performed in the remove timeline logic
//                        animSrv.list.forEach(function (anim) {
//                            if (anim.timelines.has(timeline._id)) {
//                                anim.timelines.erase(timeline._id);
//                                animSrv.addDirt(anim._id);
//                            }
//                        });
                    }
                });
            },

            verify: function (success, error) {
                var timelineSrv = window.sa.resources.get('timelines');
                var errorMessage = sa.verify.data(this, timelineSrv, 'sprite');

                if (errorMessage) error(errorMessage);
                success();
            }
        });

        return spriteSrv;
    });
