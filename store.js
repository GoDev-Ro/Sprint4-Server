var database = {},
    currentDev = '__none',
    Promise = require('promise'),
    fs = require("fs"),
    defaultEntries = JSON.parse(fs.readFileSync('./default_entries.json').toString());

var getCurrentDevEntries = function() {
    if (!database.hasOwnProperty(currentDev)) {
        database[currentDev] = JSON.parse(JSON.stringify(defaultEntries));
    }

    return database[currentDev];
};

var findEntryIndexWithId = function(id) {
    var entries = getCurrentDevEntries();

    for (i in entries) { 
        if (entries.hasOwnProperty(i) && entries[i].id == id) {
            return i;
        }
    }

    return null;
};

var findEntryWithId = function(id) {
    return new Promise(function(resolve, reject) {
        var index = findEntryIndexWithId(id);
        
        if (index) {
            resolve(getCurrentDevEntries()[index]);
        } else {
            reject();
        }
    });
};

var validateItem = function(item) {
    var allowedProperties = ['name', 'visited', 'stars'],
        i;

    if (!item || typeof item !== 'object') {
        throw new Error('Item to add/update must be an object');
    }

    if (!item.hasOwnProperty('name') || item.name.length < 2) {
        throw new Error('Property "name" must be at least 2 characters long');
    }

    if (!item.hasOwnProperty('visited') || [0, 1].indexOf(item.visited) === -1) {
        throw new Error('Property "visited" must be 0 or 1');
    }

    if (!item.hasOwnProperty('stars') || [1, 2, 3, 4, 5].indexOf(item.stars) === -1) {
        throw new Error('Property "stars" must a number between 1 and 5');
    }

    for (i in item) {
        if (allowedProperties.indexOf(i) === -1) {
            delete item[i];
        }
    }
};

module.exports = {
    setDev: function(dev) {
        currentDev = dev;
        return this;
    },
    getPage: function(page, perPage) {
        var entriesPromise = new Promise(function(resolve, reject) {
            var entries = getCurrentDevEntries();
            
            if ((page - 1) * perPage > entries.length) {
                return [];
            }

            resolve(entries.slice((page - 1) * perPage, Math.min(entries.length, page * perPage)));
        });
        
        var totalPromise = new Promise(function(resolve, reject) {
            resolve(getCurrentDevEntries().length);
        });
        
        return Promise.all([entriesPromise, totalPromise]);
    },
    add: function(item) {
        return new Promise(function(resolve, reject) {
            var entries = getCurrentDevEntries();

            try {
                validateItem(item);
                entries.push(item);

                item.id = entries.length;

                resolve(item);
            } catch (e) {
                reject(e);
            }
        });
    },
    update: function(id, item) {
        return new Promise(function(resolve, reject) {
            findEntryWithId(id).then(
                function(itemToUpdate) {
                    try {
                        validateItem(item);

                        for (i in item) {
                            itemToUpdate[i] = item[i];
                        }
                        
                        resolve(itemToUpdate);
                    } catch (e) {
                        reject(e);
                    }
                },
                function() {
                    reject(new Error('No item with ID "' + id + '" found'));
                }
            );
        });
    },
    delete: function(id) {
        return new Promise(function(resolve, reject) {
            var indexToDelete = findEntryIndexWithId(id);
            
            if (indexToDelete) {
                getCurrentDevEntries().splice(indexToDelete, 1);
                resolve();
            } else {
                reject(new Error('No item with ID "' + id + '" found'))
            }
        });
    }
};