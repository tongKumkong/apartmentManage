'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var historyWaterCtrlStub = {
  index: 'historyWaterCtrl.index',
  show: 'historyWaterCtrl.show',
  create: 'historyWaterCtrl.create',
  upsert: 'historyWaterCtrl.upsert',
  patch: 'historyWaterCtrl.patch',
  destroy: 'historyWaterCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var historyWaterIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './history-water.controller': historyWaterCtrlStub
});

describe('HistoryWater API Router:', function() {
  it('should return an express router instance', function() {
    expect(historyWaterIndex).to.equal(routerStub);
  });

  describe('GET /api/history-waters', function() {
    it('should route to historyWater.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'historyWaterCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/history-waters/:id', function() {
    it('should route to historyWater.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'historyWaterCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/history-waters', function() {
    it('should route to historyWater.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'historyWaterCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/history-waters/:id', function() {
    it('should route to historyWater.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'historyWaterCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/history-waters/:id', function() {
    it('should route to historyWater.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'historyWaterCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/history-waters/:id', function() {
    it('should route to historyWater.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'historyWaterCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
