console.info("Starting " + device.currentSource);
var sleepTime = "8:00 PM";
var wakeTime = "7:00 AM";
var storageKey = "com.thestechschultes.onx.Bedside.storageKey";
var wakeTimerName = "com.thestechschultes.onx.Bedside.wakeTimerName";
var sleepTimerName = "com.thestechschultes.onx.Bedside.sleepTimerName";

var f = device.sharedStorage.getItem("function.parseTime");
eval(f);

function wakeTimerHandler()
{
    console.log("wakeTimer elapsed");
    stop();
}

function sleepTimerHandler()
{
    console.log("sleepTimer elapsed");
    gotoSleep(parseTime(wakeTime, true));
}

function start()
{
    //Set up the wake time
    var now = new Date();
    var wake = parseTime(wakeTime, false);
    var sleep = parseTime(sleepTime, false);
    if(sleep>wake && now>sleep){wake.setDate(wake.getDate() + 1);}else if(now<wake){sleep.setDate(sleep.getDate()-1);}
    console.log("Current time is: " + now.toLocaleString());
    console.log("Wake time is: " + wake.toLocaleString());
    console.log("Sleep time is: " + sleep.toLocaleString());
    if(now.getTime() >= sleep.getTime() && now.getTime() < wake.getTime())
    {
        console.log("Starting");
        gotoSleep(wake);
    }
    else
    {
        sleep.setDate(sleep.getDate()+1);
        console.log("Charging but not time.");
        device.scheduler.setTimer({
            name: sleepTimerName,
            time: sleep.getTime()
            },
            sleepTimerHandler
        );
    }
}

function gotoSleep(w)
{
    console.log("Going to sleep");
    device.sharedStorage.setItem(storageKey,"true");
    device.audio.ringerMode= "silent";
    device.scheduler.setTimer({
        name:wakeTimerName,
        time:w.getTime()
        },
        wakeTimerHandler
    );
}

function stop()
{    
    if(device.sharedStorage.getItem(storageKey)=="true")
    {
        console.log("Stopping / Waking up");
        device.sharedStorage.setItem(storageKey, "false");
        device.audio.ringerMode = "normal";
        try{device.scheduler.removeTimer(wakeTimerName);}catch(wakeErr){}
        try{device.scheduler.removeTimer(sleepTimerName);}catch(sleepErr){}
    }
}

device.battery.on("startedCharging", function(signal)
{
    console.log("Started Charging");
    start();
});

device.battery.on("stoppedCharging", function(signal)
{
    console.log("Stopped Charging");
    stop();
});

if(device.battery.status.isCharging){
    console.log("Already charging");
    start();
}

console.info("Ending " + device.currentSource);