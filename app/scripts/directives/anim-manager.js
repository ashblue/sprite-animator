'use strict';

/**
 * @ngdoc directive
 * @name spriteAnimatorApp.directive:animManager
 * @description
 * # animManager
 */
angular.module('spriteAnimatorApp')
    .directive('animManager', function () {
        return {
            templateUrl: 'views/anim-manager.html',
            restrict: 'E'
        };
    });
