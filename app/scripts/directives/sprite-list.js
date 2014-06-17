'use strict';

/**
 * @ngdoc directive
 * @name spriteAnimatorApp.directive:spriteList
 * @description
 * # spriteList
 */
angular.module('spriteAnimatorApp')
    .directive('spriteList', function () {
        return {
            templateUrl: 'views/sprite-list.html',
            restrict: 'E',
            controller: 'SpritesCtrl',
            controllerAs: 'spritesCtrl'
        };
    });
