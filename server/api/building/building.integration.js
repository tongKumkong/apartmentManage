'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newBuilding;

describe('Building API:', function() {
  describe('GET /api/buildings', function() {
    var buildings;

    beforeEach(function(done) {
      request(app)
        .get('/api/buildings')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          buildings = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(buildings).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/buildings', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/buildings')
        .send({
          name: 'New Building',
          info: 'This is the brand new building!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newBuilding = res.body;
          done();
        });
    });

    it('should respond with the newly created building', function() {
      expect(newBuilding.name).to.equal('New Building');
      expect(newBuilding.info).to.equal('This is the brand new building!!!');
    });
  });

  describe('GET /api/buildings/:id', function() {
    var building;

    beforeEach(function(done) {
      request(app)
        .get(`/api/buildings/${newBuilding._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          building = res.body;
          done();
        });
    });

    afterEach(function() {
      building = {};
    });

    it('should respond with the requested building', function() {
      expect(building.name).to.equal('New Building');
      expect(building.info).to.equal('This is the brand new building!!!');
    });
  });

  describe('PUT /api/buildings/:id', function() {
    var updatedBuilding;

    beforeEach(function(done) {
      request(app)
        .put(`/api/buildings/${newBuilding._id}`)
        .send({
          name: 'Updated Building',
          info: 'This is the updated building!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedBuilding = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBuilding = {};
    });

    it('should respond with the updated building', function() {
      expect(updatedBuilding.name).to.equal('Updated Building');
      expect(updatedBuilding.info).to.equal('This is the updated building!!!');
    });

    it('should respond with the updated building on a subsequent GET', function(done) {
      request(app)
        .get(`/api/buildings/${newBuilding._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let building = res.body;

          expect(building.name).to.equal('Updated Building');
          expect(building.info).to.equal('This is the updated building!!!');

          done();
        });
    });
  });

  describe('PATCH /api/buildings/:id', function() {
    var patchedBuilding;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/buildings/${newBuilding._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Building' },
          { op: 'replace', path: '/info', value: 'This is the patched building!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedBuilding = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedBuilding = {};
    });

    it('should respond with the patched building', function() {
      expect(patchedBuilding.name).to.equal('Patched Building');
      expect(patchedBuilding.info).to.equal('This is the patched building!!!');
    });
  });

  describe('DELETE /api/buildings/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/buildings/${newBuilding._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when building does not exist', function(done) {
      request(app)
        .delete(`/api/buildings/${newBuilding._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
