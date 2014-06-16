(function () {
    $.fn.getMousePos = function (e) {
        var parentOffset = this.offset();

        return {
            x: e.pageX - parentOffset.left,
            y: e.pageY - parentOffset.top
        };
    };
}());