var express = require('express');
var router = express.Router();
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Sales = require('../models/Sales.js');

server.listen(4000);

io.on('connection', function (socket) {
    socket.on('newdata', function (data) {
        io.emit('new-data', { data: data });
    });
    socket.on('updatedata', function (socket) {
        io.emit('update-data', { data: data });
    });
});

router.get('/', function (req, res) {
    Sales.find(function (err, sales) {
        if (err) return next(err);
        res.json(sales);
    });
});

router.get('/itemsales', function (req, res, next) {
    Sales.aggregate([
        {
            $group: {
                _id: { itemId: '$itemId', itemName: '$itemName' },
                totalPrice: {
                    $sum: '$totalPrice'
                }
            }
        },
        { $sort: { totalPrice: 1 } }
    ], function (err, sales) {
        if (err) return next(err);
        res.json(sales);
    });
});

//get data by id

router.get('/:id', function (req, res, next) {
    Sales.findById(req.params.id, function (err, sales) {
        if (err) return next(err);
        res.json(sales);
    })
});

//post data

router.post('/', function (req, res, next) {
    Sales.create(req.body, function (err, sales) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(sales);
    })
})

//put data
router.put('/:id', function (req, res, next) {
    Sales.findByIdAndUpdate(req.params.id, req.body, function (err, sales) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(sales);
    })
})

//delete data by id
router.delete('/:id', function (req, res, next) {
    Sales.findByIdAndRemove(req.params.id, req.body, function (err, sales) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(sales);
    })

})

module.exports = router;