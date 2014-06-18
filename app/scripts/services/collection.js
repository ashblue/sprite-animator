'use strict';

(function () {
    /**
     * @ngdoc service
     * @name spriteAnimatorApp.Collection
     * @description
     * # Collection
     * Service in the spriteAnimatorApp.
     */
    angular.module('spriteAnimatorApp')
        .factory('Collection', function Collection () {
            var Collection = function () {
                this.data = {};
                this.list = [];
            };

            Collection.prototype.add = function (model) {
                this.data[model.slug] = model;
                this.list.push(model);

                return this;
            };

            Collection.prototype.remove = function (id) {
                var model = typeof id === 'object' ? this.get(id.slug) : this.get(id);
                this.data[id] = null;
                delete this.data[id];
                this.list.erase(model);

                return this;
            };

            Collection.prototype.get = function (id) {
                return this.data[id];
            };

            return Collection;
        });
})();

