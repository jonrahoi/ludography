'use strict';

/* Filters */

var worldMapFilters = angular.module('worldMapFilters', []);

// returns 'd-n' if an element is not supposed to be displayed in the current game state
worldMapFilters.filter('displayif', function() {
  return function(input, gameState) {
    if (input === gameState) {
      return '';
    } else {
      return 'd-n';
    }
  }
});