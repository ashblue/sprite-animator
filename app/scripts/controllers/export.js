'use strict';

(function () {
    var app = angular.module('spriteAnimatorApp');

    app.directive('exportAnimation', function (timelineSrv, spriteSrv, imageSrv, frameSrv) {
        return {
            restrict: 'A',
            link: function ($scope, el, attr) {
                var anim = null;

                $scope.$on('setAnim', function (e, currentAnim) {
                    anim = currentAnim;
                });

                el.click(function (e) {
                    if (!anim) return;
                    var result = {
                        frameTime: anim.speed,
                        spriteSheets: [],
                        animations: []
                    };

                    // Assemble each sprite sheet and store it
                    var spriteBlacklist = {};
                    timelineSrv.current.forEach(function (timeline) {
                        var sprite = spriteSrv.get(timeline.sprite);
                        if (spriteBlacklist[sprite._id]) return; // Skip all duplicate sprite sheets
                        var image = imageSrv.get(sprite.image);
                        var spriteSheet = window.sa.object.merge({}, sprite, {
                            image: image.src
                        });

                        delete spriteSheet.$$hashKey;
                        delete spriteSheet.name;
                        spriteSheet._id = 'SPRITE' + spriteSheet._id;
                        spriteBlacklist[sprite._id] = true;
                        result.spriteSheets.push(spriteSheet);
                    });

                    // Turn every animation into a set of keyframe data (sequence only)
                    timelineSrv.current.forEach(function (timeline) {
                        var sprite = spriteSrv.get(timeline.sprite);
                        var sequence = new Array(anim.length);
                        var instructions = {};

                        // Insert all available keyframes with special instructions
                        timeline.frames.forEach(function (frameId) {
                            var frame = frameSrv.get(frameId);
                            sequence[frame.index] = frame.frame;
                            instructions[frame.index] = {
                                pos: { x: frame.x, y: frame.y },
                                flip: { x: frame.flipX, y: frame.flipY },
                                pivot: { x: frame.pivotX, y: frame.pivotY },
                                angle: (frame.angle / 180) * Math.PI,
                                alpha: frame.alpha
                            };
                        });

                        // Fill in missing frames with keyframe data
                        var prevFrame = null;
                        for (var i = 0, l = sequence.length; i < l; i++) {
                            sequence[i] = typeof sequence[i] === 'number' ? sequence[i] : prevFrame;
                            if (typeof sequence[i] === 'number') prevFrame = sequence[i];
                        }

                        result.animations.push({
                            spriteSheet: 'SPRITE' + sprite._id,
                            sequence: sequence,
                            instructions: instructions
                        });
                    });

                    $('#export-dump').html(JSON.stringify(result, undefined, 2));
                    $('#export-modal').modal('show');
                });
            }
        };
    });

    app.directive('exportModal', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/export-view-modal.html'
        };
    });
})();

