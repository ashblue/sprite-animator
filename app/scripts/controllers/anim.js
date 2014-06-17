'use strict';

/**
 * @ngdoc function
 * @name spriteAnimatorApp.controller:AnimCtrl
 * @description
 * # AnimCtrl
 * Controller of the spriteAnimatorApp
 */
angular.module('spriteAnimatorApp')
  .controller('AnimCtrl', function ($scope, animGroupSrv, animSrv, timelineSrv) {
        var ctrl = this;
        this.current = null; // Current animation
        this.list = []; // Current animation list
        this.show = false;

        $scope.$on('setAnimGroup', function (e, animGroup) {
            ctrl.clear();
            ctrl.show = true;

            if (!animGroup.animations.length) return;

            animGroup.animations.forEach(function (id) {
                ctrl.list.push(animSrv.get(id));
            });

            ctrl.set(_.last(ctrl.list));
        });

        $scope.$on('clearAnimGroup', function (e) {
            ctrl.clear();
        });

        $scope.$on('removeAnim', function (e, anim) {
            ctrl.remove(anim);
        });

        this.clear = function () {
            this.current = null; // Current animation
            this.list = []; // Current animation list
            this.show = false;
            $scope.$emit('clearAnim');
        };

        this.set = function (anim) {
            this.current = anim;
            $scope.$emit('setAnim', anim);
        };

        this.new = function () {
            animSrv.create({
                "name": "Untitled",
                "speed": CONFIG.animations.defaultSpeed,
                "length": CONFIG.animations.defaultLength,
                "timelines": []
            }, function (anim) {
                ctrl.list.push(anim);
                animGroupSrv.set(animGroupSrv.current, 'animations', anim._id);
            });
        };

        this.clickRemove = function (anim) {
            if (!window.sa.confirm.remove()) return;
            this.remove(anim);
        };

        this.remove = function (anim) {
            if (this.current && this.current._id === anim._id) this.current = null;
            this.list.erase(anim);
            animSrv.destroy(anim._id);
        };

        this.setCurrent = function (current) {
            this.current = current;
        };
  });
