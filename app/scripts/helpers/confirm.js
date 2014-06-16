(function () {
    'use strict';

    window.sa = window.sa || {};
    var confirm = {
        remove: function () {
            return window.confirm('Are you sure you want to delete this? This action cannot be undone and may destroy additional data.');
        }
    };

    window.sa.confirm = confirm;
}());