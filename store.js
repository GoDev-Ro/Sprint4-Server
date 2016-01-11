var currentDev = '__none',
    Promise = require('promise'),
    fs = require("fs"),
    defaultEntries = JSON.parse(fs.readFileSync('./default_entries.json').toString()),
    City = require('./city'),
    _ = require('underscore');

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

var fromDb = function(item) {
    item = JSON.parse(JSON.stringify(item));
    
    item.id = item._id;
    delete item.__v;
    delete item._id;
    delete item.dev;
    
    return item;
};

module.exports = {
    setDev: function(dev) {
        currentDev = dev;
        return this;
    },
    getPage: function(page, perPage) {
        var entriesPromise = new Promise(function(resolve, reject) {
            var start = (page - 1) * perPage;
            
            City.find({dev: currentDev}).skip(start).limit(perPage).exec(function(err, data) {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(_.map(data, fromDb));
                }
            });
        });
        
        var totalPromise = new Promise(function(resolve, reject) {
            City.count({dev: currentDev}, function(err, count) {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(count);
                }
            });
        });
        
        return Promise.all([entriesPromise, totalPromise]);
    },
    get: function(id) {
        return new Promise(function(resolve, reject) {
            City.findOne({dev: currentDev, _id: id}, function(err, city) {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(fromDb(city));
                }
            });
        });
    },
    add: function(item) {
        return new Promise(function(resolve, reject) {
            try {
                validateItem(item);
                item.dev = currentDev;

                City.create(item, function(err, city) {
                    if (err) {
                        reject(new Error(err));
                    } else {
                        resolve(fromDb(city));
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    },
    update: function(id, item) {
        var self = this;
        
        return new Promise(function(resolve, reject) {
            self.get(id).then(
                function() {
                    try {
                        validateItem(item);
                        
                        City.update({_id: id}, item, {multi: false}, function(err, numAffected) {
                            if (err) {
                                reject({error: err});
                            } else {
                                self.get(id).then(resolve, reject);
                            }
                        });
                    } catch (e) {
                        reject(e);
                    }
                },
                function(a) {
                    reject(new Error('No item with ID "' + id + '" found'));
                }
            );
        });
    },
    delete: function(id) {
        var self = this;
        
        return new Promise(function(resolve, reject) {
            City.find({_id: id}).remove(function(err, numRemoved) {
                if (numRemoved) {
                    resolve();
                } else {
                    reject(new Error('No item with ID "' + id + '" found'));
                }
            });
        });
    }
};