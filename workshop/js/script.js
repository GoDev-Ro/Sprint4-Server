$(function() {
    $('#bt').on('click', function() {
        $.ajax('data.json').done(function(content) {
            console.log(content);
        });
    });
    
    var io = {
        first_name: 'Dragos Constantin',
        last_name: 'Badea',
        fullName: function() {
            return this.first_name + ' ' + this.last_name;
        }
    };
    
    //assert('fullName works', io.fullName() == 'Dragos Constantin Badea');
    
    //console.log(JSON.stringify(io));
});



function getThis() {
    return this;
}

var a = {
    asd: 'a'
};

JSON.stringify(a);

assert('a este a', 'a' === 'a');
assert('Get this a este a', getThis.call('a') == 'a');





var store = (function() {
    // private
    var data = [
        {
            id: 1,
            name: 'Bucharest'
        },
        {
            id: 2,
            name: 'Amsterdam'
        },
    ];

    //public
    return {
        getAll: function() {
            return data;
        },
        add: function(item) {
            return new Promise(function(resolve, reject) {
                data.push(item);
                resolve(data);
            });
        },
        update: function(id, updateData) {
            return new Promise(function(resolve, reject) {
                $.each(data, function(index) {
                    if (this.id == id) {
                        data[index] = updateData;
                        resolve(data);
                    }
                });
            });
        },
        delete: function(id) {
            return new Promise(function(resolve, reject) {
                $.each(data, function(index) {
                    if (this.id == id) {
                        data.splice(index, 1);
                        resolve(data);
                    }
                });
            });
        }
    };
})();

store
    .add({id: 3, name: 'London'})
    .then(function(data) {

        console.log('After add');
        console.log(data);

        store.update(2, {id: 2, name: 'Amsterdam Eye'}).then(function(data) {
            console.log('After update');
            console.log(data);

            store.delete(1).then(function(data) {
                console.log('After delete');
                console.log(data);
            });
        });
    });



























