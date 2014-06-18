'use strict';

angular.module('spriteAnimatorApp')
    .controller('MainCtrl', function ($scope) {
        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };
    });
