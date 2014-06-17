'use strict';

/**
 * @ngdoc directive
 * @name spriteAnimatorApp.directive:upload
 * @description
 * # upload
 */
angular.module('spriteAnimatorApp')
    .directive('uploadForm', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/upload.html',
            controller: 'UploadCtrl',
            controllerAs: 'uploadCtrl'
        };
    });
