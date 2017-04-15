'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var historyElectricCtrlStub = {
  index: 'historyElectricCtrl.index',
  show: 'historyElectricCtrl.show',
  create: 'historyElectricCtrl.create',
  upsert: 'historyElectricCtrl.upsert',
  patch: 'historyElectricCtrl.patch',
  destroy: 'historyElectricCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var historyElectricIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './history-electric.controller': historyElectricCtrlStub
});

describe('HistoryElectric API Router:', function() {
  it('should return an express router instance', function() {
    expect(historyElectricIndex).to.equal(routerStub);
  });

  describe('GET /api/history-electrics', function() {
    it('should route to historyElectric.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'historyElectricCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/history-electrics/:id', function() {
    it('should route to historyElectric.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'historyElectricCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/history-electrics', function() {
    it('should route to historyElectric.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'historyElectricCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/history-electrics/:id', function() {
    it('should route to historyElectric.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'historyElectricCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/history-electrics/:id', function() {
    it('should route to historyElectric.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'historyElectricCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/history-electrics/:id', function() {
    it('should route to historyElectric.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'historyElectricCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
