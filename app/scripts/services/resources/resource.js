'use strict';
(function () {
    var _id = 0; // ID stubs for offline mode

    var settings = {
        url: null, // Url of REST API capable of handling all = :url, direct = :url/:id
        list: null, // Array of all tracked item
        data: null, // Hash of all tracked item IDs
        ready: false, // If population has been run so the collection knows its ready for usage and doesn't run populate again
        slug: null, // ID for looking up collections in collectionList
        syncDelay: 300,
        _id: 0
    };

    /**
     * @ngdoc service
     * @name spriteAnimatorApp.Resource
     * @description
     * # Resource
     * Service in the spriteAnimatorApp.
     */
    angular.module('spriteAnimatorApp')
        .factory('Resource', function ($http) {
            var Resource = function (rootUrl, slug, options) {
                $.extend(this, settings, options);

                this.url = rootUrl;
                this.slug = slug;
                this.list = [];
                this.data = {};
                this.timeout = {};

                return this;
            };

            // Should only be called via a resolve method for pre-loading
            Resource.prototype.populate = function (success, error) {
                if (this.ready) return;
                var collection = this;
                this.ready = true;

                $http.get(this.url)
                    .success(function (list) {
                        list.forEach(function (item) {
                            collection._add(item);
                        });
                        if (success) success(this);
                    }).error(function () {
                        if (error) console.error('Population failed');
                    });
            };

            /**
             * Do not call directly outside of this model as it may cause data corruption
             * @param id
             * @returns {Resource}
             * @private
             */
            Resource.prototype._add = function (model) {
                this.data[model._id] = model;
                this.list.push(model);

                return this;
            };

            /**
             * Do not call directly outside of this model as it may cause data corruption
             * @param id
             * @returns {Resource}
             * @private
             */
            Resource.prototype._remove = function (id) {
                var model = this.get(id);
                this.list.erase(model);
                this.data[model._id] = null;
                delete this.data[model._id];

                return this;
            };

            Resource.prototype.get = function (id) {
                if (typeof id === 'object') id = id._id;
                return this.data[id];
            };

            Resource.prototype.set = function (id, key, value) {
                var item = this.get(id);

                if (typeof key !== 'object') {
                    if (!Array.isArray(item[key])) { // Regular set key
                        item[key] = value;
                    } else { // Insert a new array item
                        item[key].push(value);
                    }
                } else { // Set group of key value pairs (does not work with arrays or objects)
                    for (var k in key) {
                        item[k] = key[k];
                    }
                }

                // Data is corrupt on the server, send a fix after a short delay in-case more changes come in
                this.addDirt(id);
            };

            /**
             * Removes a value from an array and marks the model for an update
             * @param id
             * @param key
             * @param value
             */
            Resource.prototype.unset = function (id, key, value) {
                var item = this.get(id);
                item[key].erase(value);
                this.addDirt(id);
            };

            /**
             * @param id
             */
            Resource.prototype.addDirt = function (id) {
                var collection = this;
                var item = this.get(id);

                if (window.CONFIG.online) {
                    if (this.timeout[item._id]) window.clearTimeout(this.timeout[item._id]);
                    this.timeout[item._id] = window.setTimeout(function () {
                        $http.put(collection.url + '/' + item._id, item).error(function () {
                            console.error('Update failed');
                        });
                    }, this.syncDelay);
                }
            };

            Resource.prototype.create = function (data, callback) {
                var collection = this;

                if (!window.CONFIG.online) {
                    data._id = _id += 1;
                    collection._add(data);
                    if (callback) callback(data);
                } else {
                    $http.post(this.url, data).success(function (item) {
                        collection._add(item);
                        if (callback) callback(item);
                    }).error(function () {
                        console.error('creation failed', data);
                    });
                }

                return this;
            };

            Resource.prototype.destroy = function (id) {
                var item = this.get(id);
                if (item) this.clean(item);
                if (item) this._remove(item);

                if (window.CONFIG.online) {
                    $http.delete(this.url + '/' + item._id)
                        .error(function () {
                            console.error('Destroy failed');
                        });
                }

                return this;
            };

            /**
             * Logic fired whenever an item is deleted from the database to cleanup id references
             */
            Resource.prototype.clean = function (id) {};

            /**
             * Logic fired at initial load to verify data integrity
             */
            Resource.prototype.verify = function (success, error) { return success(); };

            return Resource;
        });
})();

