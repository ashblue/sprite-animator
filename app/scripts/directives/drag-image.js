'use strict';

(function () {
    var drag = false, prevPos, xCurrent, yCurrent;

    $(window).mouseup(function () {
        drag = false;
    });

    angular.module('spriteAnimatorApp')
        .directive('dragImage', function () {
            return {
                restrict: 'A',
                link: function (scope, el, attrs) {
                    el.mousedown(function (e) {
                        // @TODO Set clicked timeline as active
//                        if (this.isSelected(timeline)) {
                            drag = true;
                            xCurrent = frameSrv.current.x;
                            yCurrent = frameSrv.current.y;
                            prevPos = { x: e.clientX, y: e.clientY };
//                        }
                    });
                }
            };
        })
        .directive('dragImageArea', function ($rootScope, zoomSrv) {
            return {
                restrict: 'A',
                link: function (scope, el, attrs) {
                    el.mousemove(function (e) {
                        if (!drag) return;

                        var xChange = prevPos.x - e.clientX;
                        var xChangeScale = Math.floor(xChange / zoomSrv.scale);
                        var xNew = xCurrent - xChangeScale;
                        $rootScope.$broadcast('setFrameCurrent', 'x', xNew);

                        var yChange = prevPos.y - e.clientY;
                        var yChangeScale = Math.floor(yChange / zoomSrv.scale);
                        var yNew = yCurrent - yChangeScale;
                        $rootScope.$broadcast('setFrameCurrent', 'y', yNew);
                    });

                    // All of our cleanup for the private vars should be done here
                    scope.$on('destroy', function () {
                        drag = false;
                    });
                }
            };
        });
})();

