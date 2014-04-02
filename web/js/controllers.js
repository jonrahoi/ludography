'use strict';

/* Controllers */

var worldMapControllers = angular.module('worldMapControllers', []);

worldMapControllers.controller('worldMapController', ['$scope', '$http', '$log', '$q', 'd3',
  function($scope, $http, $log, $q, d3) {

    var width = 960,
        height = 960,
        guy = "",
        x=0,
        projection = d3.geo.mercator()
          .scale((width) / 2 / Math.PI)
          .translate([width / 2, height / 2])
          .precision(.1),
        path = d3.geo.path().projection(projection),
        graticule = d3.geo.graticule(),
        svg = d3.select("body").append("svg")
          .attr("width", width)
          .attr("height", height);
        
    $scope.gameLength = 300;
    // for testing
    // $scope.gameLength = 5;
    
    $scope.seaHex = '#BBDDFF';
    $scope.earthHex = '#E3ECCE';

    $scope.random_color = function(format, saturation, lightness){
        var rint = Math.round(0xffffff * Math.random()),
            sat = saturation || "100%",
            light = lightness || "50%";

        switch (format)
        {
            case 'hex':
            return ('#0' + rint.toString(16)).replace(/^#0([0-9a-f]{6})$/i, '#$1');
    
            case 'rgb':
            return 'rgb(' + (rint >> 16) + ',' + (rint >> 8 & 255) + ',' + (rint & 255) + ')';

            case 'hsl':
            return 'hsl(' + (rint >> 16) + ',' + sat + ',' + light + ')';

            default:
            return rint; 
        }

    }

    $scope.splitCamel = function (str){
        return str
        // insert a space before all caps
        .replace(/([A-Z])/g, ' $1')
        // uppercase the first character
        .replace(/^./, function(str){ return str.toUpperCase().trim(); });
    }

    $scope.MakeTimeoutCall = function(fn, data, timeout){
        setTimeout(function() {fn.call(null, data);}, timeout);
    }

    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/array/shuffle [v1.0]
    $scope.shuffle = function(o){ //v1.0
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    $scope.getShapeIdForCountryName = function(i){
        return i.replace(/\s+/g, '').toLowerCase();
    }

    $scope.doAWin = function(name) {
        var delay = 900,
            guy,
            messageTemplate = $scope.shuffle($scope.win)[0],
            message = messageTemplate.replace("{{name}}", name);

        // Increment score by one
        $scope.score++;

        // Change guyName to the winning message
        $scope.guyName = message;

        // Add winMsg class to guyName and score div, remove it a second later
        $scope.guyMsgAnimClass = 'winMsg';
        $scope.scoreMsgAnimClass = 'winMsg';
        $scope.MakeTimeoutCall(function(n){
            $scope.$apply(function() {
                $scope.guyMsgAnimClass = '';
                $scope.scoreMsgAnimClass = '';
            });
        }, null, delay);

        // Fill the country shape
        guy = document.getElementById($scope.getShapeIdForCountryName(name));

        d3.select(guy).transition().style("fill", $scope.random_color("hsl"));          
        d3.select(guy).transition().delay(delay).style("fill", $scope.earthHex);

        // Reset the form
        $scope.answer = "";
    }

    $scope.doALose = function(name) {
        var messageTemplate = $scope.shuffle($scope.lose)[0],
            message = messageTemplate.replace("{{name}}", name);

        $scope.doARedMessage(message);

        // Don't reset the form in case it was a typo
    }

    $scope.doARepeat = function(name) {
        var message = $scope.repeat[0].replace("{{name}}", name);

        $scope.doARedMessage(message);

        // Reset the form
        $scope.answer = "";
    }

    $scope.doARedMessage = function(message) {
        var delay = 900,
            guy;

        // Change guyName to the losing message
        $scope.guyName = message;

        // Add loseMsg class to guyName, remove it a second later
        $scope.guyMsgAnimClass = 'loseMsg';
        $scope.MakeTimeoutCall(function(n){
            $scope.$apply(function() {
                $scope.guyMsgAnimClass = '';
            });
        }, null, delay);
    }

    $scope.handleStart = function() {
        var map, guys;
        
        $scope.score = 0;
        $scope.wonNames = [];
        $scope.secondsLeft = $scope.gameLength;
        $scope.guyName = 'Go!';
        $scope.answer = '';

        // Reset the map fill colors
        map = document.getElementById('map');
        guys = (map != null) ? map.childNodes : [];
        for (var i=0; i<guys.length; i++) {
            d3.select(guys[i]).style("fill", $scope.seaHex);
        }

        // Set the game end for some time in the future
        $scope.mastheadAnimClass = 'anim-300s';
        $scope.MakeTimeoutCall(function(n){
            $scope.$apply(function() {
                $scope.handleEnd();
            });
        }, null, $scope.gameLength * 1000);

        $scope.countdown = setInterval($scope.handleCountdownTimer, 1000);

        $scope.gameState = $scope.gameStates.inProgress;
    }

    $scope.handleEnd = function() {
        $scope.gameState = $scope.gameStates.stopped;
        $scope.mastheadAnimClass = '';
        clearInterval($scope.countdown);
        
        $scope.endMessage = 'Okay you got ' + $scope.score + ' out of ' + $scope.numCountries + ', which is fine I guess.';
        $scope.startText = "Start over?";
    }
    
    $scope.handleCountdownTimer = function() {
        if ($scope.secondsLeft === 0) {
            clearInterval($scope.countdown);
        } else {
            $scope.$apply(function() {
                $scope.secondsLeft--;
            });
        }
    }

    $scope.handleOnLoad = function() {
        $scope.gameState = $scope.gameStates.stopped;
        $scope.startText = 'Start -- you have ' + $scope.gameLength + ' seconds';
    }
    
    // Function invoked by Angular whenever the form is submitted
    $scope.handleAnswer = function(answer) {
        var lowercaseInput = answer.toLowerCase(),
            indexOf = $scope.lowercaseNames.indexOf(lowercaseInput),
            hasAlready = $scope.wonNames.indexOf(lowercaseInput);

        if (answer.length === 0) {
            return; // do nothing
        }

        if (indexOf > -1 && hasAlready === -1) {
            $scope.doAWin($scope.names[indexOf]);
            $scope.wonNames.push(lowercaseInput);
        } else if (hasAlready > -1) {
            $scope.doARepeat(answer);
        } else {
            $scope.doALose(answer);
        }
    }

    // All possible game states
    $scope.gameStates = {
        'stopped': 0,
        'inProgress': 1
    };

    // Current game state
    $scope.gameState = $scope.gameStates.stopped;

    $scope.startText = 'Loading...';

    $scope.names = [], $scope.lowercaseNames = []; // These are later pushed to with the geo data file data

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path);

    $scope.geodata = $http.get('data/gistfile1.json', {cache: false});
    $scope.strings = $http.get('data/strings.json', {cache: false});
    $q.all([$scope.geodata, $scope.strings]).then(function(values) {

        var world = values[0].data,
            strings = values[1].data,
            features = world.features;

        $scope.numCountries = features.length;

        $scope.win = strings.en.wins;
        $scope.lose = strings.en.loses;
        $scope.repeat = strings.en.repeats;

        // Construct an array of country names
        for (x=0; x< features.length; x++){
            $scope.names.push(features[x].properties.name);
            $scope.lowercaseNames.push(features[x].properties.name.toLowerCase()); // for ease of searching
        }

        // Draw the initial map
        svg.attr('id', 'map')
            .selectAll('path')
            .data(world.features)
            .enter().append('path')
            .attr('d', d3.geo.path().projection(projection))
            .attr('id', function(d){return $scope.getShapeIdForCountryName(d.properties.name);})
            .style('fill', $scope.seaHex)
            .style('stroke', 'gray')
            .style('stroke-width', 0.5);

        $scope.handleOnLoad();

    });

    d3.select(self.frameElement).style("height", height + "px");

  }
]);
