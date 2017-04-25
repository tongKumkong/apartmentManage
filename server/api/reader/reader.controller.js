/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/readers              ->  index
 * POST    /api/readers              ->  create
 * GET     /api/readers/:id          ->  show
 * PUT     /api/readers/:id          ->  upsert
 * PATCH   /api/readers/:id          ->  patch
 * DELETE  /api/readers/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Reader from './reader.model';
import Room from '../room/room.model'
import HistoryWater from '../history-water/history-water.model'
import HistoryElectric from '../history-electric/history-electric.model'

var fs = require('fs');
var PythonShell = require('python-shell');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function (entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch (err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Readers
export function index(req, res) {
  return Reader.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Reader from the DB
export function show(req, res) {
  return Reader.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//Get command from a reader
export function showCommand(req, res) {
  return Reader.find({ barcode: req.params.id })
    .select('command')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function saveImage(req,res) {

  readerInfo = Reader.find({ barcode: req.params.id }).exec();
  RoomWaterReader = Room.find({waterReader:readerInfo._id}).select('_id').exec();
  RoomElectricReader = Room.find({electricReader:readerInfo._id}).select('_id').exec();

  console.log(readerInfo);
  console.log(RoomWaterReader);
  console.log(RoomElectricReader);

  var option = {
    mode: 'text',
    pythonPath: '/usr/lib/python2.7',
    scriptPath: 'imageOCR.py',
    args: ['']
  }

  return Reader.findOneAndUpdate({ barcode: req.params.id },{image: {data:req.body.image, width:req.body.width, height:req.body.height}},{ new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Reader in the DB
export function create(req, res) {
  return Reader.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
    
}

// Upserts the given Reader in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Reader.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Reader in the DB
export function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Reader.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Reader from the DB
export function destroy(req, res) {
  return Reader.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
