(function () {
    var url = "http://server.godev.ro:8080/api/dragos/entries";
    
    var getErrorHandler = function(reject) {
        return function(xhr) {
            reject(xhr.status == 409 ? xhr.responseJSON.error : 'An unknown error occurred');
        };
    };
    
    var getRestPromise = function(url, method, data) {
        var settings = {
            url: url,
            headers: {
                "content-type": "application/json"
            }
        };
        
        if (method) {
            settings.type = method;
        }
        
        if (data) {
            settings.data = typeof data == 'string' ? data : JSON.stringify(data);
        }
        
        return new Promise(function (resolve, reject) {
            $.ajax(settings).done(resolve).fail(getErrorHandler(reject));
        });
    };

    this.store = {
        getAll: function(page, sortField, sortDir) {
            return getRestPromise(url + '?page=' + page + '&sortField=' + sortField + '&sortDir=' + sortDir);
        },
        get: function (id) {
            return getRestPromise(url + '/' + id);
        },
        add: function (item) {
            return getRestPromise(url, 'POST', item);
        },
        update: function (id, item) {
            return getRestPromise(url + '/' + id, 'PUT', item);
        },
        delete: function (id) {
            return getRestPromise(url + '/' + id, 'DELETE');
        }
    };
})();