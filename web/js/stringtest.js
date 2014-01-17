var countries = ["afghanistan","albania","algeria","andorra","angola","antigua and barbuda","azerbaijan","argentina","australia","austria","bahamas, the","bahrain","bangladesh","armenia","barbados","belgium","bermuda","bhutan","bolivia","bosnia and herzegovina","botswana","bouvet island","brazil","belize","british indian ocean territory","solomon islands","british virgin islands","brunei","bulgaria","burma","burundi","belarus","cambodia","cameroon","canada","cape verde","cayman islands","central african republic","sri lanka","chad","chile","china","taiwan","christmas island","cocos (keeling) islands","colombia","comoros","mayotte","congo, republic of the","congo, democratic republic of the","cook islands","costa rica","croatia","cuba","cyprus","czech republic","benin","denmark","dominica","dominican republic","ecuador","el salvador","equatorial guinea","ethiopia","eritrea","estonia","faroe islands","falkland islands (islas malvinas)","south georgia south sandwich islands","fiji","finland","aland islands","france","french guiana","french polynesia","french southern and antarctic lands","djibouti","gabon","georgia","gambia, the","palestine","germany","ghana","gibraltar","kiribati","greece","greenland","grenada","guadeloupe","guam","guatemala","guinea","guyana","haiti","heard island and mcdonald islands","holy see (vatican city)","honduras","hong kong","hungary","iceland","india","indonesia","iran","iraq","ireland","israel","italy","cote d'ivoire","jamaica","japan","kazakhstan","jordan","kenya","korea, north","korea, south","kuwait","kyrgyzstan","laos","lebanon","lesotho","latvia","liberia","libya","liechtenstein","lithuania","luxembourg","macau","madagascar","malawi","malaysia","maldives","mali","malta","martinique","mauritania","mauritius","mexico","monaco","mongolia","moldova","montenegro","montserrat","morocco","mozambique","oman","namibia","nauru","nepal","netherlands","netherlands antilles","aruba","new caledonia","vanuatu","new zealand","nicaragua","niger","nigeria","niue","norfolk island","norway","northern mariana islands","micronesia, federated states of","marshall islands","palau","pakistan","panama","papua new guinea","paraguay","peru","philippines","pitcairn islands","poland","portugal","guinea-bissau","timor-leste","puerto rico","qatar","reunion","romania","russia","rwanda","saint barthelemy","saint helena","saint kitts and nevis","anguilla","saint lucia","saint martin","saint pierre and miquelon","saint vincent and the grenadines","san marino","sao tome and principe","saudi arabia","senegal","serbia","seychelles","sierra leone","singapore","slovakia","vietnam","slovenia","somalia","south africa","zimbabwe","spain","western sahara","sudan","suriname","svalbard","swaziland","sweden","switzerland","syria","tajikistan","thailand","togo","tokelau","tonga","trinidad and tobago","united arab emirates","tunisia","turkey","turkmenistan","turks and caicos islands","tuvalu","uganda","ukraine","macedonia","egypt","united kingdom","guernsey","jersey","isle of man","tanzania","united states","virgin islands","burkina faso","uruguay","uzbekistan","venezuela","wallis and futuna","samoa","yemen","zambia"],

cnt, x, db = {}, score = {}, tally = 0, resultText = "";

countries.forEach(function(guy){
	score[guy] = false;
});


//Initial scoreboard
d3.select("div.scoreboard").text("You've identified 0 out of "+countries.length+" countries");

//Calculate levenshtein distance
		
$("#cinput").on("submit", function(evt) {
	console.log(evt);	
	evt.preventDefault();
	//store user-input as variable
	var checklist, cnt = document.getElementById("user-input").value;

    //convert user input to lower-case for array matching
    cnt = cnt.toLowerCase();

    //new array for checking country against input
    checklist = [];

    //store country names and associated levenshtein distance relative to input   
    countries.forEach(function(arrayElement){
	    checklist.push({name: arrayElement, distance: levDist(cnt, arrayElement)});
    });
        
    //sort array by levenshtein distance in ascending order
    var sortedChecklist = d3.nest()
        .key(function(d) {return d.distance;}).sortKeys(d3.ascending)
        .entries(checklist);

    //return new array by filtering for countries with a levenshtein distance of 4 or less relative to input
    var filteredChecklist = $.grep(sortedChecklist, function(e) {return e.key <= 1;});
   
    //display text showing # of countries associated to levenshtein distance score   


    if(filteredChecklist[0] && filteredChecklist[0].values && filteredChecklist[0].values.length === 1) {

        //return text indicate there's a match and return country match
//        d3.select("div.results").remove();
//        d3.select("body").append("div").attr("class", "results");  
		resultText = cnt + " = "+filteredChecklist[0].values[0].name+" ("+filteredChecklist[0].values[0].distance+ ") !<br/>" + resultText;
		
        d3.select("div.results").html(resultText);

        $("#user-input").val('');
        

        //update score array to reflect match
        if(countries.indexOf(filteredChecklist[0].values[0].name)>-1) {
        	if (score[filteredChecklist[0].values[0].name] === false){
	        	score[filteredChecklist[0].values[0].name] = true;
	            tally++;
        	}
            
        }  
        //update scoreboard on HTML
        d3.select("div.scoreboard").text("You've identified "+tally+" out of "+countries.length+" countries.");             
    }else{
	    $("#user-input").val('');
	    resultText = cnt + " isn't a recognized country <br/>" + resultText;
	    
	    d3.select("div.results").html(resultText);
    }
//    console.log(filteredChecklist)
//    console.log(filteredChecklist[0].values.length);
    
});