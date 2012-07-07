console.info("Starting " + device.currentSource);
var startTimeString = "7:25 AM";
var endTimeString = "4:15 PM";
var days = [1,2,3,4,5];
var startTimerName = "com.thestechschultes.onx.Work.startTimerName";
var endTimerName = "com.thestechschultes.onx.Work.endTimerName";
var storageKey = "com.thestechschultes.onx.Work.storageKey";

// Import the parseTime function
var f = device.sharedStorage.getItem("function.parseTime");
eval(f);

// Fuction to be called when all parameters are met.
function start()
{
    console.log("Starting");
    device.sharedStorage.setItem(storageKey, "true");
    device.audio.ringerMode = "vibrate";
    device.network.wifiEnabled = false;
}

// Function to be called when leaving parameters
function stop()
{
    console.log("Stopping");
    device.sharedStorage.setItem(storageKey, "false");
    device.audio.ringerMode = "normal";
    device.network.wifiEnabled = true;
}

// Determine if current day is in days array
function isDay()
{
    if(days.indexOf(new Date().getDay())>=0){
        return true;
    }else{
        return false;
    }
}

// Start timer handler
function workStartHandler()
{
    console.log("Start Timer");
    if(isDay())
    {
        start();
    }
    else
    {
        console.info("Weekend");
    }
}

// End timer handler
function workEndHandler()
{
    console.log("End Timer");
    if(isDay())
    {
        stop();
    }
    else
    {
        console.info("Weekend");
    }
}

var startTime = parseTime(startTimeString, true);
var endTime = parseTime(endTimeString, true);
if(startTime>endTime){startTime.setDate(startTime.getDate()-1);}

console.log("StartTime: " + startTime.toLocaleString());
console.log("EndTime: " + endTime.toLocaleString());

device.scheduler.setTimer({
    name: startTimerName,
    time: startTime.getTime(),
    interval: "day",
    exact: false
    },
    workStartHandler
);
    
device.scheduler.setTimer({
    name: endTimerName,
    time: endTime.getTime(),
    interval: "day",
    exact: false
    },
    workEndHandler
); 

console.info("Ending " + device.currentSource);