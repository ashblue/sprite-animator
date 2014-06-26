'use strict';

(function () {
    var app = angular.module('spriteAnimatorApp');
    app.controller('SpritesCtrl', function ($scope, $routeParams, spriteSrv, imageSrv, zoomSrv) {
        var ctrl = this;
        this.list = spriteSrv.list;
        $scope.spriteSearch = $routeParams.spriteSearch; // Force filter if URL param is available

        // Expects sprite sheet data from the upload form
        $scope.$on('createSprite', function (event, upload) {
            if (!upload.sprite_id) {
                spriteSrv.create({
                    name: upload.name,
                    image: upload.image_id,
                    width: upload.imageCanvas.canvas.width / zoomSrv.scale / upload.cols,
                    height: upload.imageCanvas.canvas.height / zoomSrv.scale / upload.rows
                });
            } else {
                spriteSrv.set(upload.sprite_id, {
                    image: upload.image_id,
                    width: upload.imageCanvas.canvas.width / zoomSrv.scale / upload.cols,
                    height: upload.imageCanvas.canvas.height / zoomSrv.scale / upload.rows
                });
            }

            $scope.$emit('clearUpload');
        });

        $scope.$on('removeSprite', function (e, sprite) {
            ctrl.remove(sprite);
        });

        this.editSprite = function (e, sprite) {
            e.preventDefault();
            e.stopPropagation();

            var name = prompt('Enter Name', sprite.name);
            if (name && name !== '') spriteSrv.set(sprite._id, 'name', name);
        };

        this.getImageSrc = function (id) {
            var image = imageSrv.get(id);
            return image ? image.path : '';
        };

        this.remove = function (sprite) {
            $scope.$emit('clearUploadSprite', sprite);
            spriteSrv.destroy(sprite._id);
        };

        this.clickRemove = function (e, sprite) {
            if (e) e.preventDefault();
            if (e) e.stopPropagation();
            if (window.sa.confirm.remove()) ctrl.remove(sprite);
        };

        this.uploadSwap = function (sprite) {
            $scope.$emit('setUploadSprite', sprite);
        };
    });

    app.controller('SpriteModalCtrl', function ($scope, spriteSrv, imageSrv) {
        $scope.list = spriteSrv.list;
        $scope.page = 0;
        $scope.pageSize = 10;

        $scope.pageCount = function () {
            return Math.ceil($scope.list.length / $scope.pageSize);
        };

        $scope.select = function (e, sprite) {
            e.preventDefault();
            $('#sprite-modal').modal('hide');
            $scope.$emit('selectSprite', sprite);
        };

        $scope.getImageSrc = function (id) {
            var image = imageSrv.get(id);
            return image ? image.path : '';
        };
    });

    app.filter('startFrom', function() {
        return function(input, start) {
            return input.slice(start);
        }
    });

    app.directive('spriteModal', function() {
        return {
            restrict: 'E',
            templateUrl: 'views/sprites/sprites-view-modal.html',
            controller: 'SpriteModalCtrl',
            controllerAs: 'spriteModalCtrl'
        };
    });
})();

