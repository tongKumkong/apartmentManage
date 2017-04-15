'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var commandCtrlStub = {
  index: 'commandCtrl.index',
  show: 'commandCtrl.show',
  create: 'commandCtrl.create',
  upsert: 'commandCtrl.upsert',
  patch: 'commandCtrl.patch',
  destroy: 'commandCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var commandIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './command.controller': commandCtrlStub
});

describe('Command API Router:', function() {
  it('should return an express router instance', function() {
    expect(commandIndex).to.equal(routerStub);
  });

  describe('GET /api/commands', function() {
    it('should route to command.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'commandCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/commands/:id', function() {
    it('should route to command.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'commandCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/commands', function() {
    it('should route to command.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'commandCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/commands/:id', function() {
    it('should route to command.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'commandCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/commands/:id', function() {
    it('should route to command.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'commandCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/commands/:id', function() {
    it('should route to command.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'commandCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
