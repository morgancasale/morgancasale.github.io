telegram_bot_id = "1887162285:AAFfWO8sf68mSLBCVVWuToZLq970FQeLZgc";  

function sendTgMsg(msg){
    if(ios){
        var xhttp = new XMLHttpRequest();
        url = "https://api.telegram.org/bot" + telegram_bot_id + "/sendMessage?chat_id=" + tg_id + "&text=" + msg;
        xhttp.open("POST", url, true);
        xhttp.send();
    }
}

function deleteLastTgMsg(){
    if(ios){
        var xhttp = new XMLHttpRequest();
        url = "https://api.telegram.org/bot" + telegram_bot_id + "/deleteMessage?chat_id=" + tg_id;
        xhttp.open("POST", url, true);
        xhttp.send();
    }
}

var chat_id = "145276351";