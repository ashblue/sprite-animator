'use strict';

describe('Directive: timelines', function () {

  // load the directive's module
  beforeEach(module('spriteAnimatorApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<timelines></timelines>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the timelines directive');
  }));
});
