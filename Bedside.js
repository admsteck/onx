var sleepHour = 20;
var wakeHour = 7;
var storageKey = "com.thestechschultes.onx.Bedside.storageKey";
var timerName = "com.thestechschultes.onx.Bedside.timerName";

device.battery.on("startedCharging", function(signal)
{
    //Set up the wake time
    var d = new Date();
    if(d.getHours() >= sleepHour && wakeHour < sleepHour)
    {
        d.setDate(d.getDate() +1);
    }
    var wakeTime = new Date(d.getFullYear(), d.getMonth(),d.getDate(),wakeHour,0,0,0);    
    console.log("Wake time is: " + wakeTime.toString());
    console.log("d.getHours is: " + d.getHours());
    if(d.getHours() >= sleepHour)
    {
        console.log("Starting");
        device.localStorage.setItem(storageKey,"true");
        device.audio.ringerMode= "silent";
        device.scheduler.setTimer({
            name:timerName,
            time:wakeTime.getTime(),
            exact:false
            },
            timerHandler
        );
    }
});

device.battery.on("stoppedCharging", function(signal)
{
    console.log("Stopped Charging");
    stop();
});

var timerHandler = function()
{
    console.log("Timer elapsed");
    stop();
};

var stop = function()
{    
    if(device.localStorage.getItem(storageKey)=="true")
    {
        console.log("Stopping");
        device.scheduler.removeTimer(timerName);
        device.localStorage.setItem(storageKey, "false");
        device.audio.ringerMode = "normal";
    }
};