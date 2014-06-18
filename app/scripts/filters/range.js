'use strict';

/**
 * @ngdoc filter
 * @name spriteAnimatorApp.filter:range
 * @function
 * @description
 * # range
 * Filter in the spriteAnimatorApp.
 */
angular.module('spriteAnimatorApp')
    .filter('range', function () {
        return function (input, total) {
            total = parseInt(total);
            for (var i = 0; i < total; i++)
                input.push(i);
            return input;
        };
    });
