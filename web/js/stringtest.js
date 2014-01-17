var countries = ["afghanistan","albania","algeria","andorra","angola","antigua and barbuda","azerbaijan","argentina","australia","austria","bahamas, the","bahrain","bangladesh","armenia","barbados","belgium","bermuda","bhutan","bolivia","bosnia and herzegovina","botswana","bouvet island","brazil","belize","british indian ocean territory","solomon islands","british virgin islands","brunei","bulgaria","burma","burundi","belarus","cambodia","cameroon","canada","cape verde","cayman islands","central african republic","sri lanka","chad","chile","china","taiwan","christmas island","cocos (keeling) islands","colombia","comoros","mayotte","congo, republic of the","congo, democratic republic of the","cook islands","costa rica","croatia","cuba","cyprus","czech republic","benin","denmark","dominica","dominican republic","ecuador","el salvador","equatorial guinea","ethiopia","eritrea","estonia","faroe islands","falkland islands (islas malvinas)","south georgia south sandwich islands","fiji","finland","aland islands","france","french guiana","french polynesia","french southern and antarctic lands","djibouti","gabon","georgia","gambia, the","palestine","germany","ghana","gibraltar","kiribati","greece","greenland","grenada","guadeloupe","guam","guatemala","guinea","guyana","haiti","heard island and mcdonald islands","holy see (vatican city)","honduras","hong kong","hungary","iceland","india","indonesia","iran","iraq","ireland","israel","italy","cote d'ivoire","jamaica","japan","kazakhstan","jordan","kenya","korea, north","korea, south","kuwait","kyrgyzstan","laos","lebanon","lesotho","latvia","liberia","libya","liechtenstein","lithuania","luxembourg","macau","madagascar","malawi","malaysia","maldives","mali","malta","martinique","mauritania","mauritius","mexico","monaco","mongolia","moldova","montenegro","montserrat","morocco","mozambique","oman","namibia","nauru","nepal","netherlands","netherlands antilles","aruba","new caledonia","vanuatu","new zealand","nicaragua","niger","nigeria","niue","norfolk island","norway","northern mariana islands","micronesia, federated states of","marshall islands","palau","pakistan","panama","papua new guinea","paraguay","peru","philippines","pitcairn islands","poland","portugal","guinea-bissau","timor-leste","puerto rico","qatar","reunion","romania","russia","rwanda","saint barthelemy","saint helena","saint kitts and nevis","anguilla","saint lucia","saint martin","saint pierre and miquelon","saint vincent and the grenadines","san marino","sao tome and principe","saudi arabia","senegal","serbia","seychelles","sierra leone","singapore","slovakia","vietnam","slovenia","somalia","south africa","zimbabwe","spain","western sahara","sudan","suriname","svalbard","swaziland","sweden","switzerland","syria","tajikistan","thailand","togo","tokelau","tonga","trinidad and tobago","united arab emirates","tunisia","turkey","turkmenistan","turks and caicos islands","tuvalu","uganda","ukraine","macedonia","egypt","united kingdom","guernsey","jersey","isle of man","tanzania","united states","virgin islands","burkina faso","uruguay","uzbekistan","venezuela","wallis and futuna","samoa","yemen","zambia"];
var cnt, x, db = {};

var score = {};


for (var i in countries){
    score[countries[i]] = false;
}

//Initial scoreboard
d3.select("div.scoreboard").text("You've identified 0 out of "+countries.length+" countries");

//Calculate levenshtein distance
function levDist (s, t) {
    var d = []; //2d matrix

    // Step 1
    var n = s.length;
    var m = t.length;

    if (n == 0) return m;
    if (m == 0) return n;

    //Create an array of arrays in javascript (a descending loop is quicker)
    for (var i = n; i >= 0; i--) d[i] = [];

    // Step 2
    for (var i = n; i >= 0; i--) d[i][0] = i;
    for (var j = m; j >= 0; j--) d[0][j] = j;

    // Step 3
    for (var i = 1; i <= n; i++) {
        var s_i = s.charAt(i - 1);

        // Step 4
        for (var j = 1; j <= m; j++) {

            //Check the jagged ld total so far
            if (i == j && d[i][j] > 4) return n;

            var t_j = t.charAt(j - 1);
            var cost = (s_i == t_j) ? 0 : 1; // Step 5

            //Calculate the minimum
            var mi = d[i - 1][j] + 1;
            var b = d[i][j - 1] + 1;
            var c = d[i - 1][j - 1] + cost;

            if (b < mi) mi = b;
            if (c < mi) mi = c;

            d[i][j] = mi; // Step 6

            //Damerau transposition
            if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
            }
        }
    }

    // Step 7
    return d[n][m];
}

function input() {
    //store user-input as variable
	var cnt = document.getElementById("user-input").value;

    //convert user input to lower-case for array matching
    cnt = cnt.toLowerCase();

    //new array for checking country against input
    var checklist = [];

    //store country names and associated levenshtein distance relative to input   
    for(var i in countries) {
        var arrayElement = countries[i];
        checklist.push({name: arrayElement, distance: levDist(cnt, arrayElement)})
    }
        
    //sort array by levenshtein distance in ascending order
    var sortedChecklist = d3.nest()
        .key(function(d) {return d.distance;}).sortKeys(d3.ascending)
        .entries(checklist);

    //return new array by filtering for countries with a levenshtein distance of 4 or less relative to input
    var filteredChecklist = $.grep(sortedChecklist, function(e) {return e.key <= 4;});
   
    //display text showing # of countries associated to levenshtein distance score   


    if(filteredChecklist[0].values.length == 1) {

        //return text indicate there's a match and return country match
        d3.select("div.results").remove();
        d3.select("body").append("div").attr("class", "results");               
        d3.select("div.results").text(function(d) {return "There's a match! And it is "+filteredChecklist[0].values[0].name+"!";})

        //clear input
        document.getElementById("user-input").value = ""

        //update score array to reflect match
        if(countries.indexOf(filteredChecklist[0].values[0].name)>-1) {
            score[filteredChecklist[0].values[0].name] = true;
        }  
        //update scoreboard on HTML
        d3.select("div.scoreboard").text(function() {
            var numofTrue = 1;
            for (i=0; i<score.length; i++) {
                if(score[i] == "true")
                    numofTrue++;
            }
            console.log(numofTrue);
            return "You've identified "+numofTrue+" out of "+countries.length+" countries.";});             
    }
//    console.log(filteredChecklist)
//    console.log(filteredChecklist[0].values.length);
    
    console.log(score);
}
		
