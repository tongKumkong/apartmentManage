'use strict';

describe('Component: RoomsComponent', function() {
  // load the controller's module
  beforeEach(module('apartmentManageApp.rooms'));

  var RoomsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    RoomsComponent = $componentController('rooms', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
