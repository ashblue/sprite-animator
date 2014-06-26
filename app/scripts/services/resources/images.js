'use strict';

/**
 * @ngdoc service
 * @name spriteAnimatorApp.imageSrv
 * @description
 * # imageSrv
 * Service in the spriteAnimatorApp.
 */
angular.module('spriteAnimatorApp')
  .factory('imageSrv', function ($rootScope, Resource, spriteSrv, $http) {
        var imageSrv = new Resource(window.CONFIG.images.root, 'images', {
            clean: function (image) {
                spriteSrv.list.forEach(function (sprite) {
                    if (sprite.image === image._id) {
                        $rootScope.$broadcast('removeSprite', sprite);
                    }
                });
            },

            verify: function (success, error) {
                var errorMessage = sa.verify.data(this, spriteSrv, 'image');
                if (errorMessage) error(errorMessage);
                success();
            },

            create: function (data, callback) {
                var collection = this;

                if (!window.CONFIG.online) {
                    data._id = this._id += 1;
                    collection._add(data);
                    if (callback) callback(data);
                } else {
                    // @TODO Send a file not a data URI (creates a bloody mess)
                    // Image must be packaged and sent via multipart (too large otherwise)
                    var fd = new FormData();
                    for (var key in data) {
                        fd.append(key, data[key]);
                    }

                    $http.post(this.url, fd, {
                        withCredentials: true,
                        headers: { 'Content-Type': undefined },
                        transformRequest: angular.identity // Makes angular figure out all the multipart headers for us
                    }).success(function (item) {
                        collection._add(item);
                        if (callback) callback(item);
                    }).error(function () {
                        console.error('creation failed', data);
                    });
                }

                return this;
            }
        });

        return imageSrv;
  });
