'use strict';

/* Controllers */

var guregguControllers = angular.module('guregguControllers', []);

guregguControllers.controller('guregguFrontCtrl', ['$scope', '$http', '$interval',
  function($scope, $http, $interval) {
	
  	$scope.badge = {
  		displayEn: "gureggu",
  		displayJp: "グレッグ"
  	}
    $scope.menu = [
		{
			displayEn: "Blog",
			displayJp: "ブログ",
			href: "http://hellokeyboard.tumblr.com/"
		},
		{
			displayEn: "Resume",
			displayJp: "履歴書",
			href: "#/resume"
		},
		{
			displayEn: "LinkedIn",
			href: "http://www.linkedin.com/profile/view?id=2730354"
		},
		{
			displayEn: "Flickr",
			href: "http://www.flickr.com/photos/greghaspants/"
		}
	];
	
	$interval(function() {
	    if ($scope.displayProp == "displayEn") {
	    	$scope.displayProp = "displayJp";
	    } else {
	    	$scope.displayProp = "displayEn";
	    }
	}, 1500);
	
	/* Default to english */
	$scope.displayProp = "displayEn";
	
  }]);

guregguControllers.controller('guregguResumeCtrl', ['$scope', '$http',
  function($scope, $http) {
    /* Do nothing */
  }]);
