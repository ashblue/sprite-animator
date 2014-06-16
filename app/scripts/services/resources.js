'use strict';
(function () {
    window.sa = window.sa || {};

    /**
     * @ngdoc service
     * @name spriteAnimatorApp.resourceSrv
     * @description
     * # resourceSrv
     * Service in the spriteAnimatorApp
     */
    angular.module('spriteAnimatorApp')
        .service('resourceSrv', function resourceSrv (Collection, imageSrv, spriteSrv, timelineSrv) {
            var resourceSrv = new Collection();

            resourceSrv.add(imageSrv)
                .add(spriteSrv)
                .add(timelineSrv);

            window.sa.resources = resourceSrv;

            return resourceSrv;
        });
})();

