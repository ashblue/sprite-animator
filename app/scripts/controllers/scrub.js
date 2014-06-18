(function () {
    'use strict';

    var app = angular.module('spriteAnimatorApp');

    var _event = {
        disable: function (e) {
            e.preventDefault();
        }
    };

    var currentAnim = { length: 0 };
    app.controller('ScrubCtrl', function ($scope, scrubSrv) {
        $scope.$on('setAnim', function (e, anim) {
            currentAnim = anim;
        });

        this.setIndex = function (e) {
            var pos = $(e.currentTarget).getMousePos(e);
            var frameWidth = $('.tick:first').outerWidth(true);
            var index = Math.floor(pos.x / frameWidth);

            // Turn the clicked position into a real index value
            scrubSrv.index = index;
        };

        this.getPos = function () {
            // Get width of a single frame
            var frameWidth = $('.tick:first').outerWidth(true);

            // Turn the frame width into a CSS left position
            return {
                left: (scrubSrv.index || 0) * frameWidth + 'px'
            };
        };

        this.getDurationWidth = function () {
            var width = $('.tick:first').outerWidth(true);
            var widthFactor = currentAnim ? currentAnim.length : 0;

            return {
                width: widthFactor * width
            };
        };

        $scope.$on('$destroy', function () {
            currentAnim = { length: 0 };
        });
    });

    app.controller('ScrubPlaybackCtrl', function ($scope, scrubSrv) {
        var ctrl = this;
        var interval;
        var currentAnim = {};

        $scope.$on('setAnim', function (e, anim) {
            currentAnim = anim;
        });

        this.play = function () {
            this.clear();
            if (scrubSrv.index >= currentAnim.length - 1) scrubSrv.index = 0;

            interval = setInterval(function () {
                $scope.$apply(function () {
                    if (scrubSrv.index + 1 >= currentAnim.length) clearInterval(interval);
                    else scrubSrv.index += 1;
                });
            }, currentAnim.speed * 1000);
        };

        this.rewind = function () {
            scrubSrv.index = 0;
            this.play();
        };

        this.stop = function () {
            this.clear();
            scrubSrv.index = 0;
        };

        this.clear = function () {
            if (interval) clearInterval(interval);
        };

        $scope.$on('$destroy', function () {
            ctrl.clear();
        });
    });

    app.directive('scrubPlayback', function() {
        return {
            restrict: 'E',
            templateUrl: 'views/scrub/scrub-view-playback.html',
            controller: 'ScrubPlaybackCtrl',
            controllerAs: 'scrubPlaybackCtrl'
        };
    });

    app.directive('scrub', function() {
        return {
            restrict: 'E',
            templateUrl: 'views/scrub/scrub-view.html',
            controller: 'ScrubCtrl',
            controllerAs: 'scrubCtrl'
        };
    });

    app.directive('scrubList', function() {
        return {
            restrict: 'E',
            templateUrl: 'views/scrub/scrub-view-list.html'
        };
    });

    app.directive('scrubDuration', function() {
        return {
            restrict: 'E',
            templateUrl: 'views/scrub/scrub-view-duration.html'
        };
    });

    app.directive('scrubDropZone', function () {
        return {
            restrict: 'A',
            link: function($scope, el, attr) {
                el[0].ondrop = function (e) {
                    var width = $('.tick:first').outerWidth(true);
                    var pos = $(el).getMousePos(e);
                    var duration = Math.floor(pos.x / width);
                    $scope.$apply(function () {
                        if (duration || duration === 0) currentAnim.length = duration + 1;
                    });
                };

                el.bind('dragover', _event.disable);
                el.bind('dragenter', _event.disable);
            }
        }
    });
})();
