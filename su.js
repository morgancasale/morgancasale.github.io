var locs;
var position;
var pol;
var playing = false;

var orange_not, red_not;

var red = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getLocation() {
    var pos;
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(pos = getPos);
    } else {
        pos = "Geolocation is not supported by this browser.";
    }
    return pos;
}

function getPos(pos){
    position = [pos.coords.longitude, pos.coords.latitude];
}

navigator.serviceWorker.register("sw.js");

function checkNotificationPromise() {
    try {
      Notification.requestPermission().then();
    } catch(e) {
      return false;
    }

    return true;
}

function sendNotitication(text){
    navigator.serviceWorker.ready.then(function(registration) {
        registration.showNotification(text);
    });
}

function closeNotification(text){
    navigator.serviceWorker.ready.then(function(registration) {
        registration.getNotifications(options).then(function(notifications) {
            notifications.forEach(function(notification){
                
            })
        })
    });
}


function askNotificationPermission() {
    // function to actually ask the permissions
    function handlePermission(permission) {
      // set the button to shown or hidden, depending on what the user answers
        if(permission === 'denied' || permission === 'default') {
            askNotificationPermission();
        } else {
        }
    }
  
    // Let's check if the browser supports notifications
    if (!('Notification' in window)) {
        window.alert("Questo browser non supporta le notifiche, non puoi giocare sfigato...");
        window.close();
    } else {
        if(checkNotificationPromise()) {
            Notification.requestPermission()
            .then((permission) => {
                handlePermission(permission);
            })
        } else {
            Notification.requestPermission(function(permission) {
                handlePermission(permission);
            });
        }
    }
}
    

function init(){

    document.getElementById("stop").style.display = "none";
    getLocation();
    askNotificationPermission();

    locs = JSON.parse(data);
    var select = document.getElementById("select");

    locs.forEach( function(loc){
        var opt = document.createElement("option");
        opt.value = loc.name;
        opt.innerHTML = loc.name;
        select.appendChild(opt);
    });
}

function get_Map(map_name){
    var tmp;
    if(map_name != ""){
        locs.forEach(function(loc){        
            if(loc.name == map_name){
                tmp = loc;
            }
        })
    } else{
        window.alert("Nessuna mappa è stata selezionata!");
        tmp = "err"
    }
    return tmp;
}

function in_Map(map, point){
    var tmp = robustPointInPolygon(map, point);
    var result;
    if(tmp === -1  || tmp === 0){
        result = true;
    } else{
        result = false;
    }
    return result;
}

function game(map){
    getLocation();

    var green = in_Map(map.limits[0].coordinates, position);
    var orange = in_Map(map.limits[1].coordinates, position);

    if(green && orange){
        red = false;
        document.body.style.backgroundColor = "#8bc34a";
        try{
            red_not.close();
        } catch(err){}
        try{
            orange_not.close();
        } catch(err){}
        
    } else if(!green && orange){
        red = false;
        document.body.style.backgroundColor = "#ff6f00";
        try{
            red_not.close();
        } catch(err){}
        try{
            orange_not.close();
        } catch(err){}
        orange_not = new Notification(map.limits[1].description);

    } else {
        document.body.style.backgroundColor = "#d50000";
        if(!red){ 
            red = true;
            try{
                red_not.close();
            } catch(err){}
            try{
                orange_not.close();
            } catch(err){}
            red_not = new Notification(map.limits[2].description);
        } else {
            sendNotitication("SQUALIFICATO E SEGNALATO!");
            //notifySqualified()
            window.close();
        }
    }
}

function stop(){
    playing = false;
    clearInterval(timeValue);
    document.getElementById("start").style.display = "block";
    document.getElementById("stop").style.display = "none";
    document.body.style.backgroundColor = "#222735";
}

var timeValue = null;
async function start(){
    playing = true;

    var map = get_Map(document.getElementById("select").value);

    if(map != "err"){
        document.getElementById("start").style.display = "none";
        document.getElementById("stop").style.display = "block";
        while(playing){
            game(map);
            await sleep(30000); 
        }
    }  
}

async function test(){
    sendNotitication("ciao");
    await sleep(2000);
    closeNotification("ciao");
}
