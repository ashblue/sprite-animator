'use strict';

/**
 * @ngdoc function
 * @name spriteAnimatorApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the spriteAnimatorApp
 */
angular.module('spriteAnimatorApp')
    .controller('HeaderCtrl', function ($scope, $location) {
        this.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    });
