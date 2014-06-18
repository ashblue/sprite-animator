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
        .factory('resourceSrv', function resourceSrv (Collection, imageSrv, spriteSrv, animGroupSrv, animSrv, timelineSrv) {
            var resourceSrv = new Collection();

            resourceSrv.add(imageSrv)
                .add(spriteSrv)
                .add(animGroupSrv)
                .add(animSrv)
                .add(timelineSrv);

            window.sa.resources = resourceSrv;

            return resourceSrv;
        });
})();

