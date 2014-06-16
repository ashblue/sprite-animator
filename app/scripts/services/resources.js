'use strict';

/**
 * @ngdoc service
 * @name spriteAnimatorApp.resourceSrv
 * @description
 * # resourceSrv
 * Service in the spriteAnimatorApp
 */
angular.module('spriteAnimatorApp')
    .service('resourceSrv', function resourceSrv (Collection, imageSrv) {
        var resourceSrv = new Collection();

        resourceSrv.add(imageSrv);

        return resourceSrv;
    });
