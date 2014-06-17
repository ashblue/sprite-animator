'use strict';

describe('Directive: animManager', function () {

  // load the directive's module
  beforeEach(module('spriteAnimatorApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<anim-manager></anim-manager>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the animManager directive');
  }));
});
