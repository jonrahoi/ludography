'use strict';

/* Controllers */

var worldMapControllers = angular.module('worldMapControllers', []);

worldMapControllers.controller('worldMapController', ['$scope', '$http',
  function($scope, $http) {

    var taunts = ["( ≧Д≦)","o(-`д´- ｡) ","((╬ಠิ﹏ಠิ))","(；￣Д￣） ","ಠ_ರೃ ","(」゜ロ゜)」","(;¬_¬) ","凸(｀0´)凸 ","(*｀へ´*)","（；¬＿¬) ","-`д´- ","(*≧m≦*)","(｡+･`ω･´) ","｡゜(｀Д´)゜｡ ","(/ﾟДﾟ)/","(*￣m￣) ","( •̀ω•́ )σ ","(＃｀д´)ﾉ","(>人<) ","( ꒪Д꒪)ノ ","(#ಠQಠ#)","(¬_¬) ","(　ﾟДﾟ)＜!! ","(‡▼益▼)","(¬､¬) ","( ಠ ಠ ) ","(´･益･｀*)","(¬▂¬) ","(･｀ｪ´･)つ ","(´Д｀)","(⋋▂⋌) ","(,,#ﾟДﾟ) ","(҂⌣̀_⌣́)","＼(｀0´)／ ","lol what are you staring at this for?","(； ｀ｪ´ ；)b三b ","(>_<)","ヽ(｀⌒´メ)ノ ","(；¬д¬) ","（＞д＜）","ヽ(●-`Д´-)ノ ","（;≧皿≦） ","(¬д¬。)","ヽ༼ ಠ益ಠ ༽ﾉ ","(((p(>o<)q))) ","（≧▼≦；)","(≧σ≦) ","(◣_◢) ","(ᇂ∀ᇂ╬)","(╬ﾟ◥益◤ﾟ) ","(ू˃̣̣̣̣̣̣︿˂̣̣̣̣̣̣ ू) ","(ノ≧┏Д┓≦)ノ","hurry up","(`ヘ´)","（´・ω・｀）","（ ´Д｀）","（　ﾟДﾟ）"," ┐('～`；)┌ ","（´∀｀）","（　´_ゝ`）"," Σ(゜д゜;)","(*´Д`)","(─▽─)","(ﾟ∀ﾟ)"],
        earthHex = '#E3ECCE',
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

        // TODO: pause taunting

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

        // TODO: resume taunting
    }

    function doALose(name) {
        var delay = 900,
            guy,
            messageTemplate = shuffle($scope.lose)[0],
            message = messageTemplate.replace("{{name}}", name);

        // TODO: pause taunting

        // Change guyName to the losing message
        $scope.guyName = message;

        // Add loseMsg class to guyName, remove it a second later
        $scope.guyMsgAnimClass = 'loseMsg';
        MakeTimeoutCall(function(n){
            $scope.$apply(function() {
                $scope.guyMsgAnimClass = '';
            });
        }, null, delay);

        // TODO: resume taunting
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

    $scope.win = ["(*ﾟ▽ﾟ)/ﾟ･:*【{{name}}】*:･ﾟ＼(ﾟ▽ﾟ*)","*ﾟﾛﾟ)*ﾟﾛﾟ)*ﾟﾛﾟ)ﾉ~★{{name}}★~ヽ(ﾟﾛﾟ*(ﾟﾛﾟ*(ﾟﾛﾟ*","(=^･･^)ﾉ {{name}}!!","★⌒☆⌒★〓☆ {{name}} ☆〓★⌒☆⌒★","(▼▼ﾒ)/●~*【{{name}}】*~●＼(▼▼ﾒ)","(ﾉ^^)ﾉ———————※※☆★{{name}}!!★☆"];
    $scope.lose = ["\"{{name}}\"? ヽ(〃' x ' )ﾉ彡☆ no no no no no", "\"{{name}}\"? (ｏ・_・)ノ”(ノ_<。) ","(*_*、)ヾ(-ω- ) {{name}}"];

    $scope.taunts = taunts;

    $scope.guyName = "Go!!!!!!!";
    $scope.score = 0;

    $scope.names = [], $scope.lowercaseNames = []; // These are later pushed to with the geo data file data

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path);

    $http.get('data/gistfile1.json').success(function(world) {
        console.log("have world object");
        
        var features = world.features,
            taunts = shuffle($scope.taunts);

        $scope.total = features.length;

        // Construct an array of country names
        for (x=0; x< features.length; x++){
            $scope.names.push(features[x].properties.name);
            $scope.lowercaseNames.push(features[x].properties.name.toLowerCase()); // for ease of searching
        }

        $scope.handleAnswer = function(answer) {
            var lowercaseInput = answer.toLowerCase(),
                indexOf = $scope.lowercaseNames.indexOf(lowercaseInput);

            if (indexOf === -1) {
                doALose(answer);
            } else {
                doAWin($scope.names[indexOf]);
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

        // Taunts
        /* 
        for (x=0; x < taunts.length; x++){
            var delay = 1000 * x,
                taunt = taunts[x];

            MakeTimeoutCall(function(n) {
                $scope.$apply(function() {
                    $scope.guyName = n;
                });
            }, taunt, delay);
        }
        */

    });
    
    d3.select(self.frameElement).style("height", height + "px");

  }
]);
