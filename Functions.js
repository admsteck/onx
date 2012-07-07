console.info("Starting " + device.currentSource);

// Parse a string like "8:05 AM" and return a date object with the appropriate time.
// If correctDate is true and the new time is before the current time, it will return tomorrows date.
function parseTime(timeString, correctDate)
{
    if (timeString === '' || (typeof timeString === "undefined")) {
        return null;
    }
    
    correctDate = (typeof correctDate === "undefined") ? false : correctDate;
    
    var time = timeString.match(/^(\d+)(:(\d\d))?\s*((a|(p))m?)?$/i);
    if (time === null) {
        return null;
    }

    var hours = parseInt(time[1], 10);
    if (hours === 12 && !time[6]) {
        hours = 0;
    } else {
        hours += (hours < 12 && time[6]) ? 12 : 0;
    }
    var d = new Date();
    d.setHours(hours);
    d.setMinutes(parseInt(time[3], 10) || 0);
    d.setSeconds(0, 0);
    var now = new Date();
    if(now.getTime() > d.getTime() && correctDate){
        d.setDate(d.getDate()+1);
    }
    return d;
}
device.sharedStorage.setItem("function.parseTime", parseTime);

console.info("Ending " + device.currentSource);