'use strict';

/* App Module */

angular.module('d3', []);

var worldMapApp = angular.module('worldMapApp', [
  'ngRoute',
  'worldMapControllers',
  'worldMapFilters',
  'd3'
]);