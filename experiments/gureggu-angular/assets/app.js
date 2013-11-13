'use strict';

/* App Module */

var guregguApp = angular.module('guregguApp', [
  'ngRoute',
  'guregguControllers'
]).filter('displayl18n', function() {
	return function(input, displayProp) {
		if (input[displayProp]) {
			return input[displayProp];
		} else {
			// Just default to english
			return input['displayEn'];
		}
	}
});

guregguApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/resume', {
        templateUrl: 'partials/resume.html',
        controller: 'guregguResumeCtrl'
      }).
      otherwise({
        templateUrl: 'partials/front.html',
        controller: 'guregguFrontCtrl'
      });
  }]);