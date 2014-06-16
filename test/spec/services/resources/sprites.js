'use strict';

describe('Service: ResourcesSprites', function () {

  // load the service's module
  beforeEach(module('spriteAnimatorApp'));

  // instantiate service
  var ResourcesSprites;
  beforeEach(inject(function (_ResourcesSprites_) {
    ResourcesSprites = _ResourcesSprites_;
  }));

  it('should do something', function () {
    expect(!!ResourcesSprites).toBe(true);
  });

});
