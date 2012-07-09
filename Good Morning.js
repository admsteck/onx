// Todo: tell me if it will be a good day to take the motorcycle or take the car.
// Todo: Get events from all calendars, not just the first one.

console.info("Starting " + device.currentSource);
var debug = false;
var zip = "zip code goes here for weather";
var key = "weather underground api key goes here";
var wuUrl = "http://api.wunderground.com/api/" + key + "/conditions/forecast/q/" + zip + ".json";
var greetingText = "Good morning Sir. ";
var weatherText = "";
var appointmentText = "";
var calendarUrls = ["https://www.google.com/calendar/feeds/google@gmail.com/public/basic",
                    "https://www.google.com/calendar/feeds/google2@gmail.com/public/basic",
                    "https://www.google.com/calendar/feeds/google3@gmail.com/public/basic"];
var calendarParams = "?alt=json&singleevents=true&orderby=starttime&sortorder=ascending";
var calendarMin = "&start-min=";
var calendarMax = "&start-max=";

function getWeather()
{
    device.ajax(
        {
        url: wuUrl
        },
        function(body, textStatus, response)
        {
            console.log("Weather success: " + textStatus);
            var forecast;
            if (!(body && (forecast = JSON.parse(body)))) {
                console.error("invalid weather body format");
                return;
            }
            var current = forecast.current_observation;                
            forecast = forecast.forecast.txt_forecast.forecastday[0];    
            weatherText = "It is currently " + current.temp_f + " degrees and " + current.weather + ". ";
            weatherText = weatherText + "The forecast for today is " + forecast.fcttext;
            device.signals.emit("ajaxComplete", {weather: "success"});
        },
        function(textStatus, response)
        {
            console.error("Unable to retrieve weather: " + textStatus);
            weatherText = "I'm sorry, but I was unable to retrieve the weather.";
            device.signals.emit("ajaxComplete", {weather: "fail"});
        });      
}

function getAppointments(){
    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0,0);
    var tomorrow = new Date(today.getTime());
    tomorrow.setDate(tomorrow.getDate()+1);
    var urlString = calendarUrls[0] + calendarParams + calendarMin + today.toISOString() + calendarMax + tomorrow.toISOString();
    console.log("getAppointments.urlString = " + urlString);
    device.ajax({
        url: urlString
    },
    function(body, textStatus, response){
        console.log("getAppointments success!");
        var feed;
        if (!(body && (feed = JSON.parse(body)))) {
            console.error("invalid appointment body format");
            return;
        }
        feed = feed.feed;
        var eventCount = (typeof feed.entry === "undefined") ? 0 : feed.entry.length;
        appointmentText = "You have " + eventCount + " appointments today.";
        device.signals.emit("ajaxComplete", {appointments: "fail"});
    },
    function(textStatus, response){
        console.error("Error retrieving calendar: " + textStatus);
        appointmentText = "I was unable to retrieve your schedule.";
        device.signals.emit("ajaxComplete", {appointments: "fail"});
    });
}

device.screen.on("unlock", function(){
    var lastDateScreenUnlocked = device.localStorage.getItem("lastDateScreenUnlocked");
    var today = new Date().toLocaleDateString();    
    console.log("Unlocked");
    if(!lastDateScreenUnlocked || lastDateScreenUnlocked != today || debug)
    {
        console.log("Running");
        device.localStorage.setItem("lastDateScreenUnlocked", today);
        getWeather();
        getAppointments();
    }
});

device.signals.on("ajaxComplete", function(signal){
    console.log("ajaxComplete");
    if(weatherText !== "" && appointmentText !== ""){
        console.log("Displaying notification.");
        var note = device.notifications.createMessageBox("Good Morning!");
        note.content = greetingText + " " + weatherText + " " + appointmentText;
        note.buttons = ["Calendar", "Weather", "Dismiss"];
        note.on("Calendar", function(){
            device.applications.launch("calendar", {}, function(err){console.error("Unable to launch calendar");});
        });
        note.on("Weather", function(){
            device.browser.showUrl("http://weather.com");
        });
        note.show();
        weatherText = "";
        appointmentText = "";
    }
});

console.info("Ending: " + device.currentSource);