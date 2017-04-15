'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var buildingCtrlStub = {
  index: 'buildingCtrl.index',
  show: 'buildingCtrl.show',
  create: 'buildingCtrl.create',
  upsert: 'buildingCtrl.upsert',
  patch: 'buildingCtrl.patch',
  destroy: 'buildingCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var buildingIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './building.controller': buildingCtrlStub
});

describe('Building API Router:', function() {
  it('should return an express router instance', function() {
    expect(buildingIndex).to.equal(routerStub);
  });

  describe('GET /api/buildings', function() {
    it('should route to building.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'buildingCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/buildings/:id', function() {
    it('should route to building.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'buildingCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/buildings', function() {
    it('should route to building.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'buildingCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/buildings/:id', function() {
    it('should route to building.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'buildingCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/buildings/:id', function() {
    it('should route to building.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'buildingCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/buildings/:id', function() {
    it('should route to building.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'buildingCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
