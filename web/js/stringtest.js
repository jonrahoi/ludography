var countries = ["afghanistan","albania","algeria","samoa","andorra","angola","antigua and barbuda","azerbaijan","argentina","australia","austria","bahamas, the","bahrain","bangladesh","armenia","barbados","belgium","bermuda","bhutan","bolivia","bosnia and herzegovina","botswana","bouvet island","brazil","belize","british indian ocean territory","solomon islands","british virgin islands","brunei","bulgaria","burma","burundi","belarus","cambodia","cameroon","canada","cape verde","cayman islands","central african republic","sri lanka","chad","chile","china","taiwan","christmas island","cocos (keeling) islands","colombia","comoros","mayotte","congo, republic of the","congo, democratic republic of the","cook islands","costa rica","croatia","cuba","cyprus","czech republic","benin","denmark","dominica","dominican republic","ecuador","el salvador","equatorial guinea","ethiopia","eritrea","estonia","faroe islands","falkland islands (islas malvinas)","south georgia south sandwich islands","fiji","finland","aland islands","france","french guiana","french polynesia","french southern and antarctic lands","djibouti","gabon","georgia","gambia, the","palestine","germany","ghana","gibraltar","kiribati","greece","greenland","grenada","guadeloupe","guam","guatemala","guinea","guyana","haiti","heard island and mcdonald islands","holy see (vatican city)","honduras","hong kong","hungary","iceland","india","indonesia","iran","iraq","ireland","israel","italy","cote d'ivoire","jamaica","japan","kazakhstan","jordan","kenya","korea, north","korea, south","kuwait","kyrgyzstan","laos","lebanon","lesotho","latvia","liberia","libya","liechtenstein","lithuania","luxembourg","macau","madagascar","malawi","malaysia","maldives","mali","malta","martinique","mauritania","mauritius","mexico","monaco","mongolia","moldova","montenegro","montserrat","morocco","mozambique","oman","namibia","nauru","nepal","netherlands","netherlands antilles","aruba","new caledonia","vanuatu","new zealand","nicaragua","niger","nigeria","niue","norfolk island","norway","northern mariana islands","micronesia, federated states of","marshall islands","palau","pakistan","panama","papua new guinea","paraguay","peru","philippines","pitcairn islands","poland","portugal","guinea-bissau","timor-leste","puerto rico","qatar","reunion","romania","russia","rwanda","saint barthelemy","saint helena","saint kitts and nevis","anguilla","saint lucia","saint martin","saint pierre and miquelon","saint vincent and the grenadines","san marino","sao tome and principe","saudi arabia","senegal","serbia","seychelles","sierra leone","singapore","slovakia","vietnam","slovenia","somalia","south africa","zimbabwe","spain","western sahara","sudan","suriname","svalbard","swaziland","sweden","switzerland","syria","tajikistan","thailand","togo","tokelau","tonga","trinidad and tobago","united arab emirates","tunisia","turkey","turkmenistan","turks and caicos islands","tuvalu","uganda","ukraine","macedonia","egypt","united kingdom","guernsey","jersey","isle of man","tanzania","united states","virgin islands","burkina faso","uruguay","uzbekistan","venezuela","wallis and futuna","samoa","yemen","zambia"];
			var cnt, x, db = {};
			
	function getEditDistance (a, b){
				if(a.length == 0) return b.length;
				if(b.length == 0) return a.length;
				
				var matrix = [];
				
				//increment along the first column of each row	
				var i;
				for(i=0; i<= a.length; i++){
					matrix[i] = [i];
				}
				
				var j;
				for(j=0; j<=a.length; j++){
					matrix[0][j] = j;
				}
				
				//Fill in the rest of the matrix
				for(i = 1; i <= b.length; i++){
					for(j = 1; j <= a.length; j++){
						if(b.charAt(i-1) == a.charAt(j-1)){
							matrix[i][j] = matrix[i-1][j-1];
						} else {
							matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, //substitution
													Math.min(matrix[i][j-1] + 1, //insertion
															 matrix[i-1][j] + 1));
							
							}
						}
					}
					
					return matrix[b.length][a.length];
			}
	

			for (x=0; x<countries.length; x++){
				db[countries[x]] = true;
			}
			
			cnt = "Brazil";
			
			cnt = cnt.toLowerCase();


			
			if (db[cnt]) {
				//exact match
			}else{
				for (x=0; x< countries.length; x++){
					console.log(countries[x] + " = " + getEditDistance(cnt, countries[x]));
				}
			}
			
			

		

			//validate the input = spell check, fuzzy matching (levenshtein distance)
			
			console.log(score);

		//compute the edit distance between the two strings
		
