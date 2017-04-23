'use strict';

var express = require('express');
var controller = require('./reader.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/getCommand/:id', controller.showCommand);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/reading/:id',controller.saveReading);
router.put('/image/:id',controller.saveImage);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
