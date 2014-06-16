(function () {
    window.sa = window.sa || {};

    var errors = false;
    window.sa.verify = {
        errorMessage: function () {
            if (errors) window.alert('Data integrity issues have destroyed existing animation data, please see the console and contact a system administrator before proceeding.');
        },

        /**
         * Loops through collections to verify data integrity, if the primaryCol item is not found the refCol item is destroyed
         * @param primaryCol {Collection} The data we want to check for blank id references on
         * @param refCol {Collection} The collection used to search for missing id references
         * @param key {string} The param on the refCol used to check for missing data
         * @param options
         * @returns {*}
         */
        data: function (primaryCol, refCol, key) {
            var missingData = [];
            var removedData = [];

            refCol.list.forEach(function (refItem) {
                if (!Array.isArray(refItem[key])) {
                    var primaryItem = primaryCol.get(refItem[key]);
                    if (!primaryItem) {
                        missingData.push(refItem[key]);
                        removedData.push(refItem);
                    }
                } else {
                    var errorFound = false;
                    refItem[key].forEach(function (id) {
                        var primaryItem = primaryCol.get(id);
                        if (!primaryItem) {
                            missingData.push(id);
                            if (!errorFound) removedData.push(refItem);
                            if (!errorFound) errorFound = true;
                        }
                    });
                }

            });

            if (missingData.length) {
                removedData.forEach(function (item) {
                    refCol.destroy(item._id);
                });

                console.error('The following ' + primaryCol.slug + ' are missing ' + JSON.stringify(missingData)
                    + ' because of this the following ' + refCol.slug + ' have been destroyed ' + JSON.stringify(removedData));

                errors = true;
            }

            return this;
        },

        /**
         * Only destroys the ID to the non existent primaryCol item instead of destroying the refCol item all together
         * @param primaryCol
         * @param refCol
         * @param key
         * @param options
         * @returns {*}
         */
        dataRef: function (primaryCol, refCol, key) {
            var missingData = [];
            var affectedTimelines = [];

            refCol.list.forEach(function (timelineItem) {
                var errorFound = false;
                timelineItem[key].forEach(function (id) {
                    var primaryItem = primaryCol.get(id);
                    if (!primaryItem) {
                        missingData.push(id);
                        affectedTimelines.push(timelineItem);
                        if (!errorFound) errorFound = true;
                    }
                });
            });

            if (missingData.length) {
                affectedTimelines.forEach(function (timelineItem) {
                    missingData.forEach(function (frameId) {
                        timelineItem[key].erase(frameId);
                    });
                    refCol.addDirt(timelineItem._id);
                });


                console.error('The following ' + primaryCol.slug + ' are missing ' + JSON.stringify(missingData)
                    + ' because of this the following ' + refCol.slug + ' have been affected ' + JSON.stringify(affectedTimelines));

                errors = true;
            }

            return this;
        }
    }
})();