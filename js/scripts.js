// Load the feeds
$('#tweakers').FeedEk( {
	FeedUrl : 'https://tweakers.net/feeds/nieuws.xml',
	MaxCount : 40,
	ShowDesc : false,
	ShowPubDate : false,
	TitleLinkTarget:'_self',
	DescCharacterLimit:1,
});
$('#nos').FeedEk( {
	FeedUrl : 'http://feeds.nos.nl/nosjournaal',
	MaxCount : 40,
	ShowDesc : false,
	ShowPubDate : false,
	TitleLinkTarget:'_self',
});
$('#nu').FeedEk( {
	FeedUrl : 'http://www.nu.nl/rss/Algemeen',
	MaxCount : 40,
	ShowDesc : false,
	ShowPubDate : false,
	TitleLinkTarget:'_self',
});
// Load the date for Prequel
$('#prequelDate').FeedEk( {
	FeedUrl: 'http://www.prequeladventure.com/feed/',
	MaxCount : 1,
	ShowDesc : false,
	ShowPubDate : true,
	DateFormat: 'MM/DD/YYYY',
	DateFormatLang:'en',
});

// Determine current date
var date = new Date();
var day = date.getDay();
var currentmonth = parseInt(date.getMonth()+1,10);
var currentdate = date.getDate();

$(window).load(function(){
	// Populate todo box
	var todo = localStorage.getItem("todo"); 
	document.getElementById('todobox').innerHTML = todo;
	
	// Display Prequel after an update
	var prequelDate_raw = document.querySelector(".itemDate").innerHTML;
	var regex = prequelDate_raw.match(/(\d+)/g);
	var regexdate = parseInt(regex[0], 10);
	var regexmonth = parseInt(regex[1], 10);
	//window.alert(prequelDate_raw + "\n" + regexdate + " " + regexmonth);
	if ((regexmonth == currentmonth) && (currentdate >= regexdate) && (currentdate <= regexdate+2)) {
		document.getElementById("prequelContainer").style.display="inline";
		$('#prequel').FeedEk( {
			FeedUrl: 'http://www.prequeladventure.com/feed/',
			MaxCount : 1,
			ShowDesc : true,
			ShowPubDate : false,
			TitleLinkTarget:'_self',
		});
		
		// Point fetched images to absolute address instead of relative, broken address
		$(document).ready(function () {
			var itemContentPresent = false;
			function checkForItemContent() {
				itemContentPresent = ($('.itemContent').length > 0) ? true : false;
				if (itemContentPresent) {
					$('#prequel').find('img').each(function() {
						var newSrc = 'http://www.prequeladventure.com' + $(this).attr('src');
						$(this).attr('src', newSrc);
					});
					window.clearInterval(doCheck); 
				}
			}
			var doCheck = window.setInterval(checkForItemContent, 250);
		});
	}
	
	// Change NOS links from desktop to mobile
	$("a[href^='http://feeds.nos.nl']").each(function() { 
		this.href = this.href.replace(/^http:\/\/feeds\.nos\.nl\/(.*)\//, "http://m.nos.nl/artikel/");
	});

	// XKCD content, WhatIf content
	if (day == 1 || day == 3 || day == 5) {
		$('#xkcd').FeedEk( {
			FeedUrl : 'https://xkcd.com/atom.xml',
			MaxCount : 1,
			ShowPubDate : false,
			TitleLinkTarget:'_self',
		});
		document.getElementById("xkcdContainer").style.display="inline";
	}
	if (day == 2 || day == 3) {
		$("#whatif").FeedEk( {
			FeedUrl : 'http://what-if.xkcd.com/feed.atom',
			MaxCount : 1,
			ShowPubDate : false,
			TitleLinkTarget:'_self',
		});
		document.getElementById("whatifContainer").style.display="inline";
		$(document).ready(function () {
			var itemContentPresent = false;
			function checkForItemContent() {
				itemContentPresent = ($('.itemContent').length > 0) ? true : false;
				if (itemContentPresent) {
					$('#whatif').find('img').each(function() {
						var newSrc = 'http://what-if.xkcd.com' + $(this).attr('src');
						$(this).attr('src', newSrc);
					});
					window.clearInterval(doCheck); 
				}
			}
			var doCheck = window.setInterval(checkForItemContent, 250);
		});
	}
	//window.alert("today "+currentdate+"\nprequel "+regexdate+"\n"+prequelDate_raw+"\n");
});

// Header title/weather panel switching
var wide = window.matchMedia( "screen and (min-width: 840px)" );
function toggleVisibility(id1, id2) {
	var hide = document.getElementById(id1);
	var show = document.getElementById(id2);
	hide.style.height = '0px';
	hide.style.overflow = 'hidden';
	if (wide.matches){
		show.style.height = '130px';
	}
	else {
		show.style.height = '80px';
	}
}

// Only load weather on click
function loadWeather() {
	$.simpleWeather({
		woeid: '729028', // Eindhoven, The Netherlands
		unit: 'c',
		success: function(weather) {
			html = '<p>'+weather.city+'<br />';
			html += weather.temp+'&deg;'+weather.units.temp+'<br />';
			html += weather.currently+'</p>';
			$("#weather2").html(html);
		},
		error: function(error) {
			$("#weather2").html('<p>'+error+'</p>');
		}
	});
	
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(function(position) {
			loadWeatherPos(position.coords.latitude+','+position.coords.longitude);
		});
	}
	
	function loadWeatherPos(location, woeid) {
		$.simpleWeather({
			location: location,
			woeid: woeid,
			unit: 'c',
			success: function(weather) {
				html = '<p>'+weather.city+'<br />';
				html += weather.temp+'&deg;'+weather.units.temp+'<br />';
				html += weather.currently+'</p>';
				$("#weather").html(html);
			},
			error: function(error) {
			$("#weather").html('<p>'+error+'</p>');
			}
		});
	}
	
}

// Blur the background, works on Gecko and WebKit browsers.
function toggleBlur(){
	if ( getCookie('blur') != 'true' ) {
		document.cookie='blur=true';
	} else {
		document.cookie='blur=false';
	}
	location.reload();
	// window.alert(getCookie('blur'));
}
if (getCookie('blur') == 'true') {
	document.getElementById('bg').style.filter = 'url(img/blur.svg#blur)';
	document.getElementById('bg').style.WebkitFilter = 'url(img/blur.svg#blur)';
}

// JavaScript cookie parsing
function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}

// Saves text from Todo to JS cookie
function saveTodo(){
	var todotext=document.getElementById('todobox').value;
	localStorage.setItem("todo", todotext);				
}