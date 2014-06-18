'use strict';

describe('Directive: dragImage', function () {

  // load the directive's module
  beforeEach(module('spriteAnimatorApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<drag-image></drag-image>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the dragImage directive');
  }));
});
