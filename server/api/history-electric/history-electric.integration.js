'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newHistoryElectric;

describe('HistoryElectric API:', function() {
  describe('GET /api/history-electrics', function() {
    var historyElectrics;

    beforeEach(function(done) {
      request(app)
        .get('/api/history-electrics')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          historyElectrics = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(historyElectrics).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/history-electrics', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/history-electrics')
        .send({
          name: 'New HistoryElectric',
          info: 'This is the brand new historyElectric!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newHistoryElectric = res.body;
          done();
        });
    });

    it('should respond with the newly created historyElectric', function() {
      expect(newHistoryElectric.name).to.equal('New HistoryElectric');
      expect(newHistoryElectric.info).to.equal('This is the brand new historyElectric!!!');
    });
  });

  describe('GET /api/history-electrics/:id', function() {
    var historyElectric;

    beforeEach(function(done) {
      request(app)
        .get(`/api/history-electrics/${newHistoryElectric._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          historyElectric = res.body;
          done();
        });
    });

    afterEach(function() {
      historyElectric = {};
    });

    it('should respond with the requested historyElectric', function() {
      expect(historyElectric.name).to.equal('New HistoryElectric');
      expect(historyElectric.info).to.equal('This is the brand new historyElectric!!!');
    });
  });

  describe('PUT /api/history-electrics/:id', function() {
    var updatedHistoryElectric;

    beforeEach(function(done) {
      request(app)
        .put(`/api/history-electrics/${newHistoryElectric._id}`)
        .send({
          name: 'Updated HistoryElectric',
          info: 'This is the updated historyElectric!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedHistoryElectric = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedHistoryElectric = {};
    });

    it('should respond with the updated historyElectric', function() {
      expect(updatedHistoryElectric.name).to.equal('Updated HistoryElectric');
      expect(updatedHistoryElectric.info).to.equal('This is the updated historyElectric!!!');
    });

    it('should respond with the updated historyElectric on a subsequent GET', function(done) {
      request(app)
        .get(`/api/history-electrics/${newHistoryElectric._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let historyElectric = res.body;

          expect(historyElectric.name).to.equal('Updated HistoryElectric');
          expect(historyElectric.info).to.equal('This is the updated historyElectric!!!');

          done();
        });
    });
  });

  describe('PATCH /api/history-electrics/:id', function() {
    var patchedHistoryElectric;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/history-electrics/${newHistoryElectric._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched HistoryElectric' },
          { op: 'replace', path: '/info', value: 'This is the patched historyElectric!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedHistoryElectric = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedHistoryElectric = {};
    });

    it('should respond with the patched historyElectric', function() {
      expect(patchedHistoryElectric.name).to.equal('Patched HistoryElectric');
      expect(patchedHistoryElectric.info).to.equal('This is the patched historyElectric!!!');
    });
  });

  describe('DELETE /api/history-electrics/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/history-electrics/${newHistoryElectric._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when historyElectric does not exist', function(done) {
      request(app)
        .delete(`/api/history-electrics/${newHistoryElectric._id}`)
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
