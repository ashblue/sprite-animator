'use strict';

angular.module('spriteAnimatorApp')
    .controller('SpritesCtrl', function ($scope, $routeParams, spriteSrv, imageSrv, zoomSrv) {        
        var ctrl = this;
        this.list = spriteSrv.list;
        $scope.spriteSearch = $routeParams.spriteSearch; // Force filter if URL param is available

        // Expects sprite sheet data from the upload form
        $scope.$on('createSprite', function (event, upload) {
            if (!upload.sprite_id) {
                spriteSrv.create({
                    name: upload.name,
                    image: upload.image,
                    width: upload.imageCanvas.canvas.width / zoomSrv.scale / upload.cols,
                    height: upload.imageCanvas.canvas.height / zoomSrv.scale / upload.rows
                });
            } else {
                spriteSrv.set(upload.sprite_id, {
                    image: upload.image,
                    width: upload.imageCanvas.canvas.width / zoomSrv.scale / upload.cols,
                    height: upload.imageCanvas.canvas.height / zoomSrv.scale / upload.rows
                });
            }
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
            return image ? image.src : '';
        };

        this.remove = function (sprite) {
            // @TODO Remove all corresponding timelines via calling
            // $scope.$emit('removeTimeline', timeline);
//            timelineSrv.current = [];

            $scope.$emit('clearUploadSprite', sprite);

//            timelineSrv.list.forEach(function (timeline) {
//                if (timeline.sprite === sprite._id) {
//                    timelineSrv.destroy(timeline._id);
//                    $scope.$emit('removeTimeline', timeline._id);
//
//                    // @TODO Move into timeline logic
                        // @TODO Setup anim removal
////                    animSrv.list.forEach(function (anim) {
////                        if (anim.timelines.has(timeline._id)) {
////                            anim.timelines.erase(timeline._id);
////                            animSrv.addDirt(anim._id);
////                        }
////                    });
//                }
//            });

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
