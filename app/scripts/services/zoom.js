'use strict';

/**
 * @ngdoc service
 * @name spriteAnimatorApp.Zoom
 * @description
 * # Zoom
 * Service in the spriteAnimatorApp.
 */
angular.module('spriteAnimatorApp')
    .service('zoomData', function Zoom() {
        return {
            scale: window.CONFIG.scale
        };
    });
