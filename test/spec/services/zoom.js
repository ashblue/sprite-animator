'use strict';

describe('Service: zoomData', function () {

  // load the service's module
  beforeEach(module('spriteAnimatorApp'));

  // instantiate service
  var zoomData;
  beforeEach(inject(function (_zoomData_) {
      zoomData = _zoomData_;
  }));

  it('should do something', function () {
    expect(!!zoomData).toBe(true);
  });

});
