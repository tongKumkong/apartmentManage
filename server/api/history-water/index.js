'use strict';

var express = require('express');
var controller = require('./history-water.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/room/:id/date/:date', controller.showByRoomAndDate);
router.get('/room/:id', controller.showByRoom);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
