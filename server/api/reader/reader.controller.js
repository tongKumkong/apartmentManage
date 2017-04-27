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
var async = require("async");

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

export function saveImage(req, res) {

  async.waterfall([
    function (callback) {
      Reader.find({ barcode: req.params.id }).select('_id readingArea').then(res => {
        callback(null, res);
      });
    },
    function (readerInfo, callback) {
      Room.find({ waterReader: readerInfo[0]._id }).select('_id').then(res => {
        callback(null, readerInfo, res);
      });
    },
    function (readerInfo, RoomWaterReader, callback) {
      Room.find({ electricReader: readerInfo[0]._id }).select('_id').then(res => {
        callback(null, readerInfo, RoomWaterReader, res);
      });
    },
    function (readerInfo, RoomWaterReader, RoomElectricReader, callback) {
      var readingArea = {
        x: (typeof readerInfo[0].readingArea != 'undefined') ? readerInfo[0].readingArea.x : 'null',
        y: (typeof readerInfo[0].readingArea != 'undefined') ? readerInfo[0].readingArea.y : 'null',
        w: (typeof readerInfo[0].readingArea != 'undefined') ? readerInfo[0].readingArea.w : 'null',
        h: (typeof readerInfo[0].readingArea != 'undefined') ? readerInfo[0].readingArea.h : 'null',
      }
      var option = {
        mode: 'text',
        scriptPath: '/Users/DSS/Desktop/apartmentManage/server/api/reader/',
        args: [req.body.image, readingArea.y, readingArea.x, readingArea.w, readingArea.h]
      }

      PythonShell.run('imageOCR.py', option, (err, results) => {
        if (err) {
          console.log(err);
          console.log("error from python");
          return;
        }

        if (typeof RoomWaterReader[0] != 'undefined') {
          if (results[1]) {
            HistoryWater.create({
              room: RoomWaterReader[0]._id, unit: results[1], image: {
                data: results[0]
              }
            })
          }
          HistoryWater.create({
            room: RoomWaterReader[0]._id, image: {
              data: results[0]
            }
          })
        }

        if (typeof RoomElectricReader[0] != 'undefined') {
          if (results[1]) {
            HistoryElectric.create({
              room: RoomElectricReader[0]._id, unit: results[1], image: {
                data: results[0]
              }
            })
          }
          HistoryElectric.create({
            room: RoomElectricReader[0]._id, image: {
              data: results[0]
            }
          })
        }
      });

      callback(null);
    }
  ]);



  return Reader.findOneAndUpdate({ barcode: req.params.id }, { image: { data: req.body.image, width: req.body.width, height: req.body.height } }, { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()
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
