'use strict';

/**
 * @ngdoc function
 * @name spriteAnimatorApp.controller:ZoomCtrl
 * @description
 * # ZoomCtrl
 * Controller of the spriteAnimatorApp
 */
angular.module('spriteAnimatorApp')
  .controller('ZoomCtrl', function ($scope, zoomData) {
        this.scale = zoomData.scale;

        this.setScale = function () {
            zoomData.scale = this.scale;
            $scope.$emit('changeZoom', this.scale);
        };
    });
