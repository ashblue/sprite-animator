'use strict';

/**
 * @ngdoc service
 * @name spriteAnimatorApp.Zoom
 * @description
 * # Zoom
 * Service in the spriteAnimatorApp.
 */
angular.module('spriteAnimatorApp')
    .service('zoomSrv', function ZoomSrv () {
        return {
            scale: window.CONFIG.scale
        };
    });
