'use strict';

/**
 * @ngdoc filter
 * @name spriteAnimatorApp.filter:reverse
 * @function
 * @description
 * # reverse
 * Filter in the spriteAnimatorApp.
 */
angular.module('spriteAnimatorApp')
    .filter('reverse', function () {
        return function (items) {
            return items.slice().reverse();
        };
    });
