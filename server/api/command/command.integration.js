'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newCommand;

describe('Command API:', function() {
  describe('GET /api/commands', function() {
    var commands;

    beforeEach(function(done) {
      request(app)
        .get('/api/commands')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          commands = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(commands).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/commands', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/commands')
        .send({
          name: 'New Command',
          info: 'This is the brand new command!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newCommand = res.body;
          done();
        });
    });

    it('should respond with the newly created command', function() {
      expect(newCommand.name).to.equal('New Command');
      expect(newCommand.info).to.equal('This is the brand new command!!!');
    });
  });

  describe('GET /api/commands/:id', function() {
    var command;

    beforeEach(function(done) {
      request(app)
        .get(`/api/commands/${newCommand._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          command = res.body;
          done();
        });
    });

    afterEach(function() {
      command = {};
    });

    it('should respond with the requested command', function() {
      expect(command.name).to.equal('New Command');
      expect(command.info).to.equal('This is the brand new command!!!');
    });
  });

  describe('PUT /api/commands/:id', function() {
    var updatedCommand;

    beforeEach(function(done) {
      request(app)
        .put(`/api/commands/${newCommand._id}`)
        .send({
          name: 'Updated Command',
          info: 'This is the updated command!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedCommand = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCommand = {};
    });

    it('should respond with the updated command', function() {
      expect(updatedCommand.name).to.equal('Updated Command');
      expect(updatedCommand.info).to.equal('This is the updated command!!!');
    });

    it('should respond with the updated command on a subsequent GET', function(done) {
      request(app)
        .get(`/api/commands/${newCommand._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let command = res.body;

          expect(command.name).to.equal('Updated Command');
          expect(command.info).to.equal('This is the updated command!!!');

          done();
        });
    });
  });

  describe('PATCH /api/commands/:id', function() {
    var patchedCommand;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/commands/${newCommand._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Command' },
          { op: 'replace', path: '/info', value: 'This is the patched command!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedCommand = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedCommand = {};
    });

    it('should respond with the patched command', function() {
      expect(patchedCommand.name).to.equal('Patched Command');
      expect(patchedCommand.info).to.equal('This is the patched command!!!');
    });
  });

  describe('DELETE /api/commands/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/commands/${newCommand._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when command does not exist', function(done) {
      request(app)
        .delete(`/api/commands/${newCommand._id}`)
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
