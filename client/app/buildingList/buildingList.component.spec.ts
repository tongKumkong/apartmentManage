'use strict';

describe('Component: BuildingListComponent', function () {
  // load the controller's module
  beforeEach(module('apartmentManageApp.buildingList'));

  var BuildingListComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    BuildingListComponent = $componentController('buildingList', {});
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
