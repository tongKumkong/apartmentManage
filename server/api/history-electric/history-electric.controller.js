/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/history-electrics              ->  index
 * POST    /api/history-electrics              ->  create
 * GET     /api/history-electrics/:id          ->  show
 * PUT     /api/history-electrics/:id          ->  upsert
 * PATCH   /api/history-electrics/:id          ->  patch
 * DELETE  /api/history-electrics/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import HistoryElectric from './history-electric.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of HistoryElectrics
export function index(req, res) {
  return HistoryElectric.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single HistoryElectric from the DB
export function show(req, res) {
  return HistoryElectric.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//Gets a histoty by room id
export function showByRoom(req, res) {
  return HistoryElectric.find({room:req.params.id}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new HistoryElectric in the DB
export function create(req, res) {
  return HistoryElectric.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given HistoryElectric in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return HistoryElectric.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing HistoryElectric in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return HistoryElectric.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a HistoryElectric from the DB
export function destroy(req, res) {
  return HistoryElectric.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
