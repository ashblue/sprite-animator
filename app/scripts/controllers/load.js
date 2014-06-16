'use strict';

(function () {
    var MESSAGES = {
        populate: 'Equipping penguins with rocket launchers',
        integrity: 'Penguins are eliminating all corrupted data'
    };

    /**
     * @ngdoc function
     * @name spriteAnimatorApp.controller:LoadCtrl
     * @description
     * # LoadCtrl
     * Controller of the spriteAnimatorApp
     */
    angular.module('spriteAnimatorApp')
        .controller('LoadCtrl', function ($scope) {
            this.currentStep = 0;
            this.totalSteps = 12; // @TODO Calculate this total (totalFactories * 2)
            this.status = MESSAGES.populate;

            // Get all of the collection factories and stack them into an array
            // For each factory run the populate method and insert a custom callback

            // When all the factories are fully populated, run a data integrity check (should be inside the factory)

            // If there are errors visually display them, with a proceed button
            // If no errors trigger the route we need

            $('#modal-loading').modal({
                backdrop: 'static',
                keyboard: false
            });
        });
})();

