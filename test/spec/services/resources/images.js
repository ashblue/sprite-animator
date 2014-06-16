'use strict';

describe('Service: ResourcesImages', function () {

  // load the service's module
  beforeEach(module('spriteAnimatorApp'));

  // instantiate service
  var ResourcesImages;
  beforeEach(inject(function (_ResourcesImages_) {
    ResourcesImages = _ResourcesImages_;
  }));

  it('should do something', function () {
    expect(!!ResourcesImages).toBe(true);
  });

});
