'use strict';

/**
 * @ngdoc service
 * @name spriteAnimatorApp.spriteSrv
 * @description
 * # spriteSrv
 * Service in the spriteAnimatorApp.
 */
angular.module('spriteAnimatorApp')
  .factory('spriteSrv', function ($rootScope, Resource) {
        var spriteSrv = new Resource(window.CONFIG.sprites.root, 'sprites', {
            clean: function (sprite) {
                var timelineSrv = window.sa.resources.get('timelines');
                var timelines = [];
                timelineSrv.list.forEach(function (timeline) {
                    if (timeline.sprite === sprite._id) timelines.push(timeline);
                });

                timelines.forEach(function (timeline) {
                    $rootScope.$broadcast('removeTimeline', timeline);
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
