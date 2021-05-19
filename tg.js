telegram_bot_id = "1887162285:AAFfWO8sf68mSLBCVVWuToZLq970FQeLZgc";
chat_id = "@morgancasale"
text = "prova";

var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.telegram.org/" + telegram_bot_id + "/sendMessage",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "cache-control": "no-cache"
    },
    "data": JSON.stringify({
      "chat_id": chat_id,
      "text": message
    })
}

function test2(){
    $.ajax(settings).done(function (response) {
        console.log(response);
    }); 
}
  