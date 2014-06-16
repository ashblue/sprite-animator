'use strict';

describe('Service: Zoom', function () {

  // load the service's module
  beforeEach(module('spriteAnimatorApp'));

  // instantiate service
  var Zoom;
  beforeEach(inject(function (_Zoom_) {
    Zoom = _Zoom_;
  }));

  it('should do something', function () {
    expect(!!Zoom).toBe(true);
  });

});
