'use strict';

describe('worldMapFilters', function() {

  describe('displayif', function() {

    beforeEach(module('worldMapFilters'));
	
	it('should return empty string or d-n if the conditions match or don\'t match (hiding it where they don\'t match', inject(function(displayifFilter) {
		expect(displayifFilter(1,1)).toBe('');
		expect(displayifFilter(1,0)).toBe('d-n');
	}));

  });
});