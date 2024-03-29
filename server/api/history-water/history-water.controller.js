/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/history-waters              ->  index
 * POST    /api/history-waters              ->  create
 * GET     /api/history-waters/:id          ->  show
 * PUT     /api/history-waters/:id          ->  upsert
 * PATCH   /api/history-waters/:id          ->  patch
 * DELETE  /api/history-waters/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import HistoryWater from './history-water.model';

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

// Gets a list of HistoryWaters
export function index(req, res) {
  return HistoryWater.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single HistoryWater from the DB
export function show(req, res) {
  return HistoryWater.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//Gets a histoty by room id
export function showByRoom(req, res) {
  return HistoryWater.find({room:req.params.id}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//Gets a history by room id and nearest date
export function showByRoomAndDate(req, res) {
  var date = new Date(req.params.date);
  return HistoryWater.find({room:req.params.id,date:{$gte: date, $lte:date}})
    .sort({date:1}).limit(1).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new HistoryWater in the DB
export function create(req, res) {
  return HistoryWater.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given HistoryWater in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return HistoryWater.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing HistoryWater in the DB
export function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return HistoryWater.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a HistoryWater from the DB
export function destroy(req, res) {
  return HistoryWater.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
