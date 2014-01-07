'use strict';

/* Controllers */

var worldMapControllers = angular.module('worldMapControllers', []);

worldMapControllers.controller('worldMapController', ['$scope', '$http', '$log', '$q',
  function($scope, $http, $log, $q) {

    var earthHex = '#E3ECCE',
        seaHex = '#BBDDFF';

    function random_color(format, saturation, lightness){
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

    function splitCamel (str){
      return str
      // insert a space before all caps
      .replace(/([A-Z])/g, ' $1')
      // uppercase the first character
      .replace(/^./, function(str){ return str.toUpperCase().trim(); });
    }

    function MakeTimeoutCall(fn, data, timeout){
      setTimeout(function() {fn.call(null, data);}, timeout);
    }

    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/array/shuffle [v1.0]
    function shuffle(o){ //v1.0
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    function getShapeIdForCountryName(i){
        return i.replace(/\s+/g, '');
    }

    function doAWin(name) {
        var delay = 900,
            guy,
            messageTemplate = shuffle($scope.win)[0],
            message = messageTemplate.replace("{{name}}", name);

        // Increment score by one
        $scope.score++;

        // Change guyName to the winning message
        $scope.guyName = message;

        // Add winMsg class to guyName and score div, remove it a second later
        $scope.guyMsgAnimClass = 'winMsg';
        $scope.scoreMsgAnimClass = 'winMsg';
        MakeTimeoutCall(function(n){
            $scope.$apply(function() {
                $scope.guyMsgAnimClass = '';
                $scope.scoreMsgAnimClass = '';
            });
        }, null, delay);

        // Fill the country shape
        guy = document.getElementById(getShapeIdForCountryName(name));

        d3.select(guy).transition().style("fill", random_color("hsl"));          
        d3.select(guy).transition().delay(delay).style("fill", earthHex);

        // Reset the form
        $scope.answer = "";
    }

    function doALose(name) {
        var messageTemplate = shuffle($scope.lose)[0],
            message = messageTemplate.replace("{{name}}", name);

        doARedMessage(message);

        // Don't reset the form in case it was a typo
    }

    function doARepeat(name) {
        var message = $scope.repeat[0].replace("{{name}}", name);

        doARedMessage(message);

        // Reset the form
        $scope.answer = "";
    }

    function doARedMessage(message) {
        var delay = 900,
            guy;

        // Change guyName to the losing message
        $scope.guyName = message;

        // Add loseMsg class to guyName, remove it a second later
        $scope.guyMsgAnimClass = 'loseMsg';
        MakeTimeoutCall(function(n){
            $scope.$apply(function() {
                $scope.guyMsgAnimClass = '';
            });
        }, null, delay);
    }

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

    // $scope.guyName = "Go!!!!!!!";
    $scope.score = 0;

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

        $scope.total = features.length;

        $scope.win = strings.en.wins;
        $scope.lose = strings.en.loses;
        $scope.repeat = strings.en.repeats;
        $scope.guyName = strings.en.go;

        // Construct an array of country names
        for (x=0; x< features.length; x++){
            $scope.names.push(features[x].properties.name);
            $scope.lowercaseNames.push(features[x].properties.name.toLowerCase()); // for ease of searching
            $scope.wonNames = [];
        }

        console.log(JSON.stringify($scope.lowercaseNames));

        // Function invoked by Angular whenever the form is submitted
        $scope.handleAnswer = function(answer) {
            var lowercaseInput = answer.toLowerCase(),
                indexOf = $scope.lowercaseNames.indexOf(lowercaseInput),
                hasAlready = $scope.wonNames.indexOf(lowercaseInput);

            if (answer.length === 0) {
                return; // do nothing
            }

            if (indexOf > -1 && hasAlready === -1) {
                doAWin($scope.names[indexOf]);
                $scope.wonNames.push(lowercaseInput);
            } else if (hasAlready > -1) {
                doARepeat(answer);
            } else {
                doALose(answer);
            }
        }

        // Draw the initial map
        svg.selectAll('path')
            .data(world.features)
            .enter().append('path')
            .attr('d', d3.geo.path().projection(projection))
            .attr('id', function(d){return getShapeIdForCountryName(d.properties.name);})
            .style('fill', '#BBDDFF')
            .style('stroke', 'gray')
            .style('stroke-width', 0.5);

    });
    
    d3.select(self.frameElement).style("height", height + "px");

  }
]);
