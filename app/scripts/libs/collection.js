(function () {
    'use strict';

    var _id = 0; // ID stubs for offline mode

    var settings = {
        online: window.CONFIG.online,
        url: null, // Url of REST API capable of handling all = :url, direct = :url/:id
        list: null, // Array of all tracked item
        data: null, // Hash of all tracked item IDs
        timeout: null, // Tracked timeouts for communicating with the server
        ready: false, // If population has been run so the collection knows its ready for usage and doesn't run populate again
        populateCallback: null, // Used post populate to make sure all data is correctly assembled, fired after all models are loaded
        deleteCallback: null, // Additional data removal whenever delete is called
        slug: null // ID for looking up collections in collectionList
    };


    window.sa = window.sa || {};
    window.sa.col = {
        data: {},
        list: [],
        loaded: 0
    };

    // @TODO Populate verification must only run when ALL collections have fully populated
    // Population count will need to match collectionList count
    var Collection = function (rootUrl, $http, options) {
        $.extend(this, settings, options);

        this.$http = $http;
        this.url = rootUrl;
        this.list = [];
        this.data = {};
        this.timeout = {};

        if (this.slug) window.sa.col.data[this.slug] = this;
        window.sa.col.list.push(this);

        return this;
    };

    // Should only be called via a resolve method for pre-loading
    Collection.prototype.populate = function () {
        if (this.ready) return;
        var collection = this;
        this.ready = true;

        this.$http.get(this.url).success(function (list) {
            list.forEach(function (item) { collection.data[item._id] = item; });
            collection.list = list;
            sa.col.loaded += 1;

            if (sa.col.loaded === sa.col.list.length) {
                sa.col.list.forEach(function (item) {
                    if (item.populateCallback) item.populateCallback();
                });

                // Fires an error message if its available
                sa.verify.errorMessage();
            }
        });
    };

    Collection.prototype.get = function (id) {
        if (typeof id === 'object') id = id._id;
        return this.data[id];
    };

    Collection.prototype.set = function (id, key, value) {
        var collection = this;
        var item = this.get(id);

        if (typeof key !== 'object') {
            item[key] = value;
        } else {
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
    Collection.prototype.unset = function (id, key, value) {
        var item = this.get(id);
        item[key].erase(value);
        this.addDirt(id);
    };

    Collection.prototype.addDirt = function (id) {
        var collection = this;
        var item = this.get(id);

        if (this.online) {
            if (this.timeout[id]) this.timeout[id].clearTimeout();
            this.timeout[id] = window.setTimeout(function () {
                // @TODO On failure attempt server post again
                collection.$http.put(collection.url + '/' + id, item);
            }, 1000);
        }
    };

    Collection.prototype.create = function (data, callback) {
        var collection = this;

        if (!this.online) {
            data._id = _id += 1;
            this.data[data._id] = data;
            this.list.unshift(data);
            if (callback) callback(data);
        } else {
            $http.post(this.url).success(function (item) {
                this.data[item._id] = item;
                collection.list.unshift(item);
                if (callback) callback(item);
            });
        }

        return this;
    };

    Collection.prototype.destroy = function (id) {
        var item = this.get(id);
        this.list.splice(this.list.indexOf(item), 1);
        this.data[item._id] = null;
        delete this.data[item._id];

        if (this.online) $http.delete(this.url.root + '/' + item._id);

        if (this.deleteCallback) this.deleteCallback();

        return this;
    };

    window.sa.Collection = Collection;
})();