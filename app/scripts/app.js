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
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .when('/load', {
                templateUrl: 'views/load.html',
                controller: 'LoadCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }).run(function ($location) {
        $location.path('/load');
    });
