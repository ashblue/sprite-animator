'use strict';

/**
 * @ngdoc service
 * @name spriteAnimatorApp.imageSrv
 * @description
 * # imageSrv
 * Service in the spriteAnimatorApp.
 */
angular.module('spriteAnimatorApp')
  .service('imageSrv', function imagesSrv ($rootScope, Resource, spriteSrv) {
        var imageSrv = new Resource(window.CONFIG.images.root, 'images', {
            clean: function (id) {
                spriteSrv.list.forEach(function (sprite) {
                    if (sprite.image === id) {
                        $rootScope.$broadcast('removeSprite', sprite);
                    }
                });
            },

            verify: function (success, error) {
                var errorMessage = sa.verify.data(this, spriteSrv, 'image');

                if (errorMessage) error(errorMessage);
                success();
            }
        });

        return imageSrv;
  });
