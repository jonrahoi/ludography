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
      .replace(/^./, function(str){ return str.toUpperCase(); });
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
    
    d3.json("data/gistfile1.json", function(error, world) {
        console.log("have world object");
        console.log(error);
        console.log(world);
        
        svg.selectAll('path')
            .data(world.features)
            .enter().append('path')
            .attr('d', d3.geo.path().projection(projection))
            .attr('id', function(d){return d.properties.name.replace(/\s+/g, '')})
            .style('fill', 'gray')
            .style('stroke', 'white')
            .style('stroke-width', 1);
        
        var names = ["","Albania","Algeria","Samoa","Andorra","Angola","AntiguaandBarbuda","Azerbaijan","Argentina","Australia","Austria","Bahamas,The","Bahrain","Bangladesh","Armenia","Barbados","Belgium","Bermuda","Bhutan","Bolivia","BosniaandHerzegovina","Botswana","BouvetIsland","Brazil","Belize","BritishIndianOceanTerritory","SolomonIslands","BritishVirginIslands","Brunei","Bulgaria","Burma","Burundi","Belarus","Cambodia","Cameroon","Canada","CapeVerde","CaymanIslands","CentralAfricanRepublic","SriLanka","Chad","Chile","China","Taiwan","ChristmasIsland","Cocos(Keeling)Islands","Colombia","Comoros","Mayotte","Congo,Republicofthe","Congo,DemocraticRepublicofthe","CookIslands","CostaRica","Croatia","Cuba","Cyprus","CzechRepublic","Benin","Denmark","Dominica","DominicanRepublic","Ecuador","ElSalvador","EquatorialGuinea","Ethiopia","Eritrea","Estonia","FaroeIslands","FalklandIslands(IslasMalvinas)","SouthGeorgiaSouthSandwichIslands","Fiji","Finland","AlandIslands","France","FrenchGuiana","FrenchPolynesia","FrenchSouthernandAntarcticLands","Djibouti","Gabon","Georgia","Gambia,The","Palestine","Germany","Ghana","Gibraltar","Kiribati","Greece","Greenland","Grenada","Guadeloupe","Guam","Guatemala","Guinea","Guyana","Haiti","HeardIslandandMcDonaldIslands","HolySee(VaticanCity)","Honduras","HongKong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Coted'Ivoire","Jamaica","Japan","Kazakhstan","Jordan","Kenya","Korea,North","Korea,South","Kuwait","Kyrgyzstan","Laos","Lebanon","Lesotho","Latvia","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Martinique","Mauritania","Mauritius","Mexico","Monaco","Mongolia","Moldova","Montenegro","Montserrat","Morocco","Mozambique","Oman","Namibia","Nauru","Nepal","Netherlands","NetherlandsAntilles","Aruba","NewCaledonia","Vanuatu","NewZealand","Nicaragua","Niger","Nigeria","Niue","NorfolkIsland","Norway","NorthernMarianaIslands","Micronesia,FederatedStatesof","MarshallIslands","Palau","Pakistan","Panama","PapuaNewGuinea","Paraguay","Peru","Philippines","PitcairnIslands","Poland","Portugal","Guinea-Bissau","Timor-Leste","PuertoRico","Qatar","Reunion","Romania","Russia","Rwanda","SaintBarthelemy","SaintHelena","SaintKittsandNevis","Anguilla","SaintLucia","SaintMartin","SaintPierreandMiquelon","SaintVincentandtheGrenadines","SanMarino","SaoTomeandPrincipe","SaudiArabia","Senegal","Serbia","Seychelles","SierraLeone","Singapore","Slovakia","Vietnam","Slovenia","Somalia","SouthAfrica","Zimbabwe","Spain","WesternSahara","Sudan","Suriname","Svalbard","Swaziland","Sweden","Switzerland","Syria","Tajikistan","Thailand","Togo","Tokelau","Tonga","TrinidadandTobago","UnitedArabEmirates","Tunisia","Turkey","Turkmenistan","TurksandCaicosIslands","Tuvalu","Uganda","Ukraine","Macedonia","Egypt","UnitedKingdom","Guernsey","Jersey","IsleofMan","Tanzania","UnitedStates","VirginIslands","BurkinaFaso","Uruguay","Uzbekistan","Venezuela","WallisandFutuna","Samoa","Yemen","Zambia"];
    
        for (x=0; x< names.length; x++){
            var name = names[x],
                delay = 200 * x;
                guy = document.getElementById(name);


            d3.select(guy).transition().delay(delay)
               .style("fill", random_color("hsl"));

            MakeTimeoutCall(function(n){
                var fullName = splitCamel(n);
                document.getElementById("guyName").innerHTML = fullName;
            }, name, delay);
        }
    
    });
    
    d3.select(self.frameElement).style("height", height + "px");

  }
]);
