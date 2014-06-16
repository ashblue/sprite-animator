'use strict';

/**
 * @ngdoc service
 * @name spriteAnimatorApp.imageSrv
 * @description
 * # imageSrv
 * Service in the spriteAnimatorApp.
 */
angular.module('spriteAnimatorApp')
  .service('imageSrv', function imagesSrv (Resource) {
        var imageSrv = new Resource(window.CONFIG.images.root, 'images', {});
        return imageSrv;
  });
