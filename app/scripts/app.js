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
                templateUrl: 'views/main.html'
            })
            .when('/load', {
                templateUrl: 'views/load.html',
                controller: 'LoadCtrl',
                controllerAs: 'loader'
            })
            .when('/sprites', {
                templateUrl: 'views/sprite-sheets.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }).run(function ($location) {
        var path = $location.path();
        $location.path('/load').search('redirect', path);
    });
