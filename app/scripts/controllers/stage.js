'use strict';

(function () {
    var app = angular.module('spriteAnimatorApp');
    var _event = {
        disable: function (e) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    app.controller('StageCtrl', function ($scope, zoomSrv, timelineSrv, spriteSrv, imageSrv, animGroupSrv, scrubSrv, frameSrv) {
        var ctrl = this;
        this.list = timelineSrv.current;
        this.show = true;
        var select = null;

        this.clear = function () {
            ctrl.show = false;
        };

        $scope.$on('setAnim', function () {
            ctrl.show = true;
//            ctrl.clear();
        });

        $scope.$on('clearAnim', function () {
            ctrl.clear();
        });

        $scope.$on('setStageSelect', function (e, timeline) {
            select = timeline;
        });

        this.isSelected = function (timeline) {
            return select && select._id === timeline._id;
        };

        this.setSelected = function (timeline) {
            $scope.$emit('setTimelineFrame', timeline);
        };

        this.getStage = function () {
            if (!animGroupSrv.current) return;

            var size = this.getStageSize();

            return {
                width: size.width + 'px',
                height: size.height + 'px',
                marginLeft: (size.width / 2 * -1) + 'px',
                marginTop: (size.height / 2 * -1) + 'px'
            };
        };

        this.getStageSize = function () {
//            console.log(animGroupSrv.current);
            if (!animGroupSrv.current) return;

            return {
                width: animGroupSrv.current.width * zoomSrv.scale,
                height: animGroupSrv.current.height * zoomSrv.scale
            };
        };

        this.getImage = function (id) {
            var sprite = spriteSrv.get(id);
            var image = imageSrv.get(sprite.image);
            return image ? image.src : '';
        };

        this.getHitBox = function () {
            if (!animGroupSrv.current) return;

            var size = this.getStageSize();
            return {
                width: size.width + 'px',
                height: size.height + 'px'
            }
        };

        this.isHitBoxVisible = function () {
            return CONFIG.hitBoxVisible;
        };

        $scope.$on('changeZoom', function (e, scale) {
            // Access all images on zoom change here so the DOM can be responsible for tracking everything
            $('animation-image').each(function () {
                this.sprite.setScale(scale);
            });
        });

        this.getScrubStyle = function (timeline) {
            var $target = $('#canvas-' + timeline._id);
            var simpleSprite = $target.get(0).sprite;
            var index = scrubSrv.index;
            var frame; // Used to speed up frame searches
            var target = { index: Number.NEGATIVE_INFINITY }; // The target frame properties we need

            // Loop through all of the timeline frames looking for the closest frame to the index
            timeline.frames.forEach(function (id) {
                frame = frameSrv.get(id);
                if (frame.index <= index && frame.index > target.index) target = frame;
            });

            // Turn the discovered frame into real CSS attributes
            simpleSprite.setFrame(target.frame);

            var pivot = (target.pivotX * zoomSrv.scale) + 'px ' + (target.pivotY * zoomSrv.scale) + 'px';
            var scale = '';
            var flipScale = '';
            if (target.flipX) flipScale += 'scaleX(-1) ';
            if (target.flipY) flipScale += 'scaleY(-1) ';
            if (target.angle) scale += 'rotate(' + target.angle + 'deg) ';

            // Flip scale cannot be on the same axis as rotate because they'll both inherit the transformOrigin adjustment
            $target.find('.animation-image-canvas').css({
                webkitTransform: flipScale,
                mozTransform: flipScale,
                transform: flipScale
            });

            $target.find('.animation-image-axis').css({
                left: target.pivotX * zoomSrv.scale + 'px',
                top: target.pivotY * zoomSrv.scale + 'px'
            });

            return {
                left: target.x * zoomSrv.scale + 'px',
                top: target.y * zoomSrv.scale + 'px',
                opacity: target.alpha,
                webkitTransform: scale,
                mozTransform: scale,
                transform: scale,
                webkitTransformOrigin: pivot,
                mozTransformOrigin: pivot,
                transformOrigin: pivot
            };
        };
    });

    app.directive('resizeStage', function (animGroupSrv, zoomSrv) {
        return {
            restrict: 'A',
            link: function ($scope, el, attr) {
                var drag = false;
                var origin = { x: 0, y: 0 };

                el.bind('mousedown', function (e) {
                    drag = true;
                    origin = {
                        x: e.clientX,
                        y: e.clientY
                    };
                });

                $(window).bind('mousemove', function (e) {
                    if (!drag) return;
                    var x = Math.floor((e.clientX - origin.x) / zoomSrv.scale);
                    var y = Math.floor((e.clientY - origin.y) / zoomSrv.scale);

                    $scope.$apply(function () {
                        if (x) {
                            animGroupSrv.current.width += x;
                            if (animGroupSrv.current.width < 0) animGroupSrv.current.width = 0;
                            origin.x = e.clientX;
                        }
                        if (y) {
                            animGroupSrv.current.height += y;
                            if (animGroupSrv.current.height < 0) animGroupSrv.current.height = 0;
                            origin.y = e.clientY;
                        }
                    });
                });

                $(window).bind('mouseup', function () {
                    drag = false;
                });
            }
        };
    });

    app.directive('animationImage',
        function (spriteSrv, zoomSrv) {
            return {
                restrict: 'E',
                link: function ($scope, el, attr) {
                    var sprite = spriteSrv.get(attr.sprite);
                    var anim = new SimpleSprite(attr.src, sprite.width, sprite.height, {
                        scale: zoomSrv.scale,
                        target: el.find('.animation-image-canvas').get(0)
                    });

                    // Store the canvas in the DOM so it can be accessed at a later date
                    // @NOTE Do not bind global $scope events here as they will not be cleaned out of memory
                    el.get(0).sprite = anim;
                    el.get(0).id = 'canvas-' + attr.id;
                }
            };
        });

    app.directive('animationImageAxis',
        function ($rootScope, zoomSrv) {
            return {
                restrict: 'E',
                link: function ($scope, el, attr) {
                    var drag = false;
                    var prevPos, xCurrent, yCurrent;

                    el.mousedown(function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        drag = true;
                        xCurrent = parseInt(el.css('left'), 10) / zoomSrv.scale;
                        yCurrent = parseInt(el.css('top'), 10) / zoomSrv.scale;
                        prevPos = { x: e.clientX, y: e.clientY };
                    });

                    $(window).mousemove(function (e) {
                        if (!drag) return;

                        var xChange = prevPos.x - e.clientX;
                        var xChangeScale = Math.floor(xChange / zoomSrv.scale);
                        var xNew = xCurrent - xChangeScale;
                        $rootScope.$broadcast('setFrameCurrent', 'pivotX', xNew);

                        var yChange = prevPos.y - e.clientY;
                        var yChangeScale = Math.floor(yChange / zoomSrv.scale);
                        var yNew = yCurrent - yChangeScale;
                        $rootScope.$broadcast('setFrameCurrent', 'pivotY', yNew);
                        $scope.$apply();

                    }).mouseup(function () {
                            drag = false;
                        });
                }
            };
        });

    app.directive('stage', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/stage.html',
            controller: 'StageCtrl',
            controllerAs: 'stage'
        };
    });
})();

