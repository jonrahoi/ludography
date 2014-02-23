'use strict';

/* jasmine specs for controllers go here */

describe('ludography controllers', function() {

  // Stub out d3 so the unit tests don't have this dependency -- is there a better way to do this?
  var d3Stub = {
    geo: {
      mercator : function(){return{scale:function(){return{translate:function(){return{precision:function(){}}}}}}},
      path: function(){return{projection:function(){}}},
      graticule: function(){}
    },
    select: function(){return{append:function(){return{attr:function(){return{attr:function(){return{append:function(){return{datum:function(){return{attr:function(){return{attr:function(){}}}}}}}}}}}}},style:function(){}}}
  };

  beforeEach(module('worldMapControllers'));

  describe('getShapeIdForCountryName', function() {

    it('should convert "South Africa" to "southafrica"', inject(function($controller) {
      var scope = {},
          ctrl = $controller('worldMapController', { $scope: scope, d3: d3Stub });
 
      expect(scope.getShapeIdForCountryName("South Africa")).toBe("southafrica");
    }));

  });

});