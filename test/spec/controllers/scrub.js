'use strict';

describe('Controller: ScrubCtrl', function () {

  // load the controller's module
  beforeEach(module('spriteAnimatorApp'));

  var ScrubCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ScrubCtrl = $controller('ScrubCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
