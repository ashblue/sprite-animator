'use strict';

/**
 * @ngdoc function
 * @name spriteAnimatorApp.controller:ZoomCtrl
 * @description
 * # ZoomCtrl
 * Controller of the spriteAnimatorApp
 */
angular.module('spriteAnimatorApp')
  .controller('ZoomCtrl', function ($scope, zoomSrv) {
        this.scale = zoomSrv.scale;

        this.setScale = function () {
            zoomSrv.scale = this.scale;
            $scope.$emit('changeZoom', this.scale);
        };
    });
