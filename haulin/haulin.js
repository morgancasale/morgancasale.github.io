function onSignIn(googleUser){
    var profile = googleUser.getBasicProfile();
    localStorage.setItem("profile", profile.getName()); 
}

function init(){
    var profile = localStorage.getItem("profile");
    if(profile!=null){
        document.getElementById("signin").style.display = "none";
        document.getElementById("table").style.display = "block";
    }
}

function checkCode(){
    var profile = localStorage.getItem("profile");
    var message = searchMessage(document.getElementById("code_box").value, profile);

    document.getElementById("table").style.display = "none";
    document.getElementById("message").style.display = "block";

    document.getElementById("message").innerHTML = message;
}

var clue_global;
function searchMessage(code, name){
    var message = "No clue found!";
    var clues = JSON.parse(clues_data);
    clues.forEach(function(clue){
        clue_global = clue.message;
        if(clue.code == code){
            var names = clue.names;
            names.forEach(function(clue_name){
                if(clue_name == name){
                    message = clue_global;
                }
            })
        }
    });
    return message;
}