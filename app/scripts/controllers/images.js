'use strict';

angular.module('spriteAnimatorApp')
    .controller('ImagesCtrl', function ($scope, imageSrv, spriteSrv, zoomSrv) {
        var ctrl = this;
        this.list = imageSrv.list;

        $scope.$on('parseUpload', function (e, sprite) {
            if (!sprite.image_id) {
                imageSrv.create({
                    name: sprite.name + ' image',
                    path: sprite.image,
                    width: sprite.imageCanvas.canvas.width / zoomSrv.scale,
                    height: sprite.imageCanvas.canvas.height / zoomSrv.scale
                }, function (item) {
                    sprite.image_id = item._id;
                    $scope.$emit('createSprite', sprite);
                });
            } else {
                $scope.$emit('createSprite', sprite);
            }
        });

        // Inject the chosen image into the upload details
        this.showImage = function (e, image) {
            e.preventDefault();

            $scope.$emit('setUploadImage', image);
        };

        this.editImage = function (e, image) {
            e.preventDefault();
            e.stopPropagation();

            var name = prompt('Enter Name', image.name);
            if (name && name !== '') imageSrv.set(image._id, 'name', name);
        };

        this.removeImage = function (e, image) {
            e.preventDefault();
            e.stopPropagation();

            if (!window.sa.confirm.remove()) return;

            $scope.$emit('clearUploadImage', image);
            imageSrv.destroy(image._id);

            spriteSrv.list.forEach(function (sprite) {
                if (sprite.image === image._id) $scope.$emit('removeSprite', sprite);
            });
        };
    });
