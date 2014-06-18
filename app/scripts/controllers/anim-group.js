'use strict';

/**
 * @ngdoc function
 * @name spriteAnimatorApp.controller:AnimGroupCtrl
 * @description
 * # AnimGroupCtrl
 * Controller of the spriteAnimatorApp
 */
angular.module('spriteAnimatorApp')
    .controller('AnimGroupCtrl', function ($rootScope, $scope, animGroupSrv) {
        var ctrl = this;
        this.show = false; // Show the manager
        this.showSettings = false; // Show the settings
        this.list = animGroupSrv.list;

        $scope.$on('removeAnimGroup', function (e, animGroup) {
            ctrl.remove(animGroup);
        });

        this.init = function () {
            // Force set the animation group to the current at load or first if nothing is present
            animGroupSrv.current = animGroupSrv.current || _.last(animGroupSrv.list)
            this.set(animGroupSrv.current);
        };

        this.new = function () {
            animGroupSrv.create({
                name: 'Untitled',
                width: CONFIG.animationGroups.defaultWidth,
                height: CONFIG.animationGroups.defaultHeight,
                animations: []
            });
        };

        this.set = function (animGroup) {
            animGroupSrv.current = animGroup;
            this.current = animGroup;
            if (animGroup) $rootScope.$broadcast('setAnimGroup', animGroup);
        };

        this.remove = function (animGroup) {
            if (!window.sa.confirm.remove()) return;

            if (animGroup._id === animGroupSrv.current._id) {
                this.clear();
            }

            animGroupSrv.destroy(animGroup);
        };

        this.clear = function (e) {
            this.set(null);
            $scope.$broadcast('clearAnimGroup');
        };

        this.toggle = function (e) {
            this.show = !this.show;
            this.showSettings = false;
        };

        this.toggleSettings = function () {
            this.showSettings = !this.showSettings;
            this.show = false;
        };


        // Hack to force delay init until after all controllers have loaded, curerntly no way to do this in Angular
        window.setTimeout(function () {
            ctrl.init();
            $scope.$apply();
        }, 300);
    });
