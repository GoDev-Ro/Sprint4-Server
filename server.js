var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var port        = process.env.PORT || 8080;
var router      = express.Router();
var store       = require('./store');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/', function(req, res) {
    res.json({ message: 'API works, but this endpoint does nothing' });
});

router.route('/:dev/entries')
    .options(function(req, res) {
        res.header('Access-Control-Allow-Methods', 'GET, POST').send();
    })
    .get(function(req, res) {
        var page = Math.max(parseInt(req.query.page || 1, 10), 1),
            perPage = Math.max(parseInt(req.query.perPage || 5, 10), 2);

        store.setDev(req.params.dev).getPage(page, perPage).then(
            function(result) {
                var entries = result[0],
                    total = result[1];
                
                res.json({
                    page: page,
                    perPage: perPage,
                    totalPages: Math.ceil(total / perPage),
                    list: entries
                });
            }
        );
    })
    .post(function(req, res) {
        store.setDev(req.params.dev).add(req.body).then(
            function(item) {
                res.status(201).json(item);
            },
            function(error) {
                res.status(409).json({
                    error: error.message
                });
            }
        );
    });

router.route('/:dev/entries/:id')
    .options(function(req, res) {
        res.header('Access-Control-Allow-Methods', 'PUT, DELETE').send();
    })
    .put(function(req, res) {
        store.setDev(req.params.dev)
            .update(req.params.id, req.body)
            .then(
                function(item) {
                    res.json(item);
                },
                function(error) {
                    res.status(409).json({
                        error: error.message
                    });
                }
            );
    })
    .delete(function(req, res) {
        store.setDev(req.params.dev).delete(req.params.id).then(
            function() {
                res.status(204).send();
            },
            function(error) {
                res.status(409).json({
                    error: error.message
                });
            }
        );
    });

app.use('/api', router);
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Cache-Control', 'no-cache');
    
    next();
});

app.listen(port);

console.log('Listening on port ' + port);