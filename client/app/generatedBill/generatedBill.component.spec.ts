'use strict';

describe('Component: GeneratedBillComponent', function() {
  // load the controller's module
  beforeEach(module('apartmentManageApp.generatedBill'));

  var GeneratedBillComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    GeneratedBillComponent = $componentController('generatedBill', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
