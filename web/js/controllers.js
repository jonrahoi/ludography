'use strict';

/* Controllers */

var worldMapControllers = angular.module('worldMapControllers', []);

worldMapControllers.controller('worldMapController', ['$scope', '$http',
  function($scope, $http) {

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

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path);

    $http.get('data/gistfile1.json').success(function(world) {
        console.log("have world object");
        console.log(world);
        
        var features = world.features;

        // Draw the initial map
        svg.selectAll('path')
            .data(world.features)
            .enter().append('path')
            .attr('d', d3.geo.path().projection(projection))
            .attr('id', function(d){return d.properties.name.replace(/\s+/g, '')})
            .style('fill', 'gray')
            .style('stroke', 'white')
            .style('stroke-width', 1);

        // Set timed functions for coloring the map and showing the country name
        for (x=0; x< features.length; x++){
          var feature = features[x],
              delay = 200 * x,
              name = feature.properties.name,
              guy;

          guy = document.getElementById(name.replace(/\s+/g, ''));

          d3.select(guy).transition().delay(delay)
             .style("fill", random_color("hsl"));

          MakeTimeoutCall(function(n){
              // This callback is later run outside of Angular -- while it has access
              // to $scope.guyName, setting it normally doesn't trigger Angular's data bindings.
              // Run inside $scope.$apply to get around this
              $scope.$apply(function() {
                $scope.guyName = splitCamel(n);
              });
          }, name, delay);

        }
    });
    
    d3.select(self.frameElement).style("height", height + "px");

  }
]);
