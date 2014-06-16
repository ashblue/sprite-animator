(function () {
    // Remove an item from a array
    Array.prototype.erase = function(item) {
        for (var i = this.length; i--;) {
            if( this[i] === item ) {
                this.splice(i, 1);
            }
        }

        return this;
    };

    Array.prototype.has = function (item) {
        return this.indexOf(item) !== -1;
    };
}());