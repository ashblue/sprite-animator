'use strict';

(function () {
    var MESSAGES = {
        populate: 'Equipping penguins with rocket launchers',
        integrity: 'Penguins are eliminating all corrupted data',
        error: 'Pardon our penguins, something went wrong while loading data from the server. Refresh the page and try again please.'
    };

    /**
     * @ngdoc function
     * @name spriteAnimatorApp.controller:LoadCtrl
     * @description
     * # LoadCtrl
     * Controller of the spriteAnimatorApp
     */
    angular.module('spriteAnimatorApp')
        .controller('LoadCtrl', function ($scope, $location, resourceSrv) {
            var ctrl = this;
            this.currentStep = 0;
            this.totalSteps = resourceSrv.list.length * 2; // @TODO Calculate this total (totalFactories * 2)
            this.status = MESSAGES.populate;
            this.errorMessage = null;
            this.errors = [];

            this.init = function () {
                // Get all of the collection factories and stack them into an array
                // For each factory run the populate method and insert a custom callback
                resourceSrv.list.forEach(function (resource) {
                    resource.populate(ctrl.loadSuccess.bind(ctrl), ctrl.loadError.bind(ctrl));
                });

                // If there are errors visually display them, with a proceed button
                // If no errors trigger the route we need

                $('#modal-loading').modal({
                    backdrop: 'static',
                    keyboard: false
                });
            };

            this.start = function () {
                $('#modal-loading').on('hidden.bs.modal', function () {
                    $scope.$apply(function () {
                        $location.path('/');
                    });
                }).modal('hide');
            };

            this.loadSuccess = function () {
                this.currentStep += 1;
                if (resourceSrv.list.length !== this.currentStep) return;
                resourceSrv.list.forEach(function (resource) {
                    resource.verify(ctrl.verifySuccess.bind(ctrl), ctrl.verifyError.bind(ctrl));
                });
            };

            this.verifySuccess = function () {
                this.currentStep += 1;

                if (this.currentStep !== this.totalSteps) return;
                if (!this.errors.length) this.start();
            };

            this.verifyError = function (message) {
                this.errors.push(message);
            };

            this.loadError = function () {
                this.errorMessage = MESSAGES.error;
            };

            this.getPercentage = function () {
                return Math.floor((this.currentStep / this.totalSteps) * 100);
            };

            this.init();
        });
})();

