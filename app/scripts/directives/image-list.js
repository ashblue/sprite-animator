'use strict';

/**
 * @ngdoc directive
 * @name spriteAnimatorApp.directive:imageList
 * @description
 * # imageList
 */
angular.module('spriteAnimatorApp')
    .directive('imageList', function () {
        return {
            templateUrl: 'views/image-list.html',
            restrict: 'E',
            controller: 'ImagesCtrl',
            controllerAs: 'imagesCtrl'
        };
    });
