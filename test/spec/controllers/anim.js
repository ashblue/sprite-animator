'use strict';

describe('Controller: AnimCtrl', function () {

  // load the controller's module
  beforeEach(module('spriteAnimatorApp'));

  var AnimCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AnimCtrl = $controller('AnimCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
