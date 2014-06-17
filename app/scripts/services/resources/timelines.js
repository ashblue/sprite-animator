'use strict';

/**
 * @ngdoc service
 * @name spriteAnimatorApp.timelineSrv
 * @description
 * # timelineSrv
 * Service in the spriteAnimatorApp.
 */
angular.module('spriteAnimatorApp')
  .service('timelineSrv', function ($rootScope, Resource) {
        var timelineSrv = new Resource(window.CONFIG.timelines.root, 'timelines', {
//            clean: function (id) {},

//            verify: function (success, error) {}
        });

        return timelineSrv;
  });
