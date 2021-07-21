var locs;
var position;
var pol;
var playing = false;
var ios = false;
var map;
var player_name;

var disqualified = "false";

var tg_id;

var red = false;

function setName(){
    player_name = document.getElementById("name_box").value;
    if(player_name == ""){
        window.alert("Nessun nome è stato inserito!");
        player_name = "err";
    }else{
        document.getElementById("name_box").disabled = true;
        document.getElementById("set_name").disabled = true;
        document.getElementById("select").disabled = false;
        document.getElementById("id_box").disabled = false;
        document.getElementById("start").disabled = false;
        document.getElementById("stop").disabled = false;
    }
}

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

function sendNotification(title){
    if(!ios){
        Notification.requestPermission().then((permission) => {});
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification(title);
        });
    }
}

function closeNotification(text){
    if(!ios){
        var a;
        navigator.serviceWorker.ready.then(
            function(registration) {
                registration.getNotifications().then(
                    function(notifications) {
                        notifications.forEach(
                            function(notification){
                                a = notification;
                                if(notification.title == text){
                                    notification.close();
                                }
                            }
                        )   
                    }
                )
            }
        );
    }
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
        ios = true;
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
    
    disqualified = localStorage.getItem("disqualified");

    if(disqualified == "true"){
        setDisqualified();
    } else{
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

        if(ios){
            document.getElementById("id_box").style.display = "block";
            document.getElementById("id_box_label").style.display = "block";
            ios = true;
        }
    }
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

async function setDisqualified(){
    disqualified = "true";
    localStorage.setItem("disqualified", disqualified);
    document.body.style.backgroundColor = "#d50000";
    document.getElementById("title").innerHTML = "SQUALIFICATO!";

    for(i=0; i<document.getElementsByClassName("not_disqualified").length; i++){
        document.getElementsByClassName("not_disqualified")[i].style.display = "none";
    }

    for(i=0; i<document.getElementsByClassName("disqualified").length; i++){
        document.getElementsByClassName("disqualified")[i].style.display = "block";
    }
    sendNotification("SQUALIFICATO E SEGNALATO!");
    sendTgMsg("SQUALIFICATO E SEGNALATO!");
    await sleep(1000);
    if(!ios){
        navigator.vibrate(3000);
    }
    closeNotification(map.limits[2].description); //close red notification
    closeNotification(map.limits[1].description); //close orange notification
    deleteLastTgMsg();
    
    notifyDisqualified();

    playing = false; 
}

function resetDisqualification(){
    if(document.getElementById("reset_box").value == "62699"){
        disqualified = "false";
        localStorage.setItem("disqualified", "false");
        location.reload();
    } else{
        window.alert("Password Errata!");
    }
}

async function game(map){
    var green = in_Map(map.limits[0].coordinates, position);
    var orange = in_Map(map.limits[1].coordinates, position);

    if(green && orange){
        red = false;
        document.body.style.backgroundColor = "#8bc34a";

        closeNotification(map.limits[2].description); //close red notification
        closeNotification(map.limits[1].description); //close orange notification
        deleteLastTgMsg();

    } else if(!green && orange){
        red = false;
        document.body.style.backgroundColor = "#ff6f00";

        closeNotification(map.limits[2].description); //close red notification
        closeNotification(map.limits[1].description); //close orange notification
        deleteLastTgMsg();
        
        sendNotification(map.limits[1].description); //sends orange notification
        sendTgMsg(map.limits[1].description);
        await sleep(1000);
        if(!ios){
            navigator.vibrate(2000);
        }
    } else {
        document.body.style.backgroundColor = "#d50000";
        if(!red){ 
            red = true;

            closeNotification(map.limits[2].description); //close red notification
            closeNotification(map.limits[1].description); //close orange notification
            deleteLastTgMsg();

            sendNotification(map.limits[2].description); //sends red notification
            sendTgMsg(map.limits[2].description);
            await sleep(1000);
            if(!ios){
                navigator.vibrate(19000);
            }
            
        } else {
            setDisqualified();
        }
    }
}

function stop(){
    playing = false;
    document.getElementById("name_box").disabled = false;
    document.getElementById("set_name").disabled = false;
    document.getElementById("start").style.display = "block";
    document.getElementById("stop").style.display = "none";
    document.body.style.backgroundColor = "#222735";
    document.getElementById("select").disabled = false;
    document.getElementById("id_box").disabled = false;
}

function getTgId(){
    var id = document.getElementById("id_box").value;
    if(id == ""){
        window.alert("Nessun id è stato inserito!");
        id = "err";
    }
    return id;
}

async function start(){
    playing = true;
    map = get_Map(document.getElementById("select").value);

    var tg_id_no_err = true;
    if(ios){
        tg_id = getTgId();
        if(tg_id == "err"){
            tg_id_no_err = false;
        }
    }

    if((map != "err") && tg_id_no_err){
        document.getElementById("id_box").disabled = true;
        document.getElementById("set_name").disabled = true;
        document.getElementById("select").disabled = true;
        document.getElementById("start").style.display = "none";
        document.getElementById("stop").style.display = "block";
        while(playing){
            game(map);
            await sleep(19000); 
        }
    }  
}

async function test(){
    window.close()
}
