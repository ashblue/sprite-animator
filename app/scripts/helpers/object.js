(function () {
    'use strict';

    window.sa = window.sa || {};
    var object = {
        /**
         * Merge two hashes into 1
         * @param target {object}
         * @param h1 {object}
         * @param h2 {object}
         * @returns {object}
         */
        merge: function (target, h1, h2) {
            for (var key in h1) {
                target[key] = h1[key];
            }

            if (h2) {
                for (var key in h2) {
                    target[key] = h2[key];
                }
            }

            return target;
        },

        /**
         * Turn an existing JSON object into a loopable array
         * @param target {object}
         * @example Result [{ key: 'name', value: 'val' }]
         */
        toArray: function (target) {
            var stack = [];
            for (var key in target) {
                stack.push({ key: key, value: target[key] });
            }

            return stack;
        },

        /**
         * Takes a string of dot notation and uses it to apply a value to the target hash
         * @param target {object}
         * @param dotNotation {string} Must be only 1 level deep, example 'pos.x'
         * @param value {*}
         * @returns {object}
         */
        setDotNotation: function (target, dotNotation, value) {
            var a = dotNotation.split('.');
            for (var i = 0, l = a.length - 1, prev = target; i < l; i++) {
                if (!prev[a[i]]) {
                    prev = prev[a[i]] = {};
                } else {
                    prev = prev[a[i]];
                }
            }

            prev[a.pop()] = value;

            return target;
        },

        getDotNotation: function (target, dotNotation) {
            var a = dotNotation.split('.');
            for (var i = 0, l = a.length, prev = target; i < l; i++) {
                prev = prev[a[i]];
            }

            return prev;
        }
    };

    window.sa.object = object;
}());