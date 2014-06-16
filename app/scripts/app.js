'use strict';

/**
 * @ngdoc overview
 * @name spriteAnimatorApp
 * @description
 * # spriteAnimatorApp
 *
 * Main module of the application.
 */
angular
    .module('spriteAnimatorApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/load', {
                templateUrl: 'views/load.html',
                controller: 'LoadCtrl',
                controllerAs: 'loader'
            })
            .otherwise({
                redirectTo: '/'
            });
    }).run(function ($location) {
        $location.path('/load');
    });
