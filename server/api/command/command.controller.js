/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/commands              ->  index
 * POST    /api/commands              ->  create
 * GET     /api/commands/:id          ->  show
 * PUT     /api/commands/:id          ->  upsert
 * PATCH   /api/commands/:id          ->  patch
 * DELETE  /api/commands/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Command from './command.model';

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

// Gets a list of Commands
export function index(req, res) {
  return Command.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Command from the DB
export function show(req, res) {
  return Command.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Command in the DB
export function create(req, res) {
  return Command.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Command in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Command.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Command in the DB
export function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Command.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Command from the DB
export function destroy(req, res) {
  return Command.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
