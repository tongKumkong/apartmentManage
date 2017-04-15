'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newHistoryWater;

describe('HistoryWater API:', function() {
  describe('GET /api/history-waters', function() {
    var historyWaters;

    beforeEach(function(done) {
      request(app)
        .get('/api/history-waters')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          historyWaters = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(historyWaters).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/history-waters', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/history-waters')
        .send({
          name: 'New HistoryWater',
          info: 'This is the brand new historyWater!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newHistoryWater = res.body;
          done();
        });
    });

    it('should respond with the newly created historyWater', function() {
      expect(newHistoryWater.name).to.equal('New HistoryWater');
      expect(newHistoryWater.info).to.equal('This is the brand new historyWater!!!');
    });
  });

  describe('GET /api/history-waters/:id', function() {
    var historyWater;

    beforeEach(function(done) {
      request(app)
        .get(`/api/history-waters/${newHistoryWater._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          historyWater = res.body;
          done();
        });
    });

    afterEach(function() {
      historyWater = {};
    });

    it('should respond with the requested historyWater', function() {
      expect(historyWater.name).to.equal('New HistoryWater');
      expect(historyWater.info).to.equal('This is the brand new historyWater!!!');
    });
  });

  describe('PUT /api/history-waters/:id', function() {
    var updatedHistoryWater;

    beforeEach(function(done) {
      request(app)
        .put(`/api/history-waters/${newHistoryWater._id}`)
        .send({
          name: 'Updated HistoryWater',
          info: 'This is the updated historyWater!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedHistoryWater = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedHistoryWater = {};
    });

    it('should respond with the updated historyWater', function() {
      expect(updatedHistoryWater.name).to.equal('Updated HistoryWater');
      expect(updatedHistoryWater.info).to.equal('This is the updated historyWater!!!');
    });

    it('should respond with the updated historyWater on a subsequent GET', function(done) {
      request(app)
        .get(`/api/history-waters/${newHistoryWater._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let historyWater = res.body;

          expect(historyWater.name).to.equal('Updated HistoryWater');
          expect(historyWater.info).to.equal('This is the updated historyWater!!!');

          done();
        });
    });
  });

  describe('PATCH /api/history-waters/:id', function() {
    var patchedHistoryWater;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/history-waters/${newHistoryWater._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched HistoryWater' },
          { op: 'replace', path: '/info', value: 'This is the patched historyWater!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedHistoryWater = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedHistoryWater = {};
    });

    it('should respond with the patched historyWater', function() {
      expect(patchedHistoryWater.name).to.equal('Patched HistoryWater');
      expect(patchedHistoryWater.info).to.equal('This is the patched historyWater!!!');
    });
  });

  describe('DELETE /api/history-waters/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/history-waters/${newHistoryWater._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when historyWater does not exist', function(done) {
      request(app)
        .delete(`/api/history-waters/${newHistoryWater._id}`)
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
