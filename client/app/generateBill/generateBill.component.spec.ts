'use strict';

describe('Component: GenerateBillComponent', function() {
  // load the controller's module
  beforeEach(module('apartmentManageApp.generateBill'));

  var GenerateBillComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    GenerateBillComponent = $componentController('generateBill', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
