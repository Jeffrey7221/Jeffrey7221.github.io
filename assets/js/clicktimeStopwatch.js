// Javascript code for CodeTime Challenge
var times = new Array(2);

navigator.permissions.query({name:'geolocation'})
    .then(function(permissionStatus) {
        console.log('geolocation permission state is ', permissionStatus.state);
        if(permissionStatus.state == 'prompt') {
            // navigator.geolocation.getCurrentPosition(revealPosition,positionDenied,geoSettings);
        }
    });

    
button = document.getElementById("startButton");
button.innerHTML = "Start the Stopwatch";
button.onclick = function() {
    var time = new Date().getTime();
    if(button.innerHTML == "Start the Stopwatch") {
        times[0] = time;
        localStorage.setItem("startTime", time);
        button.innerHTML = "Stop the Stopwatch";
        navigator.geolocation.getCurrentPosition(function(position) {
            recordTableEntry(new Date(time).toLocaleString(), "start", position.coords.latitude, position.coords.longitude);    
        })
        
    } else {
        times[1] = time;
        button.innerHTML = "Start the Stopwatch";
        navigator.geolocation.getCurrentPosition(function(position) {
            recordTableEntry(new Date(time).toLocaleString(), "stop", position.coords.latitude, position.coords.longitude);
        })
    }
    // startStopWatch();
}

    // Retrieves table from localStorage if possible, if not then initalizes empty table
var table = document.getElementById("timeTable");
if(localStorage.getItem("timeTable")) {
    table.innerHTML = localStorage.getItem("timeTable");
    if(table.rows[table.rows.length-1].cells.length == 2) {
        button.innerHTML = "Stop the Stopwatch";
    }
}

var rowNum = table.rows.length;

function recordTableEntry(startDate, state, latitude, longitude) {
    var timeZone = -new Date().getTimezoneOffset()/60;
    if(timeZone == 0)
        timeZone = "-0";
    else if(timeZone > 0) {
        timeZone = "+" + timeZone;
    }
    if(state == "start") {
        startDate = startDate + "\nGMT" + timeZone;
        var newRow = table.insertRow(rowNum++);

            // Update time and date when starting
        var cell0 = newRow.insertCell(0);
        cell0.innerHTML = startDate;

            // Update latitude and longitude when starting
        var cell1 = newRow.insertCell(1);
        cell1.innerHTML = Math.round(latitude) +  ", " + Math.round(longitude);

            // Stores the updated table into localStorage
        localStorage.setItem("timeTable", table.innerHTML);
    } else if (state == "stop") {
        startDate = startDate + "\nGMT" + timeZone;
        var updateRow = table.rows[rowNum-1];

            // Update time and date when stopping
        var cell2 = updateRow.insertCell(2);
        cell2.innerHTML = startDate;

            // Update latitude and longitude when stopping
        var cell3 = updateRow.insertCell(3);
        cell3.innerHTML = Math.round(latitude) +  ", " + Math.round(longitude);

            // Calculate and update the elapsed time
        var cell4 = updateRow.insertCell(4);
        if(times[0] == null)
            times[0] = localStorage.getItem("startTime");
        var ms = times[1]-times[0];
        var seconds = Math.round((ms / 1000) % 60);
        var minutes = Math.round(((ms / (1000*60)) % 60));
        var hours   = Math.round(((ms / (1000*60*60)) % 24));
        cell4.innerHTML = pad(hours) + ":" +  pad(minutes) + ":" + pad(seconds);

            // Stores the updated table into localStorage
        localStorage.setItem("timeTable", table.innerHTML);
    }
}
        // Pads elapsed time into 00:00:00 format
function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

        // Code for the reset button, clears the local table and the local storage
document.getElementById("resetButton").onclick = function() {
    for(var i = --rowNum; i > 0; i--) {
        table.deleteRow(i);
    }
    rowNum = 1;
    button.innerHTML = "Start the Stopwatch";
    localStorage.removeItem("timeTable");
};

