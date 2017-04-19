/* ******************************************

API:  http://openweathermap.org/api
Key: 75259c47cb3b351a43a89ce46060850b

Current weather:
http://api.openweathermap.org/data/2.5/weather?lat={_______}&lon={_______}&appid=75259c47cb3b351a43a89ce46060850b

5 days forecast:
http://api.openweathermap.org/data/2.5/forecast?lat={_______}&lon={_______}&appid=75259c47cb3b351a43a89ce46060850b

Icons:
http://openweathermap.org/weather-conditions

****************************************** */


var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var date = new Date();
var temperatureSymbol = 'c';
var latitude;
var longitude;


// get location, weather data for today and next days, and then show it on the screen
$(document).ready(function () {
	
	// get my location
	if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
			latitude = position.coords.latitude;
			longitude = position.coords.longitude; 

			// prepare the API call url
			var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=75259c47cb3b351a43a89ce46060850b';
			
			// call API for current weather data
			$.getJSON(apiUrl, function(json){
			
				// get data from JSON response
				var cityName = json.name;
				var countryCode = json.sys.country;
				var temperatureKelvin = json.main.temp;
				var temperatureCelcius = temperatureKelvin - 273.15;
				var wind = json.wind.speed + ' m/s, ' + degreeToDirection(json.wind.deg);
				var clouds = json.weather[0].main;
				var icon = json.weather[0].icon;
				
				// fill the screen with weather data
				$('#citySpan').html(cityName);
				$('#countryCodeSpan').html(countryCode);
				$('.dayTemp:eq(0)').html(temperatureCelcius);
				$('#windSpan').html(wind);
				$('#cloudsSpan').html(clouds);
				$('#iconSpan').html('<img src = "http://openweathermap.org/img/w/' + icon + '.png" alt="' + icon + '">');
				
				// prepare another API call url
				apiUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=75259c47cb3b351a43a89ce46060850b';
				
				// call API for next days weather
				$.getJSON(apiUrl, function(json){
					
					// fill weather data for next 3 days
					$('#day1').html(
						'<div class="dayName">Tomorrow</div>' + 
						'<div>Temp: ' + 
							'<span class="dayTemp">' + Math.floor(json.list[8].main.temp - 273.15) + '</span>' + 
							' <span class="dayTempSymbol">&#8451;</span>' + 
						'</div>' + 
						'<div>W: ' + json.list[8].wind.speed + ' m/s, ' + degreeToDirection(json.list[8].wind.deg) +
						'<img src = "http://openweathermap.org/img/w/' + json.list[8].weather[0].icon + '.png" alt="' + icon + '">'
					);
					
					$('#day2').html(
						'<div class="dayName">' + days[(date.getDay()+2)%7] + '</div>' +
						'<div>Temp: ' + 
							'<span class="dayTemp">' + Math.floor(json.list[16].main.temp - 273.15) + '</span>' + 
							' <span class="dayTempSymbol">&#8451;</span>' + 
						'</div>' + 
						'<div>W: ' + json.list[16].wind.speed + ' m/s, ' + degreeToDirection(json.list[16].wind.deg) +
						'<img src = "http://openweathermap.org/img/w/' + json.list[16].weather[0].icon + '.png" alt="' + icon + '">'
					);
					
					$('#day3').html(
						'<div class="dayName">' + days[(date.getDay()+3)%7] + '</div>' +
						'<div>Temp: ' + 
							'<span class="dayTemp">' + Math.floor(json.list[24].main.temp - 273.15) + '</span>' + 
							' <span class="dayTempSymbol">&#8451;</span>' + 
						'</div>' + 
						'<div>W: ' + json.list[24].wind.speed + ' m/s, ' + degreeToDirection(json.list[24].wind.deg) +
						'<img src = "http://openweathermap.org/img/w/' + json.list[24].weather[0].icon + '.png" alt="' + icon + '">'
					);
					
					// hide the loader and show the weather data
					$('#dataDiv').css('display', 'block');
					$('#loadingDataDiv').css('display', 'none');
				});
				
      });
    });
  }
	
	
	// changing temperature from C to F or from F to C
	$('body').on('click', '.dayTempSymbol', function(){
	
		// how many temperatures to change
		var temperatureSpans = $('.dayTempSymbol').length;
		
		// change C -> F
		if (temperatureSymbol === 'c') {
			for (var i = 0; i < temperatureSpans; i++) {
				var temperatureC = $('.dayTemp:eq(' + i + ')').text();
				var temperatureF = Math.round(temperatureC * 1.8 + 32);
				$('.dayTemp:eq(' + i + ')').html(temperatureF);
			}
			temperatureSymbol = 'f';
			$('.dayTempSymbol').html('&#8457;');
		} else { // change F -> C
			for (var i = 0; i < temperatureSpans; i++) {
				var temperatureF = $('.dayTemp:eq(' + i + ')').text();
				var temperatureC = Math.round((temperatureF - 32) / 1.8);
				$('.dayTemp:eq(' + i + ')').html(temperatureC);
			}
			temperatureSymbol = 'c';
			$('.dayTempSymbol').html('&#8451;');
		}
	});
});


// converting wind data from degrees to direction
function degreeToDirection(degree) {
  var whichOne = Math.floor((degree / 45) + 0.5);
  var directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[(whichOne % 8)];
}