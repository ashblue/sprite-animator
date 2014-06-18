'use strict';

(function () {
    var _event = {
        disable: function (e) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    /**
     * @ngdoc directive
     * @name spriteAnimatorApp.directive:timelines
     * @description
     * # timelines
     */
    angular.module('spriteAnimatorApp')
        .directive('timeline',function () {
            return {
                templateUrl: 'views/timeline.html',
                restrict: 'E',
                controller: 'TimelinesCtrl',
                controllerAs: 'timelinesCtrl'
            };
        }).directive('dragAndDropTimelines', function (timelineSrv) {
            return {
                restrict: 'A',
                link: function ($scope, el, attr) {
                    el[0].ondragstart = function (e) {
                        e.dataTransfer.setData('id', attr.id);
                    };

                    el[0].ondrop = function (e) {
                        var id = e.dataTransfer.getData('id');
                        var zIndex = $(this).index(0);
                        $scope.$emit('setTimelineLayerPos', id, zIndex);
                    };

                    el.bind('dragover', _event.disable);
                    el.bind('dragenter', _event.disable);
                }
            };
        });
})();

