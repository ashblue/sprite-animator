'use strict';

angular.module('spriteAnimatorApp')
    .controller('MainCtrl', function ($scope, $sce) {
        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };
    });
