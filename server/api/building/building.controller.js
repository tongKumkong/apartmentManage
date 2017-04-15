/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/buildings              ->  index
 * POST    /api/buildings              ->  create
 * GET     /api/buildings/:id          ->  show
 * PUT     /api/buildings/:id          ->  upsert
 * PATCH   /api/buildings/:id          ->  patch
 * DELETE  /api/buildings/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Building from './building.model';
import mongoose from 'mongoose';

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

// Gets a list of Buildings
export function index(req, res) {
  return Building.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Building from the DB
export function show(req, res) {
  return Building.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getMine(req, res) {
  
  var userId = mongoose.Types.ObjectId(req.user._id); ;

  return Building.find({owner: userId}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
// Creates a new Building in the DB
export function create(req, res) {
  return Building.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Building in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Building.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Building in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Building.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Building from the DB
export function destroy(req, res) {
  return Building.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
