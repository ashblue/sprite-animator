'use strict';

describe('Controller: AnimGroupCtrl', function () {

  // load the controller's module
  beforeEach(module('spriteAnimatorApp'));

  var AnimGroupCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AnimGroupCtrl = $controller('AnimGroupCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
