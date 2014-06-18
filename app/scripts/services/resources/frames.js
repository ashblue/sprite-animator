'use strict';

angular.module('spriteAnimatorApp')
    .factory('frameSrv', function ($rootScope, Resource) {
        var frameSrv = new Resource(window.CONFIG.images.root, 'frames', {
            clean: function (frame) {
//                spriteSrv.list.forEach(function (sprite) {
//                    if (sprite.image === image._id) {
//                        $rootScope.$broadcast('removeSprite', sprite);
//                    }
//                });
            }

//            verify: function (success, error) {
//                var errorMessage = sa.verify.data(this, spriteSrv, 'image');
//                if (errorMessage) error(errorMessage);
//                success();
//            }
        });

        return frameSrv;
    });
